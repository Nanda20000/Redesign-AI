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
 * STRICT: Only -dynamic components are included (plus footer-simple and contact-split-dynamic)
 */
export const COMPONENT_PROP_SCHEMAS: Record<string, ComponentPropSchema> = {

  // ── HERO ──────────────────────────────────────────────────────────
  'hero-dynamic': {
    componentName: 'hero-dynamic',
    section: 'hero',
    props: [
      { name: 'subtitle',              type: 'string', description: 'Small label above title, max 6 words', maxWords: 6,  required: false },
      { name: 'title',                 type: 'string', description: 'Main headline — bold, impactful, max 8 words', maxWords: 8,  required: true  },
      { name: 'description',           type: 'string', description: 'Supporting paragraph, max 25 words',   maxWords: 25, required: false },
      { name: 'buttonText',            type: 'string', description: 'Primary CTA button label, max 4 words', maxWords: 4,  required: false },
      { name: 'secondaryButtonText',   type: 'string', description: 'Secondary CTA button, max 4 words',    maxWords: 4,  required: false },
      { name: 'image',                 type: 'string', description: 'Hero section image URL — select most relevant image from Available Images list', required: false },
    ],
  },
  'hero-simple-dynamic': {
    componentName: 'hero-simple-dynamic',
    section: 'hero',
    props: [
      {
        name: 'badge',
        type: 'string',
        description: 'A small label above the heading, e.g., "Coming Soon" or "New Feature". Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'titlePart1',
        type: 'string',
        description: 'The first part of the main heading, rendered in a lighter grey color. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'titlePart2',
        type: 'string',
        description: 'The second part of the main heading, rendered in solid black. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A short paragraph explaining the value proposition. Max 30 words.',
        maxWords: 30,
        required: true,
      },
      {
        name: 'primaryCtaText',
        type: 'string',
        description: 'Text for the main action button (dark background). Max 4 words.',
        maxWords: 4,
        required: true,
      },
      {
        name: 'secondaryCtaText',
        type: 'string',
        description: 'Text for the secondary action button (light background). Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'image',
        type: 'string',
        description: 'URL for the featured graphic or product image.',
        required: true,
      },
      {
        name: 'imageAlt',
        type: 'string',
        description: 'Alt text for the featured image.',
        required: false,
      },
    ],
  },
  'hero-elegant-dynamic': {
    componentName: 'hero-elegant-dynamic',
    section: 'hero',
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'A small uppercase label above the main heading. Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The main hero headline. Should be bold and impactful. Max 12 words.',
        maxWords: 12,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A supporting sub-headline or paragraph. Max 25 words.',
        maxWords: 25,
        required: false,
      },
      {
        name: 'primaryCtaText',
        type: 'string',
        description: 'Text for the primary action button. Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'secondaryCtaText',
        type: 'string',
        description: 'Text for the secondary action button. Max 4 words.',
        maxWords: 4,
        required: false,
      },
      {
        name: 'mediaUrl',
        type: 'string',
        description: 'URL for the hero video or image.',
        required: true,
      },
      {
        name: 'mediaType',
        type: 'string',
        description: 'Type of media to display: "video" or "image".',
        required: false,
      },
      {
        name: 'posterUrl',
        type: 'string',
        description: 'Optional poster image URL for the video.',
        required: false,
      }
    ],
  },
  'hero-banner-dynamic': {
    componentName: 'hero-banner-dynamic',
    section: 'hero',
    props: [
      {
        name: 'backgroundImage',
        type: 'string',
        description: 'Select the most prominent banner/hero image from the source page\'s Available Images list — prefer wide landscape images over portraits or logos',
        required: false,
      },
      {
        name: 'breadcrumb',
        type: 'string',
        description: 'Breadcrumb navigation text (e.g., "Home > About"). Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Large bold page title. Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Short description paragraph below the title. Max 30 words.',
        maxWords: 30,
        required: false,
      },
    ],
  },

  // ── GALLERY ────────────────────────────────────────────────────────
  'gallery-dynamic': {
    componentName: 'gallery-dynamic',
    section: 'gallery',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'Main heading for the gallery section. maxWords: 10',
        maxWords: 10,
        required: false,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'Optional descriptive text below the title. maxWords: 30',
        maxWords: 30,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'Array of gallery items, each with imageUrl, optional caption (maxWords: 8), and optional category label (maxWords: 3)',
        maxWords: 100,
        required: true,
      },
    ],
  },
  'gallery-elegant-dynamic': {
    componentName: 'gallery-elegant-dynamic',
    section: 'gallery',
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'A small uppercase label identifying the category or collection. Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'heading',
        type: 'string',
        description: 'The main title of the gallery section. Max 8 words.',
        maxWords: 8,
        required: true,
      },
      {
        name: 'subheading',
        type: 'string',
        description: 'A brief description or context for the displayed items. Max 25 words.',
        maxWords: 25,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'An array of exactly 5 gallery items. Each item must have: "image" (URL selected from Available Images list — pick the most visually rich images), "alt" (short alt text), and optionally "title" (max 5 words) and "description" (max 15 words) for hover overlay. Select images that best represent the website content.',
        required: true,
      },
    ],
  },

  // ── CTA ────────────────────────────────────────────────────────────
  'cta-dynamic': {
    componentName: 'cta-dynamic',
    section: 'cta',
    props: [
      {
        name: 'badge',
        type: 'string',
        description: 'Optional label displayed above the headline. maxWords: 5',
        maxWords: 5,
        required: false,
      },
      {
        name: 'headline',
        type: 'string',
        description: 'Main bold headline for the CTA section. maxWords: 12',
        maxWords: 12,
        required: false,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Supporting paragraph text below the headline. maxWords: 40',
        maxWords: 40,
        required: false,
      },
      {
        name: 'primaryButtonText',
        type: 'string',
        description: 'Text for the primary call-to-action button. maxWords: 4',
        maxWords: 4,
        required: false,
      },
      {
        name: 'primaryButtonHref',
        type: 'string',
        description: 'URL link for the primary button',
        required: false,
      },
      {
        name: 'secondaryButtonText',
        type: 'string',
        description: 'Text for the secondary call-to-action button. maxWords: 4',
        maxWords: 4,
        required: false,
      },
      {
        name: 'secondaryButtonHref',
        type: 'string',
        description: 'URL link for the secondary button',
        required: false,
      },
      {
        name: 'backgroundImage',
        type: 'string',
        description: 'Optional background image URL displayed behind an overlay',
        required: false,
      },
    ],
  },
  'cta-simple-dynamic': {
    componentName: 'cta-simple-dynamic',
    section: 'cta',
    props: [
      {
        name: 'heading',
        type: 'string',
        description: 'The main punchy headline for the CTA card. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Supporting text explaining the value proposition. Max 25 words.',
        maxWords: 25,
        required: true,
      },
      {
        name: 'primaryCtaText',
        type: 'string',
        description: 'Text for the primary action button. Max 3 words.',
        maxWords: 3,
        required: true,
      },
      {
        name: 'secondaryCtaText',
        type: 'string',
        description: 'Text for the secondary action button. Max 3 words.',
        maxWords: 3,
        required: false,
      },
      {
        name: 'stats',
        type: 'array',
        description: 'A list of exactly 3 key statistics. Each item must have a "value" field (e.g. "99.9%", "500+", "28+") and a "label" field (e.g. "uptime", "students", "years experience"). Extract real numbers from the website content if available.',
        required: true,
      },
    ],
  },

  // ── BLOG ───────────────────────────────────────────────────────────
  'blog-dynamic': {
    componentName: 'blog-dynamic',
    section: 'blog',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'Main heading for the blog section. maxWords: 10',
        maxWords: 10,
        required: false,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'Optional descriptive text below the title. maxWords: 30',
        maxWords: 30,
        required: false,
      },
      {
        name: 'items',
        type: 'array',
        description: 'Array of blog articles, each with imageUrl, category (maxWords: 3), title (maxWords: 12), excerpt (maxWords: 25), author (maxWords: 4), date string, readMoreText (maxWords: 3), and href',
        maxWords: 150,
        required: true,
      },
    ],
  },
  'blog-elegant-dynamic': {
    componentName: 'blog-elegant-dynamic',
    section: 'blog',
    props: [
      {
        name: 'tagline',
        type: 'string',
        description: 'A small label above the main heading. Max 5 words.',
        maxWords: 5,
        required: false,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The main heading for the blog section. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A brief overview of the blog content. Max 40 words.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'posts',
        type: 'array',
        description: 'An array of blog post objects. Each object should have image, title, author, date, summary, and readMoreText.',
        required: true,
      },
    ],
  },

  // ── FEATURES ──────────────────────────────────────────────────────
  'features-dynamic': {
    componentName: 'features-dynamic',
    section: 'features',
    props: [
      { name: 'title',       type: 'string', description: 'Section title, max 8 words',       maxWords: 8,  required: true  },
      { name: 'description', type: 'string', description: 'Short description, max 25 words',  maxWords: 25, required: false },
      { name: 'items',       type: 'Array<{title:string,description:string,image?:string}>', description: 'List of 2-6 feature cards. Each title max 6 words, each description max 20 words. For each item, select the most relevant image from Available Images list if applicable.', required: true },
    ],
  },
  'features-simple-dynamic': {
    componentName: 'features-simple-dynamic',
    section: 'features',
    props: [
      {
        name: 'tagline',
        type: 'string',
        description: 'A short, uppercase tagline for the top of the section. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'heading',
        type: 'string',
        description: 'The main heading for the features section. Max 15 words.',
        maxWords: 15,
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'A supporting paragraph explaining the features. Max 40 words.',
        maxWords: 40,
        required: true,
      },
      {
        name: 'features',
        type: 'array',
        description: 'An array of EXACTLY 3 feature objects. Each object MUST have: "title" (string, max 8 words) and "image" (string, URL selected from Available Images list - pick the most relevant image for each feature). Example: [{"title": "Feature Name", "image": "https://example.com/img.jpg"}, ...]',
        required: true,
      },
    ],
  },

  // ── ABOUT ─────────────────────────────────────────────────────────
  'about-dynamic': {
    componentName: 'about-dynamic',
    section: 'about',
    props: [
      { name: 'title',       type: 'string', description: 'About section heading, max 6 words',                    maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'About paragraph summarised in max 40 words',            maxWords: 40, required: true  },
      { name: 'stats',       type: 'Array<{label:string,value:string}>', description: 'Key statistics like years, students, courses. Extract real numbers from content if available (e.g. "28+", "1000+")', required: false },
      { name: 'companies',   type: 'string[]', description: 'List of partner/client company names if mentioned in content', required: false },
      { name: 'image',       type: 'string', description: 'About section image URL — select most relevant image from Available Images list (e.g. team photo, office, campus)', required: false },
    ],
  },
  'about-simple-dynamic': {
    componentName: 'about-simple-dynamic',
    section: 'about',
    props: [
      {
        name: 'headline',
        type: 'string',
        description: 'The main headline for the about section. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'topIntro',
        type: 'string',
        description: 'A brief introductory text or philosophy snippet at the top right. Max 40 words.',
        maxWords: 40,
        required: false,
      },
      {
        name: 'heroImage',
        type: 'string',
        description: 'The main hero image URL for the about section.',
        required: true,
      },
      {
        name: 'label',
        type: 'string',
        description: 'A small label or category text for the bottom section. Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'subIntro',
        type: 'string',
        description: 'Secondary introductory text placed above the avatar. Max 50 words.',
        maxWords: 50,
        required: false,
      },
      {
        name: 'avatarImage',
        type: 'string',
        description: 'The profile picture URL for the featured person.',
        required: false,
      },
      {
        name: 'avatarName',
        type: 'string',
        description: 'The name of the featured person. Max 10 words.',
        maxWords: 10,
        required: false,
      },
      {
        name: 'avatarTitle',
        type: 'string',
        description: 'The job title or role of the featured person. Max 15 words.',
        maxWords: 15,
        required: false,
      },
      {
        name: 'mainStatement',
        type: 'string',
        description: 'The main philosophy, mission, or summary statement. Max 80 words.',
        maxWords: 80,
        required: true,
      },
    ],
  },

  // ── TESTIMONIALS ──────────────────────────────────────────────────
  'testimonials-dynamic': {
    componentName: 'testimonials-dynamic',
    section: 'testimonials',
    props: [
      { name: 'title',       type: 'string', description: 'Section title, max 6 words',       maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'Subtitle text, max 15 words',      maxWords: 15, required: false },
      { name: 'testimonials',type: 'Array<{text:string,name?:string,role?:string,image?:string}>', description: 'Real feedback content summarised from site. Each text max 25 words. If no real testimonials exist, generate realistic domain-specific feedback with contextual roles (e.g. "Accounting Student", "Course Graduate") - NOT generic names like John Doe. For each testimonial, optionally include a portrait image URL from Available Images if relevant.', required: true },
    ],
  },
  'testimonials-elegant-dynamic': {
    componentName: 'testimonials-elegant-dynamic',
    section: 'testimonials',
    props: [
      {
        name: 'title',
        type: 'string',
        description: 'The main heading for the testimonials section. Max 10 words.',
        maxWords: 10,
        required: true,
      },
      {
        name: 'testimonials',
        type: 'array',
        description: 'A list of testimonial objects, each containing name, text, and avatar URL.',
        required: true,
      },
      {
        name: 'plusIcon',
        type: 'icon',
        description: 'A plus or cross icon to be placed at the corners of the testimonial box.',
        required: false,
      },
      {
        name: 'prevIcon',
        type: 'icon',
        description: 'An arrow icon for the previous button.',
        required: false,
      },
      {
        name: 'nextIcon',
        type: 'icon',
        description: 'An arrow icon for the next button.',
        required: false,
      },
    ],
  },

  // ── NAVBAR ────────────────────────────────────────────────────────
  'navbar-dynamic': {
    componentName: 'navbar-dynamic',
    section: 'navbar',
    props: [
      { name: 'logo',
        type: 'object',
        description: 'Brand logo with text and link',
        properties: {
          text: { type: 'string', description: 'The brand name text' },
          href: { type: 'string', description: 'The link for the logo' }
        },
        required: false
      },
      { name: 'navItems',
        type: 'array',
        description: 'Navigation links. IMPORTANT: You MUST create one navItem for EACH page in the "Available Redesigned Pages" list. Map each slug to a human-readable label using these rules: "index" → "Home", "about" → "About", "career" → "Career", "exam" → "Exam", "gallery" → "Gallery", "contact-us" or "contact us" → "Contact", "partnership" → "Partnership". Use href format exactly: "/preview/[slug]" (e.g., "/preview/index", "/preview/about", "/preview/career"). Do NOT skip any page from the list. Do NOT add pages not in the list.',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            href: { type: 'string' },
            subItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: { type: 'string' },
                  href: { type: 'string' }
                }
              }
            }
          }
        },
        required: false
      },
      { name: 'actions',
        type: 'array',
        description: 'Call-to-action buttons in the navbar',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            href: { type: 'string' },
            variant: { type: 'string', enum: ['primary', 'secondary', 'outline'] }
          }
        },
        required: false
      },
    ],
  },

  // ── CONTACT ───────────────────────────────────────────────────────
  'contact-split-dynamic': {
    componentName: 'contact-split-dynamic',
    section: 'contact',
    props: [
      { name: 'title', type: 'string', description: 'Main heading for the contact section', maxWords: 8, required: true },
      { name: 'description', type: 'string', description: 'Subtext explaining the contact purpose', maxWords: 20, required: false },
      { name: 'formTitle', type: 'string', description: 'Heading for the contact form', maxWords: 6, required: false },
      { name: 'nameLabel', type: 'string', description: 'Label for the name input field', maxWords: 3, required: false },
      { name: 'namePlaceholder', type: 'string', description: 'Placeholder for the name input field', maxWords: 5, required: false },
      { name: 'emailLabel', type: 'string', description: 'Label for the email input field', maxWords: 3, required: false },
      { name: 'emailPlaceholder', type: 'string', description: 'Placeholder for the email input field', maxWords: 5, required: false },
      { name: 'phoneLabel', type: 'string', description: 'Label for the phone input field', maxWords: 3, required: false },
      { name: 'phonePlaceholder', type: 'string', description: 'Placeholder for the phone input field', maxWords: 5, required: false },
      { name: 'messageLabel', type: 'string', description: 'Label for the message textarea', maxWords: 3, required: false },
      { name: 'messagePlaceholder', type: 'string', description: 'Placeholder for the message textarea', maxWords: 8, required: false },
      { name: 'submitButtonText', type: 'string', description: 'Text for the form submission button', maxWords: 4, required: false }
    ],
  },

  // ── FOOTER ────────────────────────────────────────────────────────
  'footer-simple': {
    componentName: 'footer-simple',
    section: 'footer',
    props: [
      { name: 'brandName',   type: 'string',   description: 'Brand or company name',                     maxWords: 4,  required: true  },
      { name: 'description', type: 'string',   description: 'Short brand description, max 20 words',     maxWords: 20, required: false },
      { name: 'copyright',   type: 'string',   description: 'Copyright text with year and brand name',   maxWords: 10, required: false },
    ],
  },
};

