/**
 * AI Prop Injector
 * 
 * Uses DeepSeek AI to intelligently generate component props
 * from extracted website content.
 * 
 * For each component in the layout, AI receives:
 * 1. The extracted website content (headings, paragraphs, nav links etc.)
 * 2. The component's prop schema (what props it accepts and their types)
 * 3. Instructions to write natural, summarised content — not copy-paste
 * 
 * Returns a map of section → props object ready to spread into the component.
 */

import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ExtractedWebsiteContent {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  images?: Array<{ src: string; alt?: string; title?: string; width?: number; height?: number }>;
  availablePages?: string[]; // List of generated page slugs for navbar filtering
  sectionSequence?: string[];
  sectionBuckets?: Record<string, Array<{
    sourceIndex?: number;
    heading?: string;
    text: string;
    className?: string;
    id?: string;
    links?: string[];
    images?: Array<{ src: string; alt?: string; title?: string; width?: number; height?: number }>;
  }>>;
  processed?: {
    features?: {
      heading: string;
      description: string;
      items: Array<{ title: string; description: string }>;
    };
    about?: {
      title: string;
      description: string;
      companies?: string[];
      achievements?: Array<{ label: string; value: string }>;
      breakout?: { title: string; description: string };
    };
    footer?: {
      brandName: string;
      description: string;
      contactInfo?: { email?: string; phone?: string; address?: string };
      copyright: string;
    };
  };
}

function uniqueBySrc(
  images: Array<{ src: string; alt?: string; title?: string; width?: number; height?: number }>
) {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (!image?.src || seen.has(image.src)) {
      return false;
    }
    seen.add(image.src);
    return true;
  });
}

function getSectionSpecificContext(content: ExtractedWebsiteContent, section: string) {
  const buckets = content.sectionBuckets?.[section] || [];
  const sectionImages = uniqueBySrc(buckets.flatMap(bucket => bucket.images || []));

  return {
    buckets,
    sectionImages,
    summary: buckets.length > 0
      ? buckets.slice(0, 4).map((bucket, index) =>
          `[${index + 1}] heading="${bucket.heading || ''}" text="${bucket.text.slice(0, 500)}" links="${(bucket.links || []).join(', ')}"`
        ).join('\n')
      : 'No section-specific content captured.',
  };
}

/**
 * Extract image URLs for a specific section from section buckets.
 * Returns an array of image URLs that came from this specific section.
 * @param section - The section type (e.g., 'hero', 'features', 'gallery')
 * @param content - The extracted website content with sectionBuckets
 * @param maxImages - Maximum number of images to return (optional)
 */
function getSectionImages(
  section: string,
  content: ExtractedWebsiteContent,
  maxImages?: number
): string[] {
  // Try exact match first
  let buckets = content.sectionBuckets?.[section] || [];
  
  // Try common aliases if exact match is empty
  if (buckets.length === 0) {
    const aliases: Record<string, string[]> = {
      'features': ['services', 'courses', 'programs', 'departments'],
      'testimonials': ['reviews', 'feedback'],
      'about': ['story', 'mission'],
      'gallery': ['portfolio', 'work', 'photos'],
    };
    const sectionAliases = aliases[section] || [];
    for (const alias of sectionAliases) {
      buckets = content.sectionBuckets?.[alias] || [];
      if (buckets.length > 0) break;
    }
  }
  
  const sectionImages = uniqueBySrc(buckets.flatMap(bucket => bucket.images || []));
  const limit = maxImages ?? sectionImages.length;
  return sectionImages.slice(0, limit).map(img => img.src);
}

function formatImageList(
  images: Array<{ src: string; alt?: string; title?: string; width?: number; height?: number }>
) {
  const candidates = uniqueBySrc(images).slice(0, 20);
  if (candidates.length === 0) {
    return 'No images available';
  }

  return candidates.map((image, index) => {
    const labelParts = [
      image.alt ? `alt="${image.alt}"` : '',
      image.title ? `title="${image.title}"` : '',
      image.width ? `width=${image.width}` : '',
      image.height ? `height=${image.height}` : '',
    ].filter(Boolean);

    return `${index + 1}. ${image.src}${labelParts.length ? ` (${labelParts.join(', ')})` : ''}`;
  }).join('\n');
}

export interface ComponentPropSchema {
  componentName: string;
  section: string;
  props: Array<{
    name: string;
    type: string;
    description: string;
    maxWords?: number;
    required: boolean;
    properties?: Record<string, { type: string; description?: string }>;
    items?: {
      type: string;
      properties: Record<string, { type: string; enum?: string[]; items?: { type: string; properties: Record<string, { type: string }> } }>;
    };
  }>;
}

/**
 * Registry of every component's prop schema.
 * AI uses this to know what to write for each component.
 * STRICT: Only the kept components are included.
 */
