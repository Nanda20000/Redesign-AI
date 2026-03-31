import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { extractContentFromStructure } from "@/../lib/content-injector";
import { processContentWithAI } from "@/../lib/ai-content-processor";

// User agents to rotate through (helps avoid bot detection)
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
];

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 2000; // 2 seconds
const NAVIGATION_TIMEOUT = 30000; // 30 seconds

interface ExtractedImage {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

interface ExtractedSection {
  sourceIndex?: number;
  class?: string;
  id?: string;
  heading?: string;
  textPreview: string;
  text?: string;
  links?: string[];
  images?: ExtractedImage[];
  detectedType?: string | null;
}

function uniqueInOrder<T>(items: T[]): T[] {
  const seen = new Set<T>();
  const output: T[] = [];

  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      output.push(item);
    }
  }

  return output;
}

function normalizeStructuralSections(sectionTypes: string[]): string[] {
  const cleaned = sectionTypes.filter(Boolean);
  if (cleaned.length === 0) return [];

  const firstNavbarIndex = cleaned.findIndex((section) => section === 'navbar');
  const lastFooterIndex = [...cleaned].reverse().findIndex((section) => section === 'footer');
  const resolvedLastFooterIndex = lastFooterIndex >= 0 ? cleaned.length - 1 - lastFooterIndex : -1;

  return cleaned.filter((section, index) => {
    if (section === 'navbar') return index === firstNavbarIndex;
    if (section === 'footer') return index === resolvedLastFooterIndex;
    return true;
  });
}

function buildSectionBuckets(
  classifiedSections: Array<{ type: string; text: string; sourceIndex?: number }>,
  rawSections: ExtractedSection[],
  pageImages: ExtractedImage[]
) {
  const buckets: Record<string, Array<{
    sourceIndex?: number;
    heading?: string;
    text: string;
    className?: string;
    id?: string;
    links?: string[];
    images?: ExtractedImage[];
  }>> = {};

  for (const classified of classifiedSections) {
    const sourceSection = typeof classified.sourceIndex === 'number'
      ? rawSections[classified.sourceIndex]
      : undefined;

    // Also try to find by text similarity if sourceIndex lookup fails
    const effectiveSection = sourceSection || rawSections.find(s => 
      s.textPreview && classified.text && 
      s.textPreview.slice(0, 50) === classified.text.slice(0, 50)
    );

    const bucketItem = {
      sourceIndex: classified.sourceIndex,
      heading: effectiveSection?.heading,
      text: effectiveSection?.text || effectiveSection?.textPreview || classified.text,
      className: effectiveSection?.class,
      id: effectiveSection?.id,
      links: effectiveSection?.links || [],
      images: effectiveSection?.images || [],  // Per-section images from extractVisualAssets
    };

    if (!buckets[classified.type]) {
      buckets[classified.type] = [];
    }

    buckets[classified.type].push(bucketItem);
  }

  // Ensure hero always has images — fall back to first large image on the page if hero bucket has no images
  if (!buckets['hero'] || buckets['hero'].every(b => !b.images?.length)) {
    // Find large landscape images from the page (width > height, not logos)
    const heroImages = pageImages.filter(img => 
      img.width > 400 && img.height > 200 && 
      !img.src.includes('logo') && !img.src.includes('icon')
    ).slice(0, 3);
    
    if (heroImages.length > 0) {
      if (!buckets['hero']) buckets['hero'] = [];
      if (buckets['hero'].length === 0) {
        buckets['hero'].push({ text: 'Hero section', images: heroImages });
      } else {
        // Merge into existing hero bucket
        buckets['hero'][0].images = [...(buckets['hero'][0].images || []), ...heroImages];
      }
    }
  }

  if (!buckets.navbar) {
    buckets.navbar = [];
  }

  if (!buckets.footer) {
    buckets.footer = [];
  }

  if (!buckets.gallery && pageImages.length > 0) {
    buckets.gallery = [
      {
        text: 'Gallery content derived from page images',
        images: pageImages,
      },
    ];
  }

  return buckets;
}