/**
 * Build the AI prompt for a single component.
 */
function buildPropPrompt(
  schema: ComponentPropSchema,
  content: ExtractedWebsiteContent
): string {
  const sectionContext = getSectionSpecificContext(content, schema.section);
  const propsDescription = schema.props
    .map(p => `  - "${p.name}" (${p.type}): ${p.description}${p.required ? ' [REQUIRED]' : ' [OPTIONAL]'}`)
    .join('\n');

  const availableImages = formatImageList([
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
- Prefer images that came from this specific section when available.

Use this context to write props that closely mirror the PURPOSE and CONTENT TYPE of the source website,
but rewritten in fresh, professional language suitable for the redesigned page.
${schema.componentName === 'navbar-dynamic' ? `\n## NAVBAR-SPECIFIC RULES (CRITICAL — FOLLOW EXACTLY):
- You MUST create one navItem for EVERY slug listed in "AVAILABLE REDESIGNED PAGES" above
- If there are 7 pages listed, navItems array MUST have 7 items
- href format is EXACTLY "/preview/[slug]" — no trailing slash, no domain
- Label mapping: "index"→"Home", "about"→"About", "career"→"Career", 
  "exam"→"Exam", "gallery"→"Gallery", "contact-us"→"Contact Us", 
  "partnership"→"Partnership", "contact"→"Contact"
- For any other slug: capitalize each word and replace hyphens with spaces
- Include a logo object: {"text": "[brand name from content]", "href": "/preview/index"}
- Include actions array with at least one CTA button from the source website
  (e.g., Sign In / Register Now)
` : ''}

## Available Images (select most relevant ones for this section):
${availableImages}

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
9. **IMAGE SELECTION**: Select the MOST relevant image(s) for this section from the "Available Images" list above. Return the selected image URL(s) in the 'image' or 'items[].image' field if the component supports it. Do NOT use images not listed above.
10. If no relevant image exists for this section, leave image fields as null/undefined — do NOT force an image.

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
  const schema = COMPONENT_PROP_SCHEMAS[componentName];

  if (!schema) {
    console.log(`[AI Prop Injector] No schema for ${componentName}, skipping AI injection`);
    return {};
  }

  try {
    const prompt = buildPropPrompt(schema, content);
    console.log(`[AI Prop Injector] Generating props for ${componentName}...`);
    const raw = await callAI(prompt);
    const props = parseJSON(raw);
    console.log(`[AI Prop Injector] Props generated for ${componentName}:`, props);
    return props;
  } catch (error: any) {
    console.error(`[AI Prop Injector] Failed for ${componentName}:`, error.message);
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
    }
  }

  console.log('[AI Prop Injector] AI prop generation complete for components:', Object.keys(propMap));
  return propMap;
}
