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
        await new Promise((resolve) => {
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

      // Extract page structure with improved navbar and footer detection
      const structure = await page.evaluate(() => {
        // Common navigation link keywords
        const NAV_KEYWORDS = ['home', 'about', 'services', 'products', 'contact', 'pricing', 'features', 'blog', 'faq', 'login', 'sign', 'register', 'portfolio', 'team', 'careers'];
        
        // Common footer keywords
        const FOOTER_KEYWORDS = ['copyright', 'privacy', 'terms', 'contact', 'address', 'phone', 'email', 'subscribe', 'newsletter', 'follow us', 'all rights reserved', '©'];

        const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
          .map((el) => el.textContent?.trim())
          .filter((text): text is string => !!text);

        // === IMPROVED NAVBAR DETECTION ===
        const navbarSelectors = [
          'nav',
          'header nav',
          '.navbar',
          '.nav',
          '.navigation',
          '.main-nav',
          '.primary-nav',
          '[role="navigation"]',
          'header[role="banner"]',
          '.header-nav',
          '.top-nav',
        ];

        let navbarElement: Element | null = null;
        let navbarLinks: string[] = [];

        for (const selector of navbarSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const links = Array.from(element.querySelectorAll('a'))
              .map(link => link.textContent?.trim().toLowerCase() || '')
              .filter(text => text.length > 0);
            
            // Check if this element has navigation-like content
            const hasNavKeywords = links.some(link => 
              NAV_KEYWORDS.some(keyword => link.includes(keyword))
            );
            
            // Also check if it's a <nav> or has nav-like class
            const isNavTag = element.tagName.toLowerCase() === 'nav';
            const hasNavClass = Array.from(element.classList).some(cls => 
              cls.toLowerCase().includes('nav')
            );

            if (hasNavKeywords || isNavTag || hasNavClass) {
              navbarElement = element;
              navbarLinks = links;
              break;
            }
          }
        }

        // Fallback: Look for header with many links
        if (!navbarElement) {
          const header = document.querySelector('header');
          if (header) {
            const links = Array.from(header.querySelectorAll('a'))
              .map(link => link.textContent?.trim().toLowerCase() || '')
              .filter(text => text.length > 0);
            
            if (links.length >= 2) {
              const hasNavKeywords = links.some(link => 
                NAV_KEYWORDS.some(keyword => link.includes(keyword))
              );
              
              if (hasNavKeywords || links.length >= 4) {
                navbarElement = header;
                navbarLinks = links;
              }
            }
          }
        }

        // Fallback: Look for ul with many links at top of page
        if (!navbarElement) {
          const ulElements = Array.from(document.querySelectorAll('ul'));
          for (const ul of ulElements) {
            const links = Array.from(ul.querySelectorAll('a'));
            if (links.length >= 3) {
              const linkTexts = links.map(link => link.textContent?.trim().toLowerCase() || '');
              const hasNavKeywords = linkTexts.some(link => 
                NAV_KEYWORDS.some(keyword => link.includes(keyword))
              );
              
              // Check if ul is near top of page
              const rect = ul.getBoundingClientRect();
              const isNearTop = rect.top < 200;

              if (hasNavKeywords || isNearTop) {
                navbarElement = ul;
                navbarLinks = linkTexts;
                break;
              }
            }
          }
        }

        const uniqueNav = Array.from(new Set(navbarLinks));
        const hasNavbar = navbarElement !== null && uniqueNav.length >= 2;

        // === IMPROVED FOOTER DETECTION ===
        const footerSelectors = [
          'footer',
          '.footer',
          '.site-footer',
          '.page-footer',
          '[role="contentinfo"]',
          'footer[role="contentinfo"]',
          '.footer-main',
          '.footer-content',
          '#footer',
          '#site-footer',
        ];

        let footerElement: Element | null = null;

        for (const selector of footerSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            footerElement = element;
            break;
          }
        }

        // Fallback: Look for elements near bottom with footer-like content
        if (!footerElement) {
          const allElements = Array.from(document.querySelectorAll('div, section'));
          const viewportHeight = window.innerHeight;
          
          for (const element of allElements) {
            const rect = element.getBoundingClientRect();
            const documentHeight = document.documentElement.scrollHeight;
            
            // Check if element is in bottom 30% of page
            const isNearBottom = rect.top > (documentHeight - viewportHeight) * 0.7;
            
            if (isNearBottom) {
              const text = element.textContent?.toLowerCase() || '';
              const hasFooterKeywords = FOOTER_KEYWORDS.some(keyword => text.includes(keyword));
              
              // Check for contact info patterns
              const hasContactInfo = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) || // phone
                                     /@/.test(text) || // email
                                     /\d+\s+\w+\s+(street|st|avenue|ave|road|rd|boulevard|blvd)/i.test(text); // address
              
              // Check for copyright
              const hasCopyright = /©|copyright/i.test(text);

              if (hasFooterKeywords || hasContactInfo || hasCopyright) {
                footerElement = element;
                break;
              }
            }
          }
        }

        const hasFooter = footerElement !== null;

        // === SECTION DETECTION ===
        let sectionElements = document.querySelectorAll("section");

        if (sectionElements.length === 0) {
          const potentialSections = document.querySelectorAll(
            "main > div, .container, .wrapper, [class*='section'], [class*='hero'], [class*='banner'], [class*='content'], [class*='feature'], [class*='about'], [class*='service'], [class*='testimonial'], [class*='pricing']"
          );

          const filteredSections = Array.from(potentialSections).filter((el) => {
            const text = el.textContent?.trim() || "";
            return text.length > 50;
          });

          sectionElements = filteredSections as NodeListOf<Element>;
        }

        const sections = Array.from(sectionElements).map((section, index) => {
          const classList = Array.from(section.classList);
          const id = section.id;
          const fullText = section.textContent?.trim() || "";
          const textPreview = fullText.slice(0, 200);

          return {
            index: index + 1,
            class: classList.length > 0 ? classList.join(" ") : undefined,
            id: id || undefined,
            textPreview: textPreview,
          };
        });

        // === IMAGE EXTRACTION ===
        const images = Array.from(document.querySelectorAll("img"))
          .map((img) => ({
            src: img.src,
            alt: img.alt || "",
            title: img.title || "",
            width: img.naturalWidth,
            height: img.naturalHeight,
          }))
          .filter(
            (img) =>
              img.src &&
              !img.src.startsWith("data:") &&
              img.src.trim() !== ""
          );

        return {
          headings,
          navigation: uniqueNav,
          sections: sections.map(s => ({
            class: s.class,
            id: s.id,
            textPreview: s.textPreview,
          })),
          hasNavbar,
          hasFooter,
          navbarLinks: uniqueNav,
          images,
        };
      });

      await browser.close();

      return { success: true, structure, screenshotPath: `/screenshots/${filename}` };
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
    const sections: Array<{ class?: string; id?: string; textPreview: string }> = [];
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
    };

    console.log('[Analyze] AI content processing complete');

    // Call classify-sections API to get AI-classified sections
    const classifyResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/classify-sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        headings: structure.headings,
        sections: structure.sections.map(s => s.class || s.id || ''),
        hasNavbar: structure.hasNavbar,
        hasFooter: structure.hasFooter,
        navbarLinks: structure.navbarLinks,
      }),
    });

    let classifiedSections = structure.sections;
    if (classifyResponse.ok) {
      const classifyData = await classifyResponse.json();
      classifiedSections = classifyData.sections || [];
    }

    // Call generate-layout API to create layout with content
    try {
      const sectionTypes = Array.from(new Set(classifiedSections.map((s: any) => s.type)));

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: sectionTypes,
          content: enrichedContent,
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