async function captureWithRetry(url: string, maxRetries = MAX_RETRIES) {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    let browser;
    try {
      console.log(`[Analyze] Attempt ${attempt}/${maxRetries + 1} to capture: ${url}`);
      
      // Launch browser with additional options for reliability
      browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
        ],
      });
      
      const context = await browser.newContext({
        viewport: { width: 1920, height: 3000 },
        userAgent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        bypassCSP: true,
      });

      const page = await context.newPage();

      // Disable animations to fix slider/hero issues
      await page.addStyleTag({
        content: "* { animation: none !important; transition: none !important; }"
      });

      // Block only fonts to speed up loading (allow ALL images)
      await page.route("**/*.{ttf,otf,woff,woff2,eot}", (route) => route.abort());

      // Set additional headers to appear more like a real browser
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      });

      // Navigate with retry-friendly settings - wait for DOM content loaded
      try {
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
      } catch (navError: any) {
        console.error(`[Analyze] Navigation error: ${navError.message}`);

        // If we got a connection error, throw to trigger retry
        if (navError.message.includes("ERR_CONNECTION") ||
            navError.message.includes("net::ERR_") ||
            navError.message.includes("Timeout")) {
          throw navError;
        }

        // Otherwise, try to continue with what we have
        console.log("[Analyze] Navigation had issues but continuing...");
      }

      // Manual delay to ensure full page load
      await page.waitForTimeout(5000);

      // Fully scroll page to load lazy images - scroll down
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 200;

          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= document.body.scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 50);
        });
      });

      // Wait at bottom for images to load
      await page.waitForTimeout(2000);

      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));

      // Wait at top for images to load
      await page.waitForTimeout(2000);

      // Force load lazy images - multiple strategies
      await page.evaluate(() => {
        // Handle data-src and data-lazy
        document.querySelectorAll("img").forEach(img => {
          if (img.dataset.src) img.src = img.dataset.src;
          if (img.dataset.lazy) img.src = img.dataset.lazy;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          if (img.loading === "lazy") img.loading = "eager";
          img.decoding = "sync";
        });

        // Trigger intersection observers for lazy loading
        const observers = (window as any).__lazyLoadObservers || [];
        observers.forEach((observer: any) => {
          document.querySelectorAll("img").forEach(img => {
            observer.observe(img);
          });
        });
      });

      // Wait for ALL images to load
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));
      });

      // Force reveal any remaining lazy images with loading class
      await page.evaluate(() => {
        document.querySelectorAll(".lazy, .lazyload, .lazy-load, [data-original], [data-src]").forEach(el => {
          el.classList.remove("lazy", "lazyload", "lazy-load");
        });
      });

      // Wait for background images to render
      await page.waitForTimeout(3000);

      // Log image count for debugging
      const imageCount = await page.evaluate(() => document.images.length);
      console.log(`[Analyze] Total images on page: ${imageCount}`);

      // Generate filename from URL
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/[^a-z0-9]/gi, "_");
      const timestamp = Date.now();
      const filename = `${hostname}_${timestamp}.png`;
      const screenshotsDir = path.join(process.cwd(), "public", "screenshots");

      // Ensure directory exists
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      const filePath = path.join(screenshotsDir, filename);

      // Capture screenshot
      await page.screenshot({ path: filePath, fullPage: true });

      console.log("Screenshot captured after scroll and image load");

      // Extract page structure with HTML-parsing-based section classification
      const structure = await page.evaluate(() => {
        const extractUrls = (value: string | null | undefined) => {
          if (!value) return [];
          const matches = Array.from(value.matchAll(/url\((['"]?)(.*?)\1\)/g));
          return matches
            .map(match => match[2])
            .filter(url => url && !url.startsWith('data:'))
            .map(url => {
              try {
                return new URL(url, window.location.href).href;
              } catch {
                return '';
              }
            })
            .filter(Boolean);
        };

        const extractVisualAssets = (root: ParentNode) => {
          const imageMap = new Map<string, { src: string; alt: string; title: string; width: number; height: number }>();

          Array.from(root.querySelectorAll('img')).forEach((img) => {
            const candidateSrc =
              img.currentSrc ||
              img.getAttribute('src') ||
              img.getAttribute('data-src') ||
              img.getAttribute('data-lazy') ||
              '';

            if (!candidateSrc || candidateSrc.startsWith('data:')) {
              return;
            }

            try {
              const resolved = new URL(candidateSrc, window.location.href).href;
              if (!imageMap.has(resolved)) {
                imageMap.set(resolved, {
                  src: resolved,
                  alt: img.alt || '',
                  title: img.title || '',
                  width: img.naturalWidth || 0,
                  height: img.naturalHeight || 0,
                });
              }
            } catch {
              // Ignore malformed URLs
            }
          });

          Array.from(root.querySelectorAll<HTMLElement>('*')).forEach((element) => {
            const candidates = [
              window.getComputedStyle(element).backgroundImage,
              element.style.backgroundImage,
              element.getAttribute('data-background'),
              element.getAttribute('data-bg'),
            ];

            candidates.flatMap(extractUrls).forEach((url) => {
              if (!imageMap.has(url)) {
                imageMap.set(url, {
                  src: url,
                  alt: element.getAttribute('aria-label') || '',
                  title: element.getAttribute('title') || '',
                  width: element.clientWidth || 0,
                  height: element.clientHeight || 0,
                });
              }
            });
          });

          return Array.from(imageMap.values());
        };

        // === SECTION TYPE DETECTION PATTERNS ===
        const SECTION_PATTERNS: Record<string, string[]> = {
          navbar: ['navbar', 'nav-', 'navigation', 'header', 'top-bar', 'menu', 'main-nav', 'primary-nav'],
          hero: ['hero', 'banner', 'slider', 'carousel', 'jumbotron', 'intro', 'cover', 'masthead', 'hero-section'],
          about: ['about', 'who-we-are', 'our-story', 'team', 'mission', 'vision', 'about-us'],
          features: ['feature', 'service', 'solution', 'offer', 'what-we-do', 'department', 'course', 'program', 'services', 'what-we-offer'],
          testimonials: ['testimonial', 'review', 'feedback', 'client', 'what-they-say', 'customer', 'success-story'],
          blog: ['blog', 'news', 'article', 'post', 'insight', 'update', 'press', 'latest-news'],
          contact: ['contact', 'reach', 'touch', 'enquiry', 'get-in-touch', 'location', 'map', 'contact-us'],
          cta: ['cta', 'call-to-action', 'get-started', 'signup', 'register', 'enroll', 'action', 'start-now'],
          gallery: ['gallery', 'portfolio', 'work', 'project', 'photo', 'image-grid', 'our-work'],
          pricing: ['pricing', 'price', 'plan', 'package', 'subscription', 'cost', 'pricing-plan'],
          footer: ['footer', 'bottom', 'copyright', 'sitemap', 'site-footer'],
        };

        const NAV_KEYWORDS = ['home', 'about', 'services', 'products', 'contact', 'pricing', 'features', 'blog', 'faq', 'login', 'sign', 'register', 'portfolio', 'team', 'careers'];
        const FOOTER_KEYWORDS = ['copyright', 'privacy', 'terms', 'contact', 'address', 'phone', 'email', 'subscribe', 'newsletter', 'follow us', 'all rights reserved', '©'];

        // Helper: detect section type from class/id/text
        const detectSectionType = (element: Element): string | null => {
          const tagName = element.tagName.toLowerCase();
          const className = (element.className || '').toLowerCase();
          const id = (element.id || '').toLowerCase();
          const textContent = (element.textContent || '').toLowerCase();

          // Priority 1: Semantic HTML elements
          if (tagName === 'nav') return 'navbar';
          if (tagName === 'header') {
            // Check if header contains nav
            if (element.querySelector('nav')) return 'navbar';
            // Check if it's likely a hero
            const hasHeroPattern = className.split(/\s+/).some(c => 
              SECTION_PATTERNS.hero.some(p => c.includes(p))
            );
            if (hasHeroPattern) return 'hero';
          }
          if (tagName === 'footer') return 'footer';
          if (tagName === 'main') return null; // main is a container, not a section type
          if (tagName === 'section') {
            // Check class/id for specific type
            for (const [type, patterns] of Object.entries(SECTION_PATTERNS)) {
              for (const pattern of patterns) {
                if (className.includes(pattern) || id.includes(pattern)) {
                  return type;
                }
              }
            }
          }
          if (tagName === 'article') return 'blog';
          if (tagName === 'aside') return 'cta';

          // Priority 2: Class/ID pattern matching
          for (const [type, patterns] of Object.entries(SECTION_PATTERNS)) {
            for (const pattern of patterns) {
              if (className.includes(pattern) || id.includes(pattern)) {
                return type;
              }
            }
          }

          // Priority 3: Content-based heuristics
          // Navbar: contains <nav> child or many navigation-like links
          if (element.querySelector('nav')) return 'navbar';
          
          // Hero: first large element with h1
          const heading = element.querySelector('h1, h2, h3');
          if (heading && element.getBoundingClientRect().top < 500) {
            const rect = element.getBoundingClientRect();
            if (rect.height > 300 && rect.width > 800) {
              return 'hero';
            }
          }

          // Gallery: contains multiple images
          const imgCount = element.querySelectorAll('img').length;
          if (imgCount >= 3) return 'gallery';

          // Contact: contains email/phone patterns
          if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(textContent) || /@/.test(textContent)) {
            return 'contact';
          }

          // Pricing: contains "$" or price text
          if (/[$£€]\d+|\d+[$£€]|\d+\s*(USD|EUR|GBP)/i.test(textContent)) {
            return 'pricing';
          }

          // Footer: contains copyright
          if (/©|copyright/i.test(textContent)) {
            return 'footer';
          }

          return null;
        };

        const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
          .map((el) => el.textContent?.trim())
          .filter((text): text is string => !!text);

        // === IMPROVED NAVBAR DETECTION (Priority-based) ===
        // Check in priority order:
        // 1. <header> element containing <nav>
        // 2. First <nav> element
        // 3. Element with class/id matching navbar patterns
        // 4. Any element with 3+ links that are navigation-keyword links near top of page

        let navbarElement: Element | null = null;
        let navbarLinks: string[] = [];

        // Priority 1: header containing nav
        navbarElement = document.querySelector('header nav');
        
        // Priority 2: first nav element
        if (!navbarElement) {
          navbarElement = document.querySelector('nav');
        }

        // Priority 3: element with navbar class/id patterns
        if (!navbarElement) {
          navbarElement = document.querySelector('[class*="navbar"],[class*="nav-"],[id*="navbar"],[id*="nav"]');
        }

        // Priority 4: element with 3+ nav keyword links near top
        if (!navbarElement) {
          const candidates = Array.from(document.querySelectorAll('div, section, header, ul'));
          for (const candidate of candidates) {
            const rect = candidate.getBoundingClientRect();
            if (rect.top < 200) {
              const links = Array.from(candidate.querySelectorAll('a'))
                .map(a => a.textContent?.trim().toLowerCase() || '');
              const hasNavKeywords = links.some(link =>
                NAV_KEYWORDS.some(kw => link.includes(kw))
              );
              if (hasNavKeywords && links.length >= 3) {
                navbarElement = candidate;
                break;
              }
            }
          }
        }

        // Extract navbar links
        if (navbarElement) {
          navbarLinks = Array.from(navbarElement.querySelectorAll('a'))
            .map(link => link.textContent?.trim().toLowerCase() || '')
            .filter(text => text.length > 0);
        }

        const uniqueNav = Array.from(new Set(navbarLinks));
        const hasNavbar = navbarElement !== null && uniqueNav.length >= 2;

        // === IMPROVED FOOTER DETECTION ===
        let footerElement: Element | null = null;

        // Priority 1: <footer> element
        footerElement = document.querySelector('footer');

        // Priority 2: element with footer class/id patterns
        if (!footerElement) {
          footerElement = document.querySelector('[class*="footer"],[id*="footer"],[id*="site-footer"]');
        }

        // Priority 3: element near bottom with footer-like content
        if (!footerElement) {
          const allElements = Array.from(document.querySelectorAll('div, section'));
          const viewportHeight = window.innerHeight;

          for (const element of allElements) {
            const rect = element.getBoundingClientRect();
            const documentHeight = document.documentElement.scrollHeight;
            const isNearBottom = rect.top > (documentHeight - viewportHeight) * 0.7;

            if (isNearBottom) {
              const text = element.textContent?.toLowerCase() || '';
              const hasFooterKeywords = FOOTER_KEYWORDS.some(keyword => text.includes(keyword));
              const hasContactInfo = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) || /@/.test(text);
              const hasCopyright = /©|copyright/i.test(text);

              if (hasFooterKeywords || hasContactInfo || hasCopyright) {
                footerElement = element;
                break;
              }
            }
          }
        }

        const hasFooter = footerElement !== null;

        // === HTML-PARSING-BASED SECTION DETECTION ===
        // Collect all candidate elements using semantic and pattern-based selectors
        const candidateSelectors = [
          // Semantic HTML elements
          'section', 'article', 'aside',
          // Direct children of body (excluding script/style/nav/header/footer which are handled separately)
          'body > div:not(:first-child):not(:last-child)',
          'body > main > *',
          // Common layout containers
          '[class*="container"], [class*="wrapper"], [class*="inner"]',
          '[class*="row"], [class*="col-"], [class*="grid"]',
          // Section-specific patterns
          '[class*="section"], [class*="block"], [class*="area"], [class*="zone"]',
          '[class*="hero"], [class*="banner"], [class*="intro"], [class*="cover"]',
          '[class*="feature"], [class*="service"], [class*="offer"], [class*="solution"]',
          '[class*="about"], [class*="story"], [class*="team"], [class*="mission"]',
          '[class*="testimonial"], [class*="review"], [class*="client"], [class*="success"]',
          '[class*="blog"], [class*="news"], [class*="post"], [class*="article"]',
          '[class*="contact"], [class*="reach"], [class*="location"], [class*="map"]',
          '[class*="cta"], [class*="call-to-action"], [class*="signup"], [class*="subscribe"]',
          '[class*="gallery"], [class*="portfolio"], [class*="work"], [class*="project"]',
          '[class*="pricing"], [class*="price"], [class*="plan"], [class*="package"]',
          '[class*="content"], [class*="main"], [class*="primary"], [class*="secondary"]',
          // ID-based patterns
          '[id*="section"], [id*="block"], [id*="area"]',
          '[id*="hero"], [id*="banner"], [id*="intro"]',
          '[id*="feature"], [id*="service"], [id*="offer"]',
          '[id*="about"], [id*="team"], [id*="story"]',
          '[id*="testimonial"], [id*="review"], [id*="client"]',
          '[id*="blog"], [id*="news"], [id*="post"]',
          '[id*="contact"], [id*="location"], [id*="map"]',
          '[id*="cta"], [id*="signup"], [id*="subscribe"]',
          '[id*="gallery"], [id*="portfolio"], [id*="work"]',
          '[id*="pricing"], [id*="price"], [id*="plan"]',
          // Large div containers that might be sections
          'div[class]:not([class=""])',
        ];

        const candidateElements = Array.from(document.querySelectorAll(candidateSelectors.join(', ')));

        // Also include direct children of main/article containers
        const mainContainers = Array.from(document.querySelectorAll('main, [role="main"], article'));
        for (const container of mainContainers) {
          for (const child of Array.from(container.children)) {
            if (!candidateElements.includes(child)) {
              candidateElements.push(child);
            }
          }
        }

        // Include direct children of body that are large divs
        const bodyChildren = Array.from(document.body.children);
        for (const child of bodyChildren) {
          const tagName = child.tagName.toLowerCase();
          // Skip script, style, nav, header, footer (handled separately)
          if (['script', 'style', 'noscript', 'nav', 'header', 'footer'].includes(tagName)) {
            continue;
          }
          if (!candidateElements.includes(child)) {
            candidateElements.push(child);
          }
        }

        // Filter and deduplicate candidates
        const seen = new Set<Element>();
        const uniqueCandidates = candidateElements.filter((element) => {
          if (seen.has(element)) return false;
          seen.add(element);
          return true;
        });

        // Filter meaningful sections
        const baseMeaningfulSections = uniqueCandidates
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
            const imageCount = element.querySelectorAll('img').length;
            const headingCount = element.querySelectorAll('h1, h2, h3, h4').length;
            const linkCount = element.querySelectorAll('a').length;
            const meaningfulChildren = Array.from(element.children).filter((child) => {
              const childText = (child.textContent || '').replace(/\s+/g, ' ').trim();
              return childText.length > 40 || child.querySelectorAll('img').length > 0;
            }).length;

            // Exclude too small elements
            if (rect.width < 100 || rect.height < 60) return false;
            // Exclude script/style/noscript
            if (['script', 'style', 'noscript'].includes(element.tagName.toLowerCase())) return false;
            // Only exclude overly large generic divs if they have very little unique content
            // (relaxed to allow more sections through)
            if (meaningfulChildren >= 5 && text.length > 1500 && element.tagName.toLowerCase() === 'div') {
              // But still include if it has images or headings
              if (imageCount > 0 || headingCount > 0) {
                return true;
              }
              return false;
            }

            // Must have meaningful content (lowered thresholds)
            return text.length >= 20 || imageCount > 0 || headingCount > 0 || linkCount >= 2;
          })
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

        // Remove nested duplicates (keep outermost meaningful container)
        let meaningfulSections = baseMeaningfulSections
          .filter((element, _, elements) => {
            return !elements.some(other =>
              other !== element &&
              other.contains(element) &&
              other.getBoundingClientRect().height <= element.getBoundingClientRect().height * 1.5
            );
          })
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

        // Homepage fallback: if too few sections, include more candidates
        if (meaningfulSections.length < 8) {
          meaningfulSections = baseMeaningfulSections.slice(0, 30);
        }

        // Build sections array with detectedType
        const sections = meaningfulSections.map((section, index) => {
          const classList = Array.from(section.classList);
          const id = section.id;
          const fullText = (section.textContent || '').replace(/\s+/g, ' ').trim();
          const heading = section.querySelector('h1, h2, h3, h4')?.textContent?.replace(/\s+/g, ' ').trim();
          const textPreview = fullText.slice(0, 400);
          const sectionImages = extractVisualAssets(section);
          const links = Array.from(section.querySelectorAll('a'))
            .map(link => link.textContent?.replace(/\s+/g, ' ').trim() || '')
            .filter(Boolean)
            .slice(0, 8);

          // Detect section type from HTML patterns
          const detectedType = detectSectionType(section);

          return {
            sourceIndex: index,
            class: classList.length > 0 ? classList.join(" ") : undefined,
            id: id || undefined,
            heading: heading || undefined,
            textPreview,
            text: fullText.slice(0, 2000),
            links,
            images: sectionImages,
            detectedType,
          };
        });

        // === IMAGE EXTRACTION ===
        const images = extractVisualAssets(document);

        return {
          headings,
          navigation: uniqueNav,
          sections,
          hasNavbar,
          hasFooter,
          navbarLinks: uniqueNav,
          images,
        };
      });

      // Extract internal links from the page
      const internalLinks = await page.evaluate((baseUrl) => {
        const links = Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.getAttribute('href') || '')
          .filter(href => href !== '' && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
          .map(href => {
            try {
              const resolved = new URL(href, baseUrl).href;
              // Strip query strings and fragments for cleaner URLs
              const url = new URL(resolved);
              return url.origin + url.pathname;
            } catch { return null; }
          })
          .filter((href): href is string => href !== null && href.startsWith(baseUrl));
        return [...new Set(links)].slice(0, 20);
      }, url);

      await browser.close();

      return { success: true, structure, screenshotPath: `/screenshots/${filename}`, internalLinks };
    } catch (error: any) {
      lastError = error;
      console.error(`[Analyze] Attempt ${attempt} failed:`, error.message);
      
      if (browser) {
        await browser.close().catch(() => {});
      }

      // Don't retry on certain errors
      if (error.message.includes("ERR_INTERNET_DISCONNECTED") ||
          error.message.includes("ENETUNREACH") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("net::ERR_CERT") ||
          error.message.includes("net::ERR_NAME_NOT_RESOLVED") ||
          error.message.includes("net::ERR_BAD_SECURE_PORT")) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt <= maxRetries) {
        const delay = BASE_DELAY * Math.pow(2, attempt - 1);
        console.log(`[Analyze] Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("Failed to capture screenshot after all retries");
}

// Fallback: Try to fetch and parse HTML directly if Playwright fails
async function fetchWithFallback(url: string) {
  console.log(`[Analyze] Attempting fallback fetch for: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENTS[0],
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Simple HTML parsing to extract basic structure
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const headings: string[] = [];
    const h1Matches = html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
    const h2Matches = html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi);
    const h3Matches = html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/gi);

    for (const match of h1Matches) headings.push(match[1].trim());
    for (const match of h2Matches) headings.push(match[1].trim());
    for (const match of h3Matches) headings.push(match[1].trim());

    // Detect navbar in fallback
    const NAV_KEYWORDS = ['home', 'about', 'services', 'products', 'contact', 'pricing', 'features', 'blog'];
    const hasNavTag = /<nav[^>]*>/i.test(html);
    const hasNavClass = /class=["'][^"']*nav[^"']*["']/i.test(html);
    const navLinksMatch = html.match(/<a[^>]*>([^<]+)<\/a>/gi);
    const navLinks = navLinksMatch 
      ? navLinksMatch.map(link => {
          const text = link.replace(/<[^>]+>/g, '').trim().toLowerCase();
          return text;
        }).filter(text => NAV_KEYWORDS.some(kw => text.includes(kw)))
      : [];
    
    const hasNavbar = hasNavTag || hasNavClass || navLinks.length >= 2;

    // Detect footer in fallback
    const hasFooterTag = /<footer[^>]*>/i.test(html);
    const hasFooterClass = /class=["'][^"']*footer[^"']*["']/i.test(html);
    const hasCopyright = /©|copyright/i.test(html);
    const hasFooter = hasFooterTag || hasFooterClass || hasCopyright;

    // Extract sections by looking for common patterns
    const sections: Array<{ class?: string; id?: string; textPreview: string; detectedType?: null }> = [];
    const sectionPatterns = [
      /<section[^>]*>([\s\S]*?)<\/section>/gi,
      /<div[^>]*class=["'][^"']*(?:hero|banner|content|main)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    ];

    let sectionIndex = 0;
    for (const pattern of sectionPatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        sectionIndex++;
        const classMatch = match[0].match(/class=["']([^"']+)["']/i);
        const idMatch = match[0].match(/id=["']([^"']+)["']/i);
        const textContent = match[1].replace(/<[^>]+>/g, ' ').trim().slice(0, 200);

        if (textContent.length > 20) {
          sections.push({
            class: classMatch?.[1],
            id: idMatch?.[1],
            textPreview: textContent,
            detectedType: null,
          });
        }
      }
    }

    // If no sections found, create a default one from body
    if (sections.length === 0) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        const bodyText = bodyMatch[1].replace(/<[^>]+>/g, ' ').trim().slice(0, 500);
        sections.push({
          textPreview: bodyText,
          detectedType: null,
        });
      }
    }

    // Extract images from HTML (fallback)
    const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*(?:title=["']([^"']*)["'])?[^>]*>/gi);
    const images: Array<{ src: string; alt: string; title: string; width: number; height: number }> = [];
    for (const match of imgMatches) {
      const src = match[1];
      const alt = match[2] || "";
      const title = match[3] || "";
      if (src && !src.startsWith("data:") && src.trim() !== "") {
        images.push({ src, alt, title, width: 0, height: 0 });
      }
    }

    return {
      success: true,
      structure: {
        headings,
        navigation: navLinks.slice(0, 10),
        sections,
        hasNavbar,
        hasFooter,
        navbarLinks: navLinks.slice(0, 10),
        images,
      },
      screenshotPath: null,
      fallback: true,
      internalLinks: [],
    };
  } catch (error: any) {
    console.error("[Analyze] Fallback fetch failed:", error.message);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, pageSlug = 'index' } = body;

    if (!url) {
      return NextResponse.json(
        { status: "error", message: "URL is required" },
        { status: 400 }
      );
    }

    console.log(`[Analyze] Received request to analyze: ${url}`);
    console.log(`[Analyze] Page slug: ${pageSlug}`);

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { status: "error", message: "Invalid URL format. Please include http:// or https://" },
        { status: 400 }
      );
    }

    let result;
    let usedFallback = false;

    // Try Playwright first
    try {
      result = await captureWithRetry(url);
    } catch (playwrightError: any) {
      console.error("[Analyze] Playwright failed, trying fallback fetch:", playwrightError.message);
      
      // Fallback to direct fetch if Playwright fails
      try {
        result = await fetchWithFallback(url);
        usedFallback = true;
      } catch (fallbackError: any) {
        // Both methods failed
        throw fallbackError;
      }
    }

    const { structure, screenshotPath } = result;
    const { images } = structure;

    // Log extracted images
    console.log("[Analyze] Extracted images:", images.length);

    // Extract content from structure
    const extractedContent = extractContentFromStructure({
      headings: structure.headings,
      sections: structure.sections,
      navigation: structure.navigation,
      hasFooter: structure.hasFooter,
      images,
    });

    console.log('[Analyze] Extracted content:', {
      headings: extractedContent.headings.length,
      paragraphs: extractedContent.paragraphs.length,
      navigationLinks: extractedContent.navigationLinks.length,
      images: images.length,
    });

    // Process content with AI for better section-specific extraction
    console.log('[Analyze] Processing content with AI...');
    const processedContent = await processContentWithAI({
      headings: extractedContent.headings,
      paragraphs: extractedContent.paragraphs,
      navigationLinks: extractedContent.navigationLinks,
      footerText: extractedContent.footerText,
    });

    // Merge processed content with extracted content
    const enrichedContent = {
      ...extractedContent,
      processed: processedContent,
      images,
      sourceUrl: url,
    };

    console.log('[Analyze] AI content processing complete');

    // Infer page type from URL
    const inferPageType = (url: string, slug: string): string => {
      const urlLower = url.toLowerCase();
      if (slug === 'index' || urlLower.match(/\/(?:index|home)?$/) || urlLower.match(/\/$/)) return 'home';
      if (urlLower.includes('/about')) return 'about';
      if (urlLower.includes('/contact')) return 'contact';
      if (urlLower.includes('/service') || urlLower.includes('/product')) return 'services';
      if (urlLower.includes('/blog') || urlLower.includes('/news')) return 'blog';
      if (urlLower.includes('/gallery') || urlLower.includes('/portfolio') || urlLower.includes('/work')) return 'gallery';
      if (urlLower.includes('/pricing') || urlLower.includes('/price')) return 'pricing';
      return 'other';
    };

    const pageType = inferPageType(url, pageSlug);

    // Call classify-sections API to get AI-classified sections with page type context
    const classifyResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/classify-sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        headings: structure.headings,
        sections: structure.sections.map((s: ExtractedSection, index: number) => ({
          sourceIndex: typeof s.sourceIndex === 'number' ? s.sourceIndex : index,
          heading: s.heading,
          class: s.class,
          id: s.id,
          textPreview: s.textPreview,
          text: s.text,
          detectedType: s.detectedType,
        })),
        hasNavbar: structure.hasNavbar,
        hasFooter: structure.hasFooter,
        navbarLinks: structure.navbarLinks,
        pageType,
        sourceUrl: url,
        htmlHints: structure.sections.map(s => s.detectedType || null),
      }),
    });

    let classifiedSections: Array<{ type: string; text: string; sourceIndex?: number }> = [];
    if (classifyResponse.ok) {
      const classifyData = await classifyResponse.json();
      classifiedSections = classifyData.sections || [];
    } else {
      // Fallback: Use detectedType from scraping instead of defaulting to 'features'
      // This preserves section types (testimonials, gallery, cta, etc.) when AI classification fails
      classifiedSections = (structure.sections as ExtractedSection[]).map((section, index) => ({
        type: section.detectedType || 'features',  // Use scraped detectedType, fallback to 'features'
        text: section.textPreview || section.text || '',
        sourceIndex: typeof section.sourceIndex === 'number' ? section.sourceIndex : index,
      }));
      console.log('[Analyze] Using detectedType from scraping as fallback (AI classification failed)');
    }

    // Diagnostic: log classification results
    console.log('[Analyze] Scraped sections count:', structure.sections.length);
    console.log('[Analyze] Classified sections count:', classifiedSections.length);
    console.log('[Analyze] Classified section types:', classifiedSections.map(s => s.type));
    console.log('[Analyze] Detected types from scraping:', structure.sections.map(s => s.detectedType).filter(Boolean));

    const sectionBuckets = buildSectionBuckets(
      classifiedSections,
      structure.sections as ExtractedSection[],
      images as ExtractedImage[]
    );

    const classifiedTypeSequence = normalizeStructuralSections(
      classifiedSections.map((s) => s.type).filter(Boolean)
    );
    let orderedSectionTypes = classifiedTypeSequence;

    // Deduplication to prevent excessive section repetition, but generous enough for real sites
    const sectionTypeCounts: Record<string, number> = {};
    const MAX_PER_TYPE: Record<string, number> = {
      navbar: 1,
      hero: 1,
      footer: 1,
      cta: 4,
      contact: 1,
      about: 3,
      testimonials: 3,
      gallery: 3,
      blog: 3,
      features: 6,
      services: 4,
    };
    
    const deduplicatedSections = orderedSectionTypes.filter((type: string) => {
      const count = sectionTypeCounts[type] || 0;
      const max = MAX_PER_TYPE[type] ?? 6;
      if (count < max) {
        sectionTypeCounts[type] = count + 1;
        return true;
      }
      return false;
    });

    if (!deduplicatedSections.includes('navbar')) deduplicatedSections.unshift('navbar');
    if (!deduplicatedSections.includes('footer')) deduplicatedSections.push('footer');

    orderedSectionTypes = deduplicatedSections;

    if (structure.hasNavbar && !orderedSectionTypes.includes('navbar')) {
      orderedSectionTypes.unshift('navbar');
    }

    if (!orderedSectionTypes.includes('hero')) {
      const navbarIndex = orderedSectionTypes.indexOf('navbar');
      if (navbarIndex >= 0) {
        orderedSectionTypes.splice(navbarIndex + 1, 0, 'hero');
      } else {
        orderedSectionTypes.unshift('hero');
      }
    }

    if (structure.hasFooter && !orderedSectionTypes.includes('footer')) {
      orderedSectionTypes.push('footer');
    }

    // Call generate-layout API to create layout with content
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: orderedSectionTypes,
          content: {
            ...enrichedContent,
            sectionBuckets,
            sectionSequence: classifiedSections.map((s) => s.type),
          },
          regenerate: true,
          pageSlug: pageSlug,
        }),
      });

      console.log('[Analyze] Layout generated with enriched content');
    } catch (layoutError: any) {
      console.error('[Analyze] Failed to generate layout:', layoutError.message);
      // Continue anyway, layout can be generated later
    }

    const responseData: any = {
      status: "success",
      classifiedSections,
      fallback: usedFallback,
      content: enrichedContent,
      internalLinks: result.internalLinks || [],
    };

    if (screenshotPath) {
      responseData.screenshot = screenshotPath;
    } else {
      responseData.message = "Screenshot unavailable, using fallback extraction";
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Screenshot error:", error);

    // Check for network errors
    const errorMessage = error.message || 'Unknown error';
    
    if (errorMessage.includes("ERR_INTERNET_DISCONNECTED") ||
        errorMessage.includes("ENETUNREACH")) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Cannot connect to the website. Please check your internet connection." 
        },
        { status: 503 }
      );
    }

    if (errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Connection refused. The website may be blocking automated access." 
        },
        { status: 503 }
      );
    }

    if (errorMessage.includes("net::ERR_CERT")) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "SSL certificate error. The website may have an invalid or expired certificate." 
        },
        { status: 503 }
      );
    }

    if (errorMessage.includes("net::ERR_NAME_NOT_RESOLVED")) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Cannot resolve domain name. Please check the URL." 
        },
        { status: 400 }
      );
    }

    if (errorMessage.includes("Timeout") || errorMessage.includes("timeout")) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Website took too long to load. The site may be slow or blocking automated access." 
        },
        { status: 504 }
      );
    }

    if (errorMessage.includes("ERR_CONNECTION_RESET") || 
        errorMessage.includes("connection reset") ||
        errorMessage.includes("ERR_CONNECTION_CLOSED") ||
        errorMessage.includes("connection closed")) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Connection was closed by the website. This may be due to bot protection, firewall, or network issues. Try again or use a different URL." 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        status: "error", 
        message: `Failed to analyze website: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}