export const COMPONENT_PROP_SCHEMAS: Record<string, ComponentPropSchema> = {


  'banner-header-dynamic': {
    componentName: 'banner-header-dynamic',
    section: 'banner',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main display name or title (Roboto Medium). e.g., "YOUR NAME" or "ACME CORP". Uses letter tracking and is automatically uppercase.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'Role, specialty, or professional subtitle (Roboto Light). e.g., "HR MANAGER" or "LEAD CLOUD ENGINEER".',
        maxWords: 20,
        required: false,
      },
      {
        name: 'badgeText',
        type: 'string',
        description: 'The label for the bottom interactive rectangle badge (Roboto Light). e.g., "www.reallygreatsite.com" or "portfolio.dev".',
        maxWords: 10,
        required: false,
      },
      {
        name: 'badgeUrl',
        type: 'string',
        description: 'Alternative link when clicking the badge. Can point to pages, email mailto protocols, or website links.',
        required: false,
      },
      {
        name: 'backgroundImageUrl',
        type: 'string',
        description: 'Background graphic URL. If omitted, a dynamic 3D virtual studio backdrop is generated with clean CSS corridor lines.',
        required: false,
      },
      {
        name: 'leftAccentColor',
        type: 'string',
        description: 'Optional color string or CSS definition representing the left decorative vertical brand strip (e.g., "#4f46e5" or "rgba(224, 242, 254, 0.4)").',
        required: false,
      }
    ],
  },



  // ── HERO ──────────────────────────────────────────────────────────
  'hero-action-dynamic': {
    componentName: 'hero-action-dynamic',
    section: 'hero',
    props: [
      {
        name: 'badgeText',
        type: 'string',
        description: 'A short welcome or status badge text (e.g., "Welcome to BetterCare"). Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'heading',
        type: 'string',
        description: 'The main hero headline. Should be bold and impactful. Max 12 words.',
        maxWords: 12,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A supporting sub-headline that explains the value proposition. Max 30 words.',
        maxWords: 30,
        required: true,
      },
      {
        name: 'primaryCtaText',
        type: 'string',
        description: 'Text for the primary action button. Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'secondaryCtaText',
        type: 'string',
        description: 'Text for the secondary action link. Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'trustText',
        type: 'string',
        description: 'Social proof text (e.g., "Rated 4.5 and trusted by 1800+ patients"). Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'mainImage',
        type: 'string',
        description: 'The primary hero image URL. Should be a high-quality photo of a professional or relevant scene.',
        required: true,
      },
      {
        name: 'floatingCard1Title',
        type: 'string',
        description: 'Title for the top-right floating card (e.g., "24 Hour"). Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'floatingCard1Subtitle',
        type: 'string',
        description: 'Subtitle for the top-right floating card (e.g., "Emergency Services"). Max 8 words.',
        maxWords: 8,
        required: false,
      },
      {
        name: 'floatingCard2Title',
        type: 'string',
        description: 'Title for the middle-left floating card (e.g., "300+"). Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'floatingCard2Subtitle',
        type: 'string',
        description: 'Subtitle for the middle-left floating card (e.g., "Expert Doctors"). Max 8 words.',
        maxWords: 8,
        required: false,
      },
    ],
  },

  'hero-new-base-dynamic': {
    componentName: 'hero-new-base-dynamic',
    section: 'hero',
    props: [
      {
        name: 'tagline',
        type: 'string',
        description: 'Uppercase category or value proposition eyebrow text above the main headline.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The main hero display heading.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Supporting paragraph describing the core benefit or service proposition.',
        maxWords: 30,
        required: false,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'Text label for the primary call-to-action button.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'ctaLink',
        type: 'string',
        description: 'URL target for the call-to-action link.',
        required: false,
      },
      {
        name: 'ctaIcon',
        type: 'object',
        description: 'React node icon displayed inside the call-to-action button.',
        required: false,
      },
      {
        name: 'imageUrl',
        type: 'string',
        description: 'High-resolution hero visual image URL rendered inside the rounded card.',
        required: false,
      },
      {
        name: 'imageAlt',
        type: 'string',
        description: 'Accessible alternative text for the hero card background image.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'statValue',
        type: 'string',
        description: 'Large key performance stat number or percentage displayed in the top-left of the card.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'statLabel',
        type: 'string',
        description: 'Contextual label or metric description under the stat number.',
        maxWords: 8,
        required: false,
      },
      {
        name: 'highlightTitle',
        type: 'string',
        description: 'Feature title displayed in the bottom-right of the hero visual card.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'highlightDescription',
        type: 'string',
        description: 'Feature explanation text displayed below highlightTitle.',
        maxWords: 18,
        required: false,
      },
      {
        name: 'partners',
        type: 'array',
        description: 'Array of integration partner objects with name and optional icon rendered in the bottom dock.',
        required: false,
      },
    ],
  },

  'hero-beam-dynamic': {
    componentName: 'hero-beam-dynamic',
    section: 'hero',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main hero headline.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Supporting subtitle text below the main heading.',
        maxWords: 20,
        required: false,
      },
      {
        name: 'primaryCtaText',
        type: 'string',
        description: 'Text for the main call-to-action button.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'primaryCtaLink',
        type: 'string',
        description: 'Destination URL for the main call-to-action button.',
        required: false,
      },
      {
        name: 'statValue',
        type: 'string',
        description: 'Numeric price or metric displayed in the first card (e.g. $78.88).',
        maxWords: 3,
        required: false,
      },
      {
        name: 'statBadge',
        type: 'string',
        description: 'Timeframe or trend badge next to the stat (e.g. Today ↑).',
        maxWords: 3,
        required: false,
      },
      {
        name: 'chartPath',
        type: 'string',
        description: 'SVG path string for the sparkline trend in the first card.',
        required: false,
      },
      {
        name: 'cardOneTitle',
        type: 'string',
        description: 'Bottom headline for the first stat card.',
        maxWords: 8,
        required: false,
      },
      {
        name: 'cardTwoTitle',
        type: 'string',
        description: 'Headline text for the second portfolio card.',
        maxWords: 8,
        required: false,
      },
      {
        name: 'assetItems',
        type: 'array',
        description: 'Array of portfolio assets with name, price, and iconUrl.',
        required: false,
      },
      {
        name: 'cardThreeTitle',
        type: 'string',
        description: 'Headline text for the third social proof card.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'avatarImages',
        type: 'array',
        description: 'Array of user portrait image URLs for community social proof.',
        required: false,
      },
      {
        name: 'cardThreeCtaText',
        type: 'string',
        description: 'Button text in the third card.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'cardThreeCtaLink',
        type: 'string',
        description: 'Destination URL for the button in the third card.',
        required: false,
      },
    ],
  },


  // ── NAVBAR ──────────────────────────────────────────────────────────
  'nav-bar-dynamic': {
    componentName: 'nav-bar-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The brand name or logo text to display on the left side of the navbar. Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'navLinks',
        type: 'array',
        description: 'An array of navigation links with labels and hrefs. Labels should be concise (1-2 words).',
        maxWords: 10,
        required: true,
      },
      {
        name: 'loginLabel',
        type: 'string',
        description: 'The text for the login button. Max 3 words.',
        maxWords: 3,
        required: true,
      },
      {
        name: 'signupLabel',
        type: 'string',
        description: 'The text for the signup button. Max 3 words.',
        maxWords: 3,
        required: true,
      },
      {
        name: 'loginHref',
        type: 'string',
        description: 'The URL for the login button.',
        required: false,
      },
      {
        name: 'signupHref',
        type: 'string',
        description: 'The URL for the signup button.',
        required: false,
      },
    ],
  },

  'nav-float-dynamic': {
    componentName: 'nav-float-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'items',
        type: 'array',
        description: 'List of navigation items, each with label, optional href, optional badge text, and optional active status.',
        required: true,
      },
      {
        name: 'activeLabel',
        type: 'string',
        description: 'The label of the currently active navigation item to display in the light green pill capsule.',
        maxWords: 4,
        required: false,
      },
    ],
  },

  'nav-header-dynamic': {
    componentName: 'nav-header-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'navItems',
        type: 'array',
        description: 'Navigation items list containing labels, links, icons, and active state flags.',
        required: false,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'Text label for the primary call-to-action button.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'ctaHref',
        type: 'string',
        description: 'URL target destination for the call-to-action button.',
        required: false,
      },
      {
        name: 'ctaIcon',
        type: 'object',
        description: 'Icon element rendered within the circular action badge.',
        required: false,
      },
    ],
  },

  'nav-link-dynamic': {
    componentName: 'nav-link-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'navItems',
        type: 'array',
        description: 'List of navigation items with label, optional href, and optional isActive boolean.',
        required: false,
      },
      {
        name: 'activeItem',
        type: 'string',
        description: 'Label of the navigation item to highlight with a solid black pill background.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'Text for the call-to-action button, e.g. GET STARTED.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'ctaHref',
        type: 'string',
        description: 'Destination URL or anchor link for the call-to-action button.',
        required: false,
      },
      {
        name: 'ctaIcon',
        type: 'string',
        description: 'Icon character or glyph displayed after the CTA text, e.g. →.',
        required: false,
      },
    ],
  },

  'nav-menu-dynamic': {
    componentName: 'nav-menu-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The brand or logo name displayed next to the logo image.',
        maxWords: 3,
        required: true,
      },
      {
        name: 'logoImage',
        type: 'string',
        description: 'The circular logo mark or brand avatar image URL.',
        required: false,
      },
      {
        name: 'logoHref',
        type: 'string',
        description: 'The URL destination when clicking on the brand logo.',
        required: false,
      },
      {
        name: 'navItems',
        type: 'array',
        description: 'List of navigation links, each containing a label string and an optional href URL.',
        required: true,
      },
      {
        name: 'activeItem',
        type: 'string',
        description: 'The label of the currently selected nav item displaying the illuminated glow effect.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'The call-to-action button text on the right side of the navbar.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'ctaHref',
        type: 'string',
        description: 'The URL destination for the call-to-action button.',
        required: false,
      },
    ],
  },










  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-client-dynamic': {
    componentName: 'testi-client-dynamic',
    section: 'testimonials',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The main title for the testimonials section. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'subtext',
        type: 'string',
        description: 'A brief introductory sentence below the heading. Max 25 words.',
        maxWords: 25,
        required: false,
      },
      {
        name: 'testimonials',
        type: 'array',
        description: 'An array of testimonial objects. Each object should include: quote (the testimonial text, max 40 words), authorName (person name), authorRole (job title or location), authorImage (avatar URL), and bgColor (a soft pastel Tailwind background color class like bg-red-100, bg-blue-100, etc.).',
        required: true,
      },
    ],
  },






  // ── GALLERY ─────────────────────────────────────────────────────────
  'gallery-album-dynamic': {
    componentName: 'gallery-album-dynamic',
    section: 'gallery',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The title of the gallery album. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'images',
        type: 'array',
        description: 'An array of 7 high-quality images for the gallery album. Each object should have url and alt properties.',
        required: true,
      },
    ],
  },

  // ── FEATURE ─────────────────────────────────────────────────────────
  'feature-aspect-dynamic': {
    componentName: 'feature-aspect-dynamic',
    section: 'feature',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main heading for the feature section. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'The descriptive subtitle below the title. Max 30 words.',
        maxWords: 30,
        required: true,
      },
      {
        name: 'centerImage',
        type: 'string',
        description: 'URL for the large central image.',
        required: true,
      },
      {
        name: 'feature1Title',
        type: 'string',
        description: 'Title for the first feature (top left). Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'feature1Description',
        type: 'string',
        description: 'Description for the first feature. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'feature2Title',
        type: 'string',
        description: 'Title for the second feature (bottom left). Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'feature2Description',
        type: 'string',
        description: 'Description for the second feature. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'feature3Title',
        type: 'string',
        description: 'Title for the third feature (top right). Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'feature3Description',
        type: 'string',
        description: 'Description for the third feature. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'feature4Title',
        type: 'string',
        description: 'Title for the fourth feature (bottom right). Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'feature4Description',
        type: 'string',
        description: 'Description for the fourth feature. Max 15 words.',
        maxWords: 15,
        required: true,
      },
    ],
  },






  'blog-journal-dynamic': {
    componentName: 'blog-journal-dynamic',
    section: 'blog',
    props: [
      {
        name: 'subtitle',
        type: 'string',
        description: 'The small label shown above the main title. Usually represents the section category or general context (e.g., "Our Blog"). Limit of 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The primary headline centered at the top of the blog section. Encourage action or describe the quality of contents (e.g., "Check out our blog for in-depth analysis."). Limit of 20 words.',
        maxWords: 20,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'An array of up to 6 blog post entries. Alternating items should showcase either high-quality feature images at the top (and no description or tags), or complete textual detail (date, category tag, title, and detailed description) to create a premium magazine layout.',
        required: true,
        items: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
              description: 'Optional layout image URL for featured visual posts. If provided, the card renders as a visual article with a large image header and title but no description or date.'
            },
            date: {
              type: 'string',
              description: 'Optional publish date string (e.g. "June 25, 2024"). Only visible on text-only cards.'
            },
            category: {
              type: 'string',
              description: 'Optional category tag/badge text to categorize the content (e.g. "Lifestyle", "Economy", "Technology"). Only visible on text-only cards.'
            },
            title: {
              type: 'string',
              description: 'The catchy article title. High priority heading.',
              maxWords: 25
            },
            description: {
              type: 'string',
              description: 'A detailed summary/snippet introducing the article. Only visible on text-only card styles.',
              maxWords: 50
            }
          }
        }
      }
    ],
  },

  'benefits-advantage-dynamic': {
    componentName: 'benefits-advantage-dynamic',
    section: 'benefits',
    props: [
      {
        name: 'badgeText',
        type: 'string',
        description: 'A small label text at the top of the section (e.g., "Benefits"). Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The main heading for the benefits section. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A supporting paragraph below the heading explaining the value proposition. Max 30 words.',
        maxWords: 30,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'A list of benefit items. Each item should have a title and a detailed description. Provide 3-4 items.',
        required: true,
      },
      {
        name: 'images',
        type: 'array',
        description: 'Two high-quality images. The first image is a tall vertical shot, the second is a shorter supporting shot.',
        required: true,
      },
      {
        name: 'experienceValue',
        type: 'string',
        description: 'A short value for the experience badge (e.g., "10y+"). Max 2 words.',
        maxWords: 2,
        required: false,
      },
      {
        name: 'experienceLabel',
        type: 'string',
        description: 'The label for the experience badge (e.g., "Experiences"). Max 3 words.',
        maxWords: 3,
        required: false,
      },
    ],
  },


  // ── PRICING ──────────────────────────────────────────────────────────
  'pricing-matrix-dynamic': {
    componentName: 'pricing-matrix-dynamic',
    section: 'pricing',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main header title of the pricing section.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'description',
        type: 'string',
        description: 'The sub-headline description explaining the pricing strategy.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'featuresHeader',
        type: 'string',
        description: 'The header text preceding features list inside cards (e.g. Features:).',
        maxWords: 5,
        required: false,
      },
      {
        name: 'cards',
        type: 'array',
        description: 'List of pricing cards. Each card can optionally specify isFeatured (boolean), planName, price, pricePeriod, description, buttonText, and features array.',
        required: false,
      }
    ],
  },









  'mission-brand-dynamic': {
    componentName: 'mission-brand-dynamic',
    section: 'mission-vision',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main section display heading (e.g., Our Amazing Services). Supports newlines.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'imageUrl',
        type: 'string',
        description: 'The secure URL of the bold high-contrast background image displayed inside the slanted card frame.',
        required: false,
      },
      {
        name: 'imageAlt',
        type: 'string',
        description: 'Descriptive alternative text for screen readers explaining the core of the visual image.',
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'A list of dynamic mission or brand offerings, with custom titles, rich summaries, and icon tags.',
        required: false,
      }
    ],
  },





  'footer-ether-dynamic': {
    componentName: 'footer-ether-dynamic',
    section: 'footer',
    props: [
      {
        name: 'backgroundImage',
        type: 'string',
        description: 'The background custom mountaintop backdrop image URL for the atmospheric layout.',
        required: false,
      },
      {
        name: 'brandName',
        type: 'string',
        description: 'Capitalized main brand title to exhibit alongside the logo (max 5 words).',
        maxWords: 5,
        required: false,
      },
      {
        name: 'brandDescription',
        type: 'string',
        description: 'Detailed introductory or contextual description for the brand column (max 80 words).',
        maxWords: 80,
        required: false,
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        description: 'Input placeholder text displaying inside the custom search input element.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'menuTitle',
        type: 'string',
        description: 'The title heading of the first category link list.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'infoTitle',
        type: 'string',
        description: 'The title heading of the second category link list.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'socialTitle',
        type: 'string',
        description: 'The title heading for the social links category block.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'goOnTopText',
        type: 'string',
        description: 'Scroll-to-top button label on the bottom-left.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'copyrightText',
        type: 'string',
        description: 'Standard trailing block copyright statement.',
        maxWords: 15,
        required: false,
      }
    ],
  },

  // ── HERO (missing schemas) ─────────────────────────────────────────
  'hero-adapt-dynamic': {
    componentName: 'hero-adapt-dynamic',
    section: 'hero',
    props: [
      { name: 'title', type: 'string', description: 'Main hero headline. Max 10 words.', maxWords: 10, required: false },
      { name: 'description', type: 'string', description: 'Supporting sub-headline. Max 30 words.', maxWords: 30, required: false },
      { name: 'trustpilotRating', type: 'string', description: 'Trustpilot rating value (e.g. "4.5").', maxWords: 3, required: false },
      { name: 'trustpilotReviews', type: 'string', description: 'Number of reviews text (e.g. "1,800+ reviews").', maxWords: 5, required: false },
      { name: 'trustpilotSubLabel', type: 'string', description: 'Sub-label below the rating (e.g. "Excellent").', maxWords: 3, required: false },
      { name: 'feature1Text', type: 'string', description: 'Text for feature item 1. Max 5 words.', maxWords: 5, required: false },
      { name: 'feature2Text', type: 'string', description: 'Text for feature item 2. Max 5 words.', maxWords: 5, required: false },
      { name: 'feature3Text', type: 'string', description: 'Text for feature item 3. Max 5 words.', maxWords: 5, required: false },
      { name: 'ctaText', type: 'string', description: 'Call-to-action button text. Max 4 words.', maxWords: 4, required: false },
      { name: 'ctaLink', type: 'string', description: 'URL for the CTA button.', required: false },
      { name: 'images', type: 'object', description: 'Object with main, badge, bottomLeft, bottomRight image URLs.', required: false },
    ],
  },

  'hero-alpha-dynamic': {
    componentName: 'hero-alpha-dynamic',
    section: 'hero',
    props: [
      { name: 'badge', type: 'string', description: 'Short badge text above the title. Max 5 words.', maxWords: 5, required: false },
      { name: 'titleStart', type: 'string', description: 'First part of the headline. Max 5 words.', maxWords: 5, required: false },
      { name: 'titleAccent', type: 'string', description: 'Highlighted/accent part of the headline. Max 3 words.', maxWords: 3, required: false },
      { name: 'titleEnd', type: 'string', description: 'Last part of the headline. Max 5 words.', maxWords: 5, required: false },
      { name: 'description', type: 'string', description: 'Supporting paragraph. Max 30 words.', maxWords: 30, required: false },
      { name: 'ctaText', type: 'string', description: 'CTA button text. Max 4 words.', maxWords: 4, required: false },
      { name: 'image', type: 'string', description: 'Hero image URL.', required: false },
      { name: 'imageAlt', type: 'string', description: 'Accessibility description for the image.', required: false },
    ],
  },

  'hero-anchor-dynamic': {
    componentName: 'hero-anchor-dynamic',
    section: 'hero',
    props: [
      { name: 'label', type: 'string', description: 'Small label/eyebrow text above title. Max 5 words.', maxWords: 5, required: false },
      { name: 'title', type: 'string', description: 'Main headline. Max 10 words.', maxWords: 10, required: false },
      { name: 'description', type: 'string', description: 'Supporting paragraph. Max 30 words.', maxWords: 30, required: false },
      { name: 'primaryCtaText', type: 'string', description: 'Primary CTA button text. Max 4 words.', maxWords: 4, required: false },
      { name: 'primaryCtaUrl', type: 'string', description: 'URL for the primary CTA.', required: false },
      { name: 'secondaryCtaText', type: 'string', description: 'Secondary CTA text. Max 4 words.', maxWords: 4, required: false },
      { name: 'secondaryCtaUrl', type: 'string', description: 'URL for the secondary CTA.', required: false },
      { name: 'image', type: 'string', description: 'Hero image URL.', required: false },
    ],
  },

  'hero-apex-dynamic': {
    componentName: 'hero-apex-dynamic',
    section: 'hero',
    props: [
      { name: 'heading', type: 'string', description: 'Main hero headline. Max 10 words.', maxWords: 10, required: false },
      { name: 'subheading', type: 'string', description: 'Supporting sub-headline. Max 30 words.', maxWords: 30, required: false },
      { name: 'ctaText', type: 'string', description: 'CTA button text. Max 5 words.', maxWords: 5, required: false },
      { name: 'backgroundImage', type: 'string', description: 'Background image URL for the hero section.', required: false },
      { name: 'ratingValue', type: 'string', description: 'Rating value (e.g. "4.9").', maxWords: 3, required: false },
      { name: 'testimonialQuote', type: 'string', description: 'Short testimonial quote. Max 15 words.', maxWords: 15, required: false },
      { name: 'testimonialAuthor', type: 'string', description: 'Testimonial author name. Max 5 words.', maxWords: 5, required: false },
      { name: 'featureTitle', type: 'string', description: 'Feature card title. Max 8 words.', maxWords: 8, required: false },
      { name: 'featureDescription', type: 'string', description: 'Feature card description. Max 15 words.', maxWords: 15, required: false },
      { name: 'stat1Value', type: 'string', description: 'First stat value (e.g. "500+").', maxWords: 5, required: false },
      { name: 'stat1Label', type: 'string', description: 'First stat label. Max 8 words.', maxWords: 8, required: false },
      { name: 'stat2Value', type: 'string', description: 'Second stat value.', maxWords: 5, required: false },
      { name: 'stat2Label', type: 'string', description: 'Second stat label.', maxWords: 8, required: false },
      { name: 'sinceLabel', type: 'string', description: 'Label for "since" year (e.g. "Since").', maxWords: 3, required: false },
      { name: 'sinceValue', type: 'string', description: 'Year value (e.g. "2010").', maxWords: 3, required: false },
    ],
  },

  'hero-aspect-dynamic': {
    componentName: 'hero-aspect-dynamic',
    section: 'hero',
    props: [
      { name: 'badgeText', type: 'string', description: 'Badge text above title. Max 5 words.', maxWords: 5, required: false },
      { name: 'title', type: 'string', description: 'Main headline. Max 10 words.', maxWords: 10, required: false },
      { name: 'description', type: 'string', description: 'Supporting paragraph. Max 30 words.', maxWords: 30, required: false },
      { name: 'ctaText', type: 'string', description: 'CTA button text. Max 4 words.', maxWords: 4, required: false },
      { name: 'ratingValue', type: 'string', description: 'Social proof rating value.', maxWords: 5, required: false },
      { name: 'ratingLabel', type: 'string', description: 'Social proof label. Max 10 words.', maxWords: 10, required: false },
      { name: 'ratingAvatars', type: 'array', description: 'Array of avatar image URLs for social proof.', required: false },
      { name: 'videoThumbnail', type: 'string', description: 'Video thumbnail image URL.', required: false },
      { name: 'features', type: 'array', description: 'Array of feature objects with title and description.', required: false },
    ],
  },

  'hero-atlas-dynamic': {
    componentName: 'hero-atlas-dynamic',
    section: 'hero',
    props: [
      { name: 'eyebrow', type: 'string', description: 'Eyebrow text above title. Max 5 words.', maxWords: 5, required: false },
      { name: 'title', type: 'string', description: 'Main headline. Max 10 words.', maxWords: 10, required: false },
      { name: 'highlightedTitle', type: 'string', description: 'Highlighted word in the title. Max 3 words.', maxWords: 3, required: false },
      { name: 'primaryCta', type: 'string', description: 'Primary CTA text. Max 4 words.', maxWords: 4, required: false },
      { name: 'secondaryCta', type: 'string', description: 'Secondary CTA text. Max 4 words.', maxWords: 4, required: false },
      { name: 'backgroundImage', type: 'string', description: 'Hero background image URL.', required: false },
      { name: 'floatingCardLabel', type: 'string', description: 'Floating card label. Max 5 words.', maxWords: 5, required: false },
      { name: 'floatingCardTitle', type: 'string', description: 'Floating card title. Max 8 words.', maxWords: 8, required: false },
      { name: 'floatingCardDescription', type: 'string', description: 'Floating card description. Max 15 words.', maxWords: 15, required: false },
      { name: 'floatingCardImages', type: 'array', description: 'Array of image URLs for the floating card.', required: false },
    ],
  },

  // ── ABOUT (missing schemas) ────────────────────────────────────────
  'about-brand-dynamic': {
    componentName: 'about-brand-dynamic',
    section: 'about',
    props: [
      { name: 'badge', type: 'string', description: 'Badge/label text above title. Max 5 words.', maxWords: 5, required: false },
      { name: 'title', type: 'string', description: 'Section heading. Max 10 words.', maxWords: 10, required: false },
      { name: 'description', type: 'string', description: 'Main description paragraph. Max 40 words.', maxWords: 40, required: false },
      { name: 'image', type: 'string', description: 'About section image URL.', required: false },
      { name: 'imageAlt', type: 'string', description: 'Accessibility description for the image.', required: false },
      { name: 'ctaText', type: 'string', description: 'CTA button text. Max 5 words.', maxWords: 5, required: false },
      { name: 'ctaLink', type: 'string', description: 'URL for the CTA button.', required: false },
      { name: 'items', type: 'array', description: 'Array of feature items with title and description.', required: false },
    ],
  },



  // ── CONTACT (missing schemas) ──────────────────────────────────────
  'contact-form-dynamic': {
    componentName: 'contact-form-dynamic',
    section: 'contact',
    props: [
      { name: 'title', type: 'string', description: 'Section heading. Max 10 words.', maxWords: 10, required: false },
      { name: 'emailLabel', type: 'string', description: 'Email field label. Max 5 words.', maxWords: 5, required: false },
      { name: 'email', type: 'string', description: 'Email address value.', required: false },
      { name: 'phoneLabel', type: 'string', description: 'Phone field label. Max 5 words.', maxWords: 5, required: false },
      { name: 'phone', type: 'string', description: 'Phone number value.', required: false },
      { name: 'addressLabel', type: 'string', description: 'Address field label. Max 5 words.', maxWords: 5, required: false },
      { name: 'address', type: 'string', description: 'Address value.', required: false },
      { name: 'socialTitle', type: 'string', description: 'Social links section title. Max 5 words.', maxWords: 5, required: false },
      { name: 'formNameLabel', type: 'string', description: 'Form name field label. Max 5 words.', maxWords: 5, required: false },
      { name: 'formNamePlaceholder', type: 'string', description: 'Form name placeholder text. Max 8 words.', maxWords: 8, required: false },
      { name: 'formEmailLabel', type: 'string', description: 'Form email field label. Max 5 words.', maxWords: 5, required: false },
      { name: 'formEmailPlaceholder', type: 'string', description: 'Form email placeholder text. Max 8 words.', maxWords: 8, required: false },
      { name: 'formMessageLabel', type: 'string', description: 'Form message field label. Max 5 words.', maxWords: 5, required: false },
      { name: 'formMessagePlaceholder', type: 'string', description: 'Form message placeholder text. Max 8 words.', maxWords: 8, required: false },
      { name: 'formSubmitLabel', type: 'string', description: 'Form submit button text. Max 4 words.', maxWords: 4, required: false },
    ],
  },









  // ── CTA (missing schema) ───────────────────────────────────────────
  'cta-banner-dynamic': {
    componentName: 'cta-banner-dynamic',
    section: 'cta',
    props: [
      { name: 'title', type: 'string', description: 'CTA banner heading. Max 10 words.', maxWords: 10, required: false },
      { name: 'description', type: 'string', description: 'Supporting paragraph. Max 40 words.', maxWords: 40, required: false },
      { name: 'items', type: 'array', description: 'Array of bullet point strings.', required: false },
      { name: 'bottomLabel', type: 'string', description: 'Bottom label text. Max 10 words.', maxWords: 10, required: false },
      { name: 'ctaText', type: 'string', description: 'CTA button text. Max 5 words.', maxWords: 5, required: false },
      { name: 'backgroundImage', type: 'string', description: 'Background image URL.', required: false },
    ],
  },

  // ── FAQ (missing schema) ───────────────────────────────────────────
  'faq-great-dynamic': {
    componentName: 'faq-great-dynamic',
    section: 'faq-process',
    props: [
      {
        name: 'badgeText',
        type: 'string',
        description: 'Small text displayed inside the top pill badge indicator.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'badgeDotClass',
        type: 'string',
        description: 'Utility tailwind classes to customize the active dot element next to the badge text.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The main header title text of the section.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'titleHighlight',
        type: 'string',
        description: 'A specific phrase or substring from the title that will receive the custom pink ink-underline accent style.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Supporting paragraphs with instructions or details right below the main visual header.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'faqItems',
        type: 'array',
        description: 'A list of interactive questions and answers for the accordion grids.',
        required: true,
      }
    ],
  },



};

