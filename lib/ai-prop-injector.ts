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
 * STRICT: Only the 6 kept components are included.
 */
export const COMPONENT_PROP_SCHEMAS: Record<string, ComponentPropSchema> = {

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

  'cta-button-dynamic': {
    componentName: 'cta-button-dynamic',
    section: 'cta',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The primary headline of the call-to-action banner. Emphasize a clear value proposition or an invitation. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'The supporting paragraph detailed below the headline describing the benefit, instructions, or secondary information. Max 40 words.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'The text label displayed on the high-contrast green action pill. e.g., "Contact Us". Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'ctaHref',
        type: 'string',
        description: 'Optional URL link to redirect users when clicking the action button.',
        required: false,
      },
      {
        name: 'imageSrc',
        type: 'string',
        description: 'A URL representing a high-quality photograph or digital vector that complements the main CTA. Placed inside a rounded corner card next to the text.',
        required: false,
      },
      {
        name: 'imageAlt',
        type: 'string',
        description: 'An accessible descriptional string representing the image.',
        required: false,
      }
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

  'cta-click-dynamic': {
    componentName: 'cta-click-dynamic',
    section: 'cta',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The main primary callout title text inside the CTA card. Use clear, active action words. Maximum of 15 words.',
        maxWords: 15,
        required: true,
      }
    ],
  },

  'cta-convert-dynamic': {
    componentName: 'cta-convert-dynamic',
    section: 'cta',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The main promotional header text calling users to subscribe to a newsletter or form. Keep it concise, high impact. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A brief contextual subheader describing the values, insights, or offers users receive by signing up. Max 35 words.',
        maxWords: 35,
        required: true,
      },
      {
        name: 'inputLabel',
        type: 'string',
        description: 'The small descriptor label located above the input field like Stay Informed or Join Us. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'inputPlaceholder',
        type: 'string',
        description: 'Placeholder string for the email text input channel, e.g. Enter your email. Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'buttonText',
        type: 'string',
        description: 'The action message displayed on the interactive submit button, e.g. Subscribe or Join. Max 3 words.',
        maxWords: 3,
        required: true,
      },
      {
        name: 'subtext',
        type: 'string',
        description: 'Agreement or compliance text below the input elements. Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'linkText',
        type: 'string',
        description: 'Underlined legal link text matching privacy guidelines or terms, e.g. Privacy Policy. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'linkUrl',
        type: 'string',
        description: 'Destination pointer URL link for the subtext anchor redirect, e.g. /privacy or #.',
        required: false,
      }
    ],
  },

  'cta-drive-dynamic': {
    componentName: 'cta-drive-dynamic',
    section: 'cta',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The main attention-grabbing title displayed on the left side. Should be clean and engaging. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A brief description text printed beneath the left heading. Max 25 words.',
        maxWords: 25,
        required: false,
      },
      {
        name: 'cardText',
        type: 'string',
        description: 'The detailed core value proposition message displayed inside the premium glassmorphic card on the right. Max 60 words.',
        maxWords: 60,
        required: true,
      },
      {
        name: 'inputPlaceholder',
        type: 'string',
        description: 'The visual placeholder string placed inside the email input field. Max 8 words.',
        maxWords: 8,
        required: false,
      },
      {
        name: 'buttonText',
        type: 'string',
        description: 'Text printed on the subscription submit action button. Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'privacyTextPrefix',
        type: 'string',
        description: 'Short introductory text about user privacy displayed at the bottom of the card. Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'privacyLinkText',
        type: 'string',
        description: 'Label printed for the clickable hyperlink pointing toward the privacy regulations. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'privacyLinkUrl',
        type: 'string',
        description: 'The actual anchor url destination path of the privacy details hyperlink.',
        required: false,
      }
    ],
  },

  'cta-goal-dynamic': {
    componentName: 'cta-goal-dynamic',
    section: 'cta',
    props: [
      {
        name: 'badgeCategory',
        type: 'string',
        description: 'The solid green pill label for highlight updates. (e.g., "New", "Latest", "Update"). Include maxWords: 5.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'badgeText',
        type: 'string',
        description: 'The subtitle or secondary message next to the category label inside the badge. (e.g., "Automated Workflow Templates"). Include maxWords: 15.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'heading',
        type: 'string',
        description: 'The primary central heading emphasizing the goal. (e.g., "Focus on what matters, automate the rest."). Include maxWords: 20.',
        maxWords: 20,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'The supporting description paragraph under the heading detailing benefits or social proof. Include maxWords: 50.',
        maxWords: 50,
        required: true,
      },
      {
        name: 'inputPlaceholder',
        type: 'string',
        description: 'The placeholder label inside the text email capture input. (e.g., "Your email"). Include maxWords: 10.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'buttonText',
        type: 'string',
        description: 'The text label for the primary action button to trigger subscription. (e.g., "Get Started"). Include maxWords: 10.',
        maxWords: 10,
        required: true,
      },
    ],
  },

  // ── NAVBAR ──────────────────────────────────────────────────────────
  'nav-float-dynamic': {
    componentName: 'nav-float-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The brand name or logo text to display on the left side of the navbar. Max 3 words.',
        maxWords: 3,
        required: true,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'The text for the call-to-action button on the right side. Max 3 words.',
        maxWords: 3,
        required: true,
      },
      {
        name: 'ctaHref',
        type: 'string',
        description: 'The URL or anchor link for the CTA button.',
        required: false,
      },
      {
        name: 'navLinks',
        type: 'array',
        description: 'An array of navigation links with label, href, and optional isActive boolean.',
        required: true,
      },
    ],
  },

  'nav-header-dynamic': {
    componentName: 'nav-header-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'brandName',
        type: 'string',
        description: 'The brand name or logo text to display on the left side of the navbar. Max 5 words.',
        maxWords: 5,
        required: true,
      },
      {
        name: 'brandLink',
        type: 'string',
        description: 'The URL the brand name/logo links to.',
        required: false,
      },
      {
        name: 'navLinks',
        type: 'array',
        description: 'An array of navigation links with text and href. Labels should be concise (1-2 words).',
        maxWords: 10,
        required: true,
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        description: 'The placeholder text for the search input on the right side. Max 3 words.',
        maxWords: 3,
        required: true,
      },
    ],
  },

  'nav-link-dynamic': {
    componentName: 'nav-link-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The branding text of the company or application shown in the main bar. Example: Poseidon, Astra. Maximum 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'topLink1Text',
        type: 'string',
        description: 'The first sub-navigation link label in the top row. Recommended for support, information, or secondary page references.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'topLink1Url',
        type: 'string',
        description: 'The destination URL or anchor path for top link 1 (e.g. #how-to-use).',
        required: false,
      },
      {
        name: 'topLink2Text',
        type: 'string',
        description: 'The second sub-navigation link label in the top row. Recommended for Careers, Pricing, or FAQ.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'topLink2Url',
        type: 'string',
        description: 'The destination URL or anchor path for top link 2 (e.g. #careers).',
        required: false,
      },
      {
        name: 'topLink3Text',
        type: 'string',
        description: 'The third sub-navigation link label in the top row. Recommended for News, Blog, or Hub references.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'topLink3Url',
        type: 'string',
        description: 'The destination URL or anchor path for top link 3 (e.g. #blogs).',
        required: false,
      },
      {
        name: 'mainLink1Text',
        type: 'string',
        description: 'The first primary link in the main navigation (e.g., HOME, OVERVIEW).',
        maxWords: 4,
        required: false,
      },
      {
        name: 'mainLink1Url',
        type: 'string',
        description: 'The destination URL or anchor path for main link 1 (e.g., #home).',
        required: false,
      },
      {
        name: 'mainLink2Text',
        type: 'string',
        description: 'The second primary link in the main navigation (e.g., PRODUCTS, SOLUTIONS).',
        maxWords: 4,
        required: false,
      },
      {
        name: 'mainLink2Url',
        type: 'string',
        description: 'The destination URL or anchor path for main link 2 (e.g., #products).',
        required: false,
      },
      {
        name: 'mainLink3Text',
        type: 'string',
        description: 'The third primary link in the main navigation (e.g., ABOUT US, SERVICES).',
        maxWords: 4,
        required: false,
      },
      {
        name: 'mainLink3Url',
        type: 'string',
        description: 'The destination URL or anchor path for main link 3 (e.g., #about-us).',
        required: false,
      },
      {
        name: 'mainLink4Text',
        type: 'string',
        description: 'The fourth primary link in the main navigation (e.g., CONTACTS, CAREERS).',
        maxWords: 4,
        required: false,
      },
      {
        name: 'mainLink4Url',
        type: 'string',
        description: 'The destination URL or anchor path for main link 4 (e.g., #contacts).',
        required: false,
      }
    ],
  },

  'nav-menu-dynamic': {
    componentName: 'nav-menu-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'topLinks',
        type: 'array',
        description: 'Secondary, low-emphasis auxiliary navigation links displayed inside the upper toolbar row. Each element must contain label and href keys.',
        required: false,
      },
      {
        name: 'brandName',
        type: 'string',
        description: 'The visible user-facing brand title header displayed prominently in the lower primary toolbar (max 3 words).',
        maxWords: 3,
        required: false,
      },
      {
        name: 'brandHref',
        type: 'string',
        description: 'Hyperlink endpoint target when a user clicks on the brand logo or title text layout.',
        required: false,
      },
      {
        name: 'mainLinks',
        type: 'array',
        description: 'The primary page links displayed aligned in the center of the viewport (e.g. HOME, PRODUCTS, ABOUT US, CONTACTS). Each item accepts text labels and target URLs.',
        required: false,
      }
    ],
  },

  'nav-panel-dynamic': {
    componentName: 'nav-panel-dynamic',
    section: 'navbar',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The branding text shown next to the logo. e.g. "Poseidon". MaxWords: 3.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'navItems',
        type: 'array',
        description: 'Array of custom menu items with uppercase dynamic strings linking to section anchors or pages.',
        required: false,
      },
      {
        name: 'signInText',
        type: 'string',
        description: 'Button call-to-action text for logging in. e.g., "Sign in". MaxWords: 3.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'signInUrl',
        type: 'string',
        description: 'Destination routing URL path for signing in.',
        required: false,
      },
      {
        name: 'signUpText',
        type: 'string',
        description: 'Button call-to-action text for signing up. e.g., "Sign up". MaxWords: 3.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'signUpUrl',
        type: 'string',
        description: 'Destination routing URL path for signing up.',
        required: false,
      }
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

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-critique-dynamic': {
    componentName: 'testi-critique-dynamic',
    section: 'testimonials',
    props: [
      {
        name: 'badgeText',
        type: 'string',
        description: 'The small label/badge category shown at the very top of the section (e.g. "Testimonial"). Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'headingText',
        type: 'string',
        description: 'The primary bold center headline of the testimonials section. Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'testimonials',
        type: 'array',
        description: 'The dynamic list of testimonials. Each item contains an id, quote (max 30 words), authorName (max 3 words), authorHandle (max 3 words), and authorAvatar (image URL).',
        required: true,
      }
    ],
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-feedback-dynamic': {
    componentName: 'testi-feedback-dynamic',
    section: 'testimonials',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The primary title of the testimonials section. E.g., Testimonials. Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'The helper narrative subtitle content displayed directly below the header title block. Max 25 words.',
        maxWords: 25,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'The list of high-quality customer reviews containing feedback, authorName, authorRole, and authorAvatarUrl.',
        required: true,
      }
    ],
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-honor-dynamic': {
    componentName: 'testi-honor-dynamic',
    section: 'testimonials',
    props: [
      {
        name: 'items',
        type: 'array',
        description: 'An array of testimonial slides to display in the rotation deck. Fill each testimonial with its quote review comment, writer\'s full name, corporate title or role, and dynamic profile headshot URL.',
        maxWords: 100,
        required: true,
      }
    ],
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-praise-dynamic': {
    componentName: 'testi-praise-dynamic',
    section: 'testimonials',
    props: [
      {
        name: 'items',
        type: 'array',
        description: 'An array of items representing client testimonials. Each item contains properties: quote (testimonial quote, max 15 words), ratingText (short review status string), authorName, authorRole, and authorImage (avatar profile picture URL).',
        required: true,
      },
      {
        name: 'dividerText',
        type: 'string',
        description: 'A custom text separator between current and total indexes (e.g. "----" or "/").',
        maxWords: 5,
        required: false,
      }
    ],
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-quote-dynamic': {
    componentName: 'testi-quote-dynamic',
    section: 'testimonials',
    props: [
      {
        name: 'quoteText',
        type: 'string',
        description: 'The testimonial text. Usually the client quotes praising their experience, maximum 60 words.',
        maxWords: 60,
        required: true,
      },
      {
        name: 'authorName',
        type: 'string',
        description: 'The name of the person giving the testimonial, maximum 8 words.',
        maxWords: 8,
        required: true,
      },
      {
        name: 'authorRole',
        type: 'string',
        description: 'The role, job title, or description of the person giving the testimonial, maximum 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'authorAvatarUrl',
        type: 'string',
        description: 'The URL of the author avatar image.',
        required: false,
      },
      {
        name: 'testimonialImageUrl',
        type: 'string',
        description: 'Detailed high-quality image of the place, lodging, or setup related to the testimonial.',
        required: true,
      }
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

  'feature-detail-dynamic': {
    componentName: 'feature-detail-dynamic',
    section: 'feature',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The main heading for the feature section. Focus on growth and expertise. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'items',
        type: 'array',
        description: 'An array of feature objects. Each object should have title, description (max 25 words), image (grayscale business/marketing style), linkText, and optionally isHighlighted: true for one item to make it stand out.',
        required: true,
      },
      {
        name: 'loadMoreText',
        type: 'string',
        description: 'Text for the load more button at the bottom. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'loadMoreUrl',
        type: 'string',
        description: 'URL for the load more button.',
        required: false,
      }
    ],
  },

  'feature-facet-dynamic': {
    componentName: 'feature-facet-dynamic',
    section: 'feature',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The main title of the feature section, placed above the image. Max 12 words.',
        maxWords: 12,
        required: true,
      },
      {
        name: 'imageSrc',
        type: 'string',
        description: 'The URL of the large feature image. Should represent the core service or product.',
        required: true,
      },
      {
        name: 'imageAlt',
        type: 'string',
        description: 'Alt text for the feature image.',
        required: false,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'Text for the call-to-action button at the top right. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'A list of feature items. Each item should be an object with "title" (max 5 words) and "description" (max 25 words). Icons are injected separately. Max 4 items.',
        required: true,
      }
    ],
  },

  'feature-focus-dynamic': {
    componentName: 'feature-focus-dynamic',
    section: 'feature',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main heading for the feature section. Should be bold and impactful. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'A brief explanatory paragraph below the title. Max 30 words.',
        maxWords: 30,
        required: true,
      },
      {
        name: 'imageSrc',
        type: 'string',
        description: 'The URL for the central focus image. Should represent the product or a person using it.',
        required: true,
      },
      {
        name: 'features',
        type: 'array',
        description: 'An array of exactly 4 feature objects. Each object should have a title and a description (max 15 words each). Icons will be assigned automatically.',
        required: true,
      }
    ],
  },

  'feature-item-dynamic': {
    componentName: 'feature-item-dynamic',
    section: 'feature',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main headline for the feature section. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'A descriptive sub-headline or paragraph explaining the section. Max 40 words.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'primaryCtaText',
        type: 'string',
        description: 'Text for the primary call-to-action button.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'primaryCtaLink',
        type: 'string',
        description: 'URL for the primary call-to-action button.',
        required: false,
      },
      {
        name: 'secondaryCtaText',
        type: 'string',
        description: 'Text for the secondary call-to-action button.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'secondaryCtaLink',
        type: 'string',
        description: 'URL for the secondary call-to-action button.',
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'An array of feature items. Each item can have a badge (e.g., "NEW"), title, description, linkText, linkUrl, and a variant ("dark", "blue", "orange").',
        required: true,
      }
    ],
  },

  'feature-list-dynamic': {
    componentName: 'feature-list-dynamic',
    section: 'feature',
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'A small uppercase label above the main heading. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The main heading for the feature section. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A brief introductory paragraph explaining the services or features. Max 40 words.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'ctaText',
        type: 'string',
        description: 'The text for the call-to-action button. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'features',
        type: 'array',
        description: 'A list of feature items, each with an icon, title, and description. Provide 3-6 items.',
        required: true,
      },
      {
        name: 'backgroundImage',
        type: 'string',
        description: 'A faint background image for the section.',
        required: false,
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

  'benefits-asset-dynamic': {
    componentName: 'benefits-asset-dynamic',
    section: 'benefits',
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'A small label above the main heading (e.g., "Practice Areas"). Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'heading',
        type: 'string',
        description: 'The main heading for the section. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'footerButtonText',
        type: 'string',
        description: 'The text for the footer button (e.g., "View More Services"). Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'An array of benefit items. Each item should have a title, description, and linkText. One item can have isHighlighted: true.',
        required: true,
      },
    ],
  },

  'footer-glow-dynamic': {
    componentName: 'footer-glow-dynamic',
    section: 'footer',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The title of the platform or company to be displayed next to the logo. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A brief paragraphs/taglines describing the company/product, displayed under the logo. Max 40 words.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'newsletterTitle',
        type: 'string',
        description: 'Heading for the newsletter subscription box. Max 8 words.',
        maxWords: 8,
        required: false,
      },
      {
        name: 'newsletterDescription',
        type: 'string',
        description: 'Detailed prompt encouraging users to register for the newsletter list. Max 30 words.',
        maxWords: 30,
        required: false,
      },
      {
        name: 'newsletterPlaceholder',
        type: 'string',
        description: 'Input placeholder text in the subscription input field. Max 6 words.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'newsletterButtonText',
        type: 'string',
        description: 'Action text on the newsletter submission button. Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'copyrightText',
        type: 'string',
        description: 'The copyright and rights reserved string, usually displayed at the bottom right. Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'columns',
        type: 'array',
        description: 'List of footer navigation columns, each having a title and an array of link items with labels and urls.',
        required: false,
      },
      {
        name: 'bottomLinks',
        type: 'array',
        description: 'List of footer bottom meta links, e.g., Terms of Service, Privacy Policy. Each link contains a label and a url.',
        required: false,
      }
    ],
  },

  'footer-halo-dynamic': {
    componentName: 'footer-halo-dynamic',
    section: 'footer',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The logo text for the brand. Keep it short and uppercase (e.g., AIDAN). Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'brandDescription',
        type: 'string',
        description: 'A paragraph detailing the company core mission, location, or summary of operations. Keep it helpful and concise. Max 35 words.',
        maxWords: 35,
        required: false,
      },
      {
        name: 'copyrightText',
        type: 'string',
        description: 'Default copyright message (e.g. © 2019 Aidan Technologies Sdn Bhd). Max 8 words.',
        maxWords: 8,
        required: false,
      },
      {
        name: 'column1Title',
        type: 'string',
        description: 'The title of navigation column 1. E.g. SITEMAP. Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'column1Links',
        type: 'array',
        description: 'List of objects representing links in column 1. Each object should have a `text` (string) and an optional `href` (string).',
        required: false,
      },
      {
        name: 'column2Title',
        type: 'string',
        description: 'The title of navigation column 2. E.g. PRODUCT. Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'column2Links',
        type: 'array',
        description: 'List of objects representing links in column 2. Each object should have a `text` (string) and an optional `href` (string).',
        required: false,
      },
      {
        name: 'column3Title',
        type: 'string',
        description: 'The title of navigation column 3. E.g. HELP. Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'column3Links',
        type: 'array',
        description: 'List of objects representing links in column 3. Each object should have a `text` (string) and an optional `href` (string).',
        required: false,
      }
    ],
  },

  'footer-prism-dynamic': {
    componentName: 'footer-prism-dynamic',
    section: 'footer',
    props: [
      {
        name: 'logoImgSrc',
        type: 'string',
        description: 'URL to the logo image.',
        required: false,
      },
      {
        name: 'logoImgAlt',
        type: 'string',
        description: 'Alt text for the logo image.',
        required: false,
      },
      {
        name: 'logoText',
        type: 'string',
        description: 'Main logo text. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'logoSubtext',
        type: 'string',
        description: 'Small subtitle underneath the logo. Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'links',
        type: 'array',
        description: 'Navigation links. Each link has a label (string) and href (string).',
        required: false,
      },
      {
        name: 'socials',
        type: 'array',
        description: 'Social media icons. Each has an icon (ReactNode), href (string), and ariaLabel (string).',
        required: false,
      },
      {
        name: 'copyrightText',
        type: 'string',
        description: 'Copyright text at the bottom. Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'copyrightBrandText',
        type: 'string',
        description: 'Colorful brand name in copyright. Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'copyrightBrandHref',
        type: 'string',
        description: 'URL for the copyright brand name.',
        required: false,
      },
    ],
  },

  'footer-lume-dynamic': {
    componentName: 'footer-lume-dynamic',
    section: 'footer',
    props: [
      {
        name: 'logoText',
        type: 'string',
        description: 'The display name of the brand next to the logo. Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'brandDescription',
        type: 'string',
        description: 'A brief 1-2 sentence description explaining the brand and core values. Max 20 words.',
        maxWords: 20,
        required: false,
      },
      {
        name: 'col2Title',
        type: 'string',
        description: 'The title of the second column, e.g., "Quick Links". Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'col3Title',
        type: 'string',
        description: 'The title of the third column, e.g., "Customer Service". Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'col4Title',
        type: 'string',
        description: 'The title of the fourth column, e.g., "Stay Connected". Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'col4Description',
        type: 'string',
        description: 'The explanatory newsletter subscription text prompt above the input box. Max 20 words.',
        maxWords: 20,
        required: false,
      },
      {
        name: 'newsletterPlaceholder',
        type: 'string',
        description: 'Placeholder label inside the newsletter email input box. Max 6 words.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'contactEmail',
        type: 'string',
        description: 'The brand support contact email displayed at the bottom of the column.',
        maxWords: 6,
        required: false,
      },
      {
        name: 'copyrightText',
        type: 'string',
        description: 'The copyright and ownership information text string for the footer base. Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'privacyText',
        type: 'string',
        description: 'The link text representing the privacy policy, e.g., "Privacy Policy". Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'termsText',
        type: 'string',
        description: 'The link text representing the legal terms, e.g., "Terms of Service". Max 4 words.',
        maxWords: 4,
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
  } else if (section === 'blog' && sectionImages.length > 0) {
    // Blog: Distribute images across posts
    const arrayProp = schema.props.find(p => p.name === 'posts' || p.name === 'items');
    if (arrayProp) {
      prePopulatedProps._sectionImages = sectionImages.slice(0, 6);
      console.log(`[AI Prop Injector] Will inject ${prePopulatedProps._sectionImages.length} images into blog posts for ${componentName}`);
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