/**
 * Build the AI prompt for a single component.
 */
function buildPropPrompt(
  schema: ComponentPropSchema,
  content: ExtractedWebsiteContent,
  prePopulatedProps?: Record<string, any>
): string {
  const sectionContext = getSectionSpecificContext(content, schema.section);
  const propsDescription = schema.props
    .map(p => `  - "${p.name}" (${p.type}): ${p.description}${p.required ? ' [REQUIRED]' : ' [OPTIONAL]'}`)
    .join('\n');

  // Check if images are pre-populated
  const hasPrePopulatedImages = prePopulatedProps && (
    prePopulatedProps.image ||
    prePopulatedProps._sectionImages ||
    prePopulatedProps.mediaUrl ||
    prePopulatedProps.heroImage ||
    prePopulatedProps.backgroundImage ||
    prePopulatedProps.centerImageSrc ||
    prePopulatedProps.rightImageSrc
  );

  const availableImages = hasPrePopulatedImages
    ? '**IMAGES ARE PRE-ASSIGNED. Do NOT include any image URLs in your JSON response. Image fields will be injected automatically.**'
    : formatImageList([
        ...sectionContext.sectionImages,
        ...(content.images || []),
      ]);

  return `You are an expert web content writer. Your job is to write content for a website component using extracted content from a real website.

## Website Content Extracted:
Headings: ${content.headings.slice(0, 10).join(' | ')}
Paragraphs: ${content.paragraphs.slice(0, 8).join(' | ')}
Navigation Links: ${content.navigationLinks.join(', ')}
Footer Text: ${content.footerText || 'N/A'}
Contact Info: ${JSON.stringify(content.contactInfo || {})}
AI-Processed Features: ${JSON.stringify(content.processed?.features || {})}
AI-Processed About: ${JSON.stringify(content.processed?.about || {})}
AI-Processed Footer: ${JSON.stringify(content.processed?.footer || {})}
${content.availablePages && content.availablePages.length > 0
  ? `\n## AVAILABLE REDESIGNED PAGES (navbar MUST link to ALL of these):\n${
      content.availablePages.map(p =>
        `  - slug: "${p}" → href: "/preview/${p}" → label: "${
          p === 'index' ? 'Home'
          : p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        }"`
      ).join('\n')
    }\n`
  : ''}

## Source Website Section Analysis (use this to write relevant content):
- The source website appears to be a ${content.processed?.about?.title ?? 'business'} site
- Key headings found: ${content.headings.slice(0, 5).join(' | ')}
- Navigation structure: ${content.navigationLinks.join(', ')}
- AI-detected business content: ${JSON.stringify(content.processed?.features?.items?.map(i => i.title) ?? [])}
- About/company info: ${content.processed?.about?.description?.slice(0, 100) ?? 'N/A'}
${content.availablePages && content.availablePages.length > 0 ? `- Only these pages have been redesigned and should appear in navigation: ${content.availablePages.map(p => p === 'index' ? 'Home (/preview/index)' : `${p.replace(/-/g, ' ')} (/preview/${p})`).join(', ')}` : ''}

## Section-Specific Content For "${schema.section}":
${sectionContext.summary}

## Section-Specific Guidance:
- Base the copy primarily on the section-specific content above.
- Preserve the original section's purpose and information hierarchy.
${hasPrePopulatedImages 
  ? '- **Images are pre-selected from this section**. Focus on writing text content that matches the pre-selected images.'
  : '- Prefer images that came from this specific section when available.'
}

Use this context to write props that closely mirror the PURPOSE and CONTENT TYPE of the source website,
but rewritten in fresh, professional language suitable for the redesigned page.

## Available Images:
${availableImages}
${hasPrePopulatedImages 
  ? '\n**NOTE**: Image fields will be automatically populated. Do NOT include image URLs in your response — focus on text content only.\n' 
  : ''
}

## Component: ${schema.componentName} (${schema.section} section)

## Props to fill:
${propsDescription}

## Rules:
1. Write FRESH content — do NOT copy-paste from the source. Rephrase and summarise.
2. Respect the maxWords limit for each prop strictly.
3. Content must be relevant to THIS specific website — not generic placeholders.
4. For injectedAchievements: extract real numbers/stats if present (e.g. "28+ years", "500+ students").
5. For injectedCompanies: only include if real company/partner names are mentioned.
6. For menuItems/menu: use the actual navigation links from the website.
7. All text must be professional, clean, and ready to display on a live website.
8. If a prop is OPTIONAL and there is no relevant content, set it to null.
${hasPrePopulatedImages 
  ? '9. **IMAGES PRE-SELECTED**: Image fields are already filled with section-specific images. Do NOT modify image fields — focus on writing quality text content.\n'
  : '9. **IMAGE SELECTION**: Select the MOST relevant image(s) for this section from the "Available Images" list above. Return the selected image URL(s) in the \'image\' or \'items[].image\' field if the component supports it. Do NOT use images not listed above.\n'
}10. If no relevant image exists for this section, leave image fields as null/undefined — do NOT force an image.

12. Prefer section-specific images first and avoid logos/icons unless this is navbar/footer or no better image exists.
13. Do not write generic filler. If the section mentions specific programs, services, qualifications, outcomes, locations, or audiences, reflect them in the props.

## Response Format:
Return ONLY a valid JSON object. No markdown, no explanations, no extra text.
The JSON must exactly match the prop names listed above.

Example for features-grid:
{
  "badge": "Courses",
  "heading": "Our Featured Programs",
  "description": "Explore our industry-recognised certifications",
  "featureItems": [
    { "title": "Tally Certification", "description": "Master accounting software used by thousands of businesses", "image": "https://example.com/image1.jpg" },
    { "title": "US CPA Program", "description": "Globally recognised accounting credential for professionals" }
  ]
}

Now generate the JSON for ${schema.componentName}:`;
}

/**
 * Call DeepSeek API.
 */
async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    return response.data.choices[0].message.content;
  } catch {
    // Fallback to OpenRouter
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
        },
        timeout: 30000,
      }
    );
    return response.data.choices[0].message.content;
  }
}

/**
 * Parse AI JSON response safely.
 */
function parseJSON(raw: string): Record<string, any> {
  try {
    const clean = raw
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    const match = clean.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  } catch {
    console.error('[AI Prop Injector] Failed to parse JSON:', raw);
    return {};
  }
}

/**
 * Generate AI props for a single component.
 * Returns the props object to spread into the component.
 */
export async function generatePropsForComponent(
  componentName: string,
  content: ExtractedWebsiteContent
): Promise<Record<string, any>> {
  let schema = COMPONENT_PROP_SCHEMAS[componentName];

  if (!schema) {
    // Build a generic schema from the component name so new components
    // still receive AI-generated props rather than being silently skipped.
    const section = componentName.replace(/-dynamic$/, '').split('-')[0];
    console.log(`[AI Prop Injector] No explicit schema for ${componentName}, using generic fallback schema`);
    schema = {
      componentName,
      section,
      props: [
        { name: 'title', type: 'string', description: 'Main section heading. Max 10 words.', maxWords: 10, required: true },
        { name: 'description', type: 'string', description: 'Supporting paragraph. Max 40 words.', maxWords: 40, required: false },
        { name: 'items', type: 'array', description: 'Array of content items relevant to this section, each with title and description fields.', required: false },
      ],
    };
  }

  // === ADD: Pre-populate images based on section ===
  const section = schema.section;
  const prePopulatedProps: Record<string, any> = {};

  // Move arrayProp declaration to the top so it's available later
  const arrayProp = schema.props.find(p => 
    p.name === 'features' || p.name === 'items' || p.name === 'posts' || p.name === 'testimonials'
  );

  // Get section-specific images
  const sectionImages = getSectionImages(section, content);
  
  console.log(`[AI Prop Injector] Section "${section}" has ${sectionImages.length} section-specific images`);
  
  // Component-specific image injection rules
  if (section === 'hero' && sectionImages.length > 0) {
    // Map all known hero image props
    const heroImagePropNames = ['mediaUrl', 'image', 'backgroundImage', 'posterUrl', 'centerImageSrc', 'rightImageSrc'];
    for (const propName of heroImagePropNames) {
      const found = schema.props.find(p => p.name === propName);
      if (found && propName === 'mediaUrl') {
        prePopulatedProps['mediaUrl'] = sectionImages[0];
      } else if (found && propName === 'image') {
        prePopulatedProps['image'] = sectionImages[0];
      } else if (found && propName === 'backgroundImage') {
        prePopulatedProps['backgroundImage'] = sectionImages[0];
      } else if (found && propName === 'centerImageSrc') {
        prePopulatedProps['centerImageSrc'] = sectionImages[0];
        prePopulatedProps['rightImageSrc'] = sectionImages[1] || sectionImages[0];
      }
    }
    console.log(`[AI Prop Injector] Pre-populated hero images for ${componentName}:`, Object.keys(prePopulatedProps));
  } else if (section === 'features' && sectionImages.length > 0) {
    // Features: Distribute images across feature items (max 6)
    const arrayProp = schema.props.find(p => p.name === 'features' || p.name === 'items');
    if (arrayProp) {
      prePopulatedProps._sectionImages = sectionImages.slice(0, 6);
      console.log(`[AI Prop Injector] Will inject ${prePopulatedProps._sectionImages.length} images into features for ${componentName}`);
    }
  } else if (section === 'gallery' && sectionImages.length > 0) {
    // Gallery: Use all gallery images (max 10 for elegant gallery)
    const arrayProp = schema.props.find(p => p.name === 'items');
    if (arrayProp) {
      prePopulatedProps._sectionImages = sectionImages.slice(0, 10);
      console.log(`[AI Prop Injector] Will inject ${prePopulatedProps._sectionImages.length} images into gallery for ${componentName}`);
    }
  } else if (section === 'about' && sectionImages.length > 0) {
    // about-simple-dynamic uses 'heroImage', about-dynamic uses 'image'
    if (schema.props.find(p => p.name === 'heroImage')) {
      prePopulatedProps['heroImage'] = sectionImages[0];
      console.log(`[AI Prop Injector] Pre-populated about heroImage for ${componentName}`);
    } else if (schema.props.find(p => p.name === 'image')) {
      prePopulatedProps['image'] = sectionImages[0];
      console.log(`[AI Prop Injector] Pre-populated about image for ${componentName}`);
    }
    // avatar image if available
    if (schema.props.find(p => p.name === 'avatarImage') && sectionImages.length > 1) {
      prePopulatedProps['avatarImage'] = sectionImages[1];
      console.log(`[AI Prop Injector] Pre-populated about avatarImage for ${componentName}`);
    }
  } else if (section === 'testimonials' && sectionImages.length > 0) {
    // Testimonials: Use first image as avatar/background
    const avatarProp = schema.props.find(p => p.name === 'avatarImage' || p.name === 'image');
    if (avatarProp) {
      prePopulatedProps[avatarProp.name] = sectionImages[0];
      console.log(`[AI Prop Injector] Pre-populated testimonial image for ${componentName}`);
    }
  } else if (section === 'cta' && sectionImages.length > 0) {
    // CTA: Use first image as background
    const bgProp = schema.props.find(p => p.name === 'backgroundImage' || p.name === 'image');
    if (bgProp) {
      prePopulatedProps[bgProp.name] = sectionImages[0];
      console.log(`[AI Prop Injector] Pre-populated CTA background image for ${componentName}`);
    }
  } else {
    // Generic fallback for other sections
    const singleImageProp = schema.props.find(p => 
      p.name === 'image' || p.name === 'mediaUrl' || p.name === 'heroImage' || p.name === 'backgroundImage' || p.name === 'posterUrl'
    );
    if (singleImageProp && sectionImages.length > 0) {
      prePopulatedProps[singleImageProp.name] = sectionImages[0];
      console.log(`[AI Prop Injector] Pre-populated ${singleImageProp.name} with section image for ${componentName}`);
    }
    
    const arrayProp = schema.props.find(p => p.name === 'features' || p.name === 'items' || p.name === 'posts');
    if (arrayProp && sectionImages.length > 0) {
      prePopulatedProps._sectionImages = sectionImages;
      console.log(`[AI Prop Injector] Will inject ${sectionImages.length} images into ${arrayProp.name} array for ${componentName}`);
    }
  }
  // === END ADD ===

  try {
    const prompt = buildPropPrompt(schema, content, prePopulatedProps);
    console.log(`[AI Prop Injector] Generating props for ${componentName}...`);
    const raw = await callAI(prompt);
    const props = parseJSON(raw);
    
    // === ADD: Merge pre-populated images with AI content ===
    // AI writes text, but we override images with section-specific ones
    if (prePopulatedProps._sectionImages && arrayProp) {
      const arrayPropName = arrayProp.name;
      const sectionImgList = prePopulatedProps._sectionImages;
      
      if (props[arrayPropName] && Array.isArray(props[arrayPropName])) {
        props[arrayPropName] = props[arrayPropName].map((item: any, index: number) => {
          const imgUrl = sectionImgList[index] || null;
          if (!imgUrl) return item;
          
          // Handle different image field names per component type
          const updatedItem = { ...item };
          if ('imageUrl' in item || arrayPropName === 'items') {
            updatedItem.imageUrl = imgUrl;  // blog-article-dynamic
          }
          if ('image' in item || arrayPropName === 'posts') {
            updatedItem.image = imgUrl;     // blog-article-dynamic
          }
          return updatedItem;
        });
        console.log(`[AI Prop Injector] Injected images into ${arrayPropName}:`, 
          Math.min(sectionImgList.length, props[arrayPropName].length));
      }
      delete prePopulatedProps._sectionImages;
    }
    
    // Merge pre-populated props with AI-generated props
    const mergedProps = { ...prePopulatedProps, ...props };
    
    // Debug: log image fields in final props
    const imageFields = ['image', 'mediaUrl', 'heroImage', 'backgroundImage', 'centerImageSrc', 'items', 'features', 'posts', 'testimonials'];
    const imageDebug: Record<string, any> = {};
    for (const field of imageFields) {
      if (mergedProps[field] !== undefined) {
        if (Array.isArray(mergedProps[field])) {
          imageDebug[field] = `Array(${mergedProps[field].length}), first image: ${mergedProps[field][0]?.image || mergedProps[field][0]?.imageUrl || mergedProps[field][0]?.avatar || 'none'}`;
        } else {
          imageDebug[field] = mergedProps[field];
        }
      }
    }
    console.log(`[AI Prop Injector] Final image state for ${componentName}:`, imageDebug);
    
    console.log(`[AI Prop Injector] Props generated for ${componentName}:`, mergedProps);
    return mergedProps;
    // === END ADD ===
  } catch (error: any) {
    console.error(`[AI Prop Injector] Failed for ${componentName}:`, error.message);
    // Log full error details for debugging
    if (error.stack) {
      console.error(`[AI Prop Injector] Stack trace for ${componentName}:`, error.stack);
    }
    return {};
  }
}

/**
 * Generate AI props for ALL components in the layout in parallel.
 * Returns a map of componentName → props object.
 * 
 * This is called once when the layout is generated,
 * results are saved to generated-page/ai-props.json
 */
export async function generatePropsForLayout(
  layout: Array<{ section: string; component: string }>,
  content: ExtractedWebsiteContent
): Promise<Record<string, Record<string, any>>> {
  console.log('[AI Prop Injector] Starting AI prop generation for all components...');

  // Diagnostic: check for hero section
  const heroItems = layout.filter(item => item.section === 'hero');
  if (heroItems.length === 0) {
    console.warn('[AI Prop Injector] WARNING: No hero section in layout — hero props will not be generated');
  } else {
    console.log('[AI Prop Injector] Hero component(s) to inject:', heroItems.map(i => i.component));
  }

  // Run all AI calls in parallel for speed
  const results = await Promise.allSettled(
    layout.map(async (item) => {
      const props = await generatePropsForComponent(item.component, content);
      return { component: item.component, section: item.section, props };
    })
  );

  const propMap: Record<string, Record<string, any>> = {};

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { component, props } = result.value;
      propMap[component] = props;
    } else {
      // Log rejected errors for debugging
      console.error('[AI Prop Injector] Promise rejected:', result.reason);
    }
  }

  console.log('[AI Prop Injector] AI prop generation complete for components:', Object.keys(propMap));
  return propMap;
}
