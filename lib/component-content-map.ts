/**
 * Component Content Map
 * Declares what text content each component can accept dynamically.
 *
 * isDynamic: true  = component can receive extracted website text
 * isDynamic: false = component has hardcoded content, skip in layout
 *
 * contentSlots = list of text fields the component accepts as props
 * Each slot has:
 *   prop     = the prop name on the component
 *   type     = 'heading' | 'paragraph' | 'list' | 'label' | 'cta'
 *   maxWords = soft limit, content will be summarised to fit
 */

export interface ContentSlot {
  prop: string;
  type: 'heading' | 'paragraph' | 'list' | 'label' | 'cta';
  maxWords: number;
}

export interface ComponentContentConfig {
  isDynamic: boolean;
  contentSlots: ContentSlot[];
}

export const COMPONENT_CONTENT_MAP: Record<string, ComponentContentConfig> = {

  // ── HERO ────────────────────────────────────────────────────────────
  'hero-action-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 12 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 3 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 4 },
      { prop: 'trustText', type: 'paragraph', maxWords: 15 },
      { prop: 'floatingCard1Title', type: 'heading', maxWords: 3 },
      { prop: 'floatingCard1Subtitle', type: 'paragraph', maxWords: 8 },
      { prop: 'floatingCard2Title', type: 'heading', maxWords: 4 },
      { prop: 'floatingCard2Subtitle', type: 'paragraph', maxWords: 8 },
    ],
  },

  'hero-active-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 12 },
      { prop: 'expertCount', type: 'label', maxWords: 5 },
      { prop: 'expertLabel', type: 'label', maxWords: 10 },
      { prop: 'expertDescription', type: 'paragraph', maxWords: 30 },
      { prop: 'portraitCtaText', type: 'cta', maxWords: 5 },
      { prop: 'featureTitle', type: 'heading', maxWords: 8 },
      { prop: 'featureDescription', type: 'paragraph', maxWords: 20 },
      { prop: 'statsCount', type: 'label', maxWords: 5 },
      { prop: 'statsLabel', type: 'heading', maxWords: 8 },
      { prop: 'statsDescription', type: 'paragraph', maxWords: 20 },
    ],
  },

  'hero-adapt-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'trustpilotRating', type: 'label', maxWords: 5 },
      { prop: 'trustpilotReviews', type: 'label', maxWords: 5 },
      { prop: 'trustpilotSubLabel', type: 'paragraph', maxWords: 15 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'feature1Text', type: 'list', maxWords: 10 },
      { prop: 'feature2Text', type: 'list', maxWords: 10 },
      { prop: 'feature3Text', type: 'list', maxWords: 10 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
    ],
  },

  'hero-alpha-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 10 },
      { prop: 'titleStart', type: 'heading', maxWords: 5 },
      { prop: 'titleAccent', type: 'heading', maxWords: 2 },
      { prop: 'titleEnd', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
    ],
  },

  'hero-anchor-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 5 },
    ],
  },

  'hero-apex-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'subheading', type: 'paragraph', maxWords: 25 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
      { prop: 'ratingValue', type: 'label', maxWords: 3 },
      { prop: 'testimonialQuote', type: 'paragraph', maxWords: 15 },
      { prop: 'testimonialAuthor', type: 'label', maxWords: 5 },
      { prop: 'featureTitle', type: 'heading', maxWords: 8 },
      { prop: 'featureDescription', type: 'paragraph', maxWords: 15 },
      { prop: 'stat1Value', type: 'label', maxWords: 5 },
      { prop: 'stat1Label', type: 'label', maxWords: 8 },
      { prop: 'sinceLabel', type: 'label', maxWords: 3 },
      { prop: 'sinceValue', type: 'label', maxWords: 3 },
    ],
  },

  // ── BLOG ────────────────────────────────────────────────────────────
  'blog-article-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'tagline', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'posts.title', type: 'heading', maxWords: 15 },
      { prop: 'posts.description', type: 'paragraph', maxWords: 40 },
      { prop: 'posts.date', type: 'label', maxWords: 5 },
      { prop: 'posts.category', type: 'label', maxWords: 5 },
    ],
  },

  'blog-feed-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'posts.category', type: 'label', maxWords: 5 },
      { prop: 'posts.title', type: 'heading', maxWords: 15 },
      { prop: 'posts.ctaText', type: 'cta', maxWords: 5 }
    ],
  },

  'blog-grid-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'sectionTitle', type: 'heading', maxWords: 5 },
      { prop: 'articleCount', type: 'label', maxWords: 2 },
      { prop: 'sortLabel', type: 'label', maxWords: 3 },
      { prop: 'items.title', type: 'heading', maxWords: 15 },
      { prop: 'items.excerpt', type: 'paragraph', maxWords: 30 },
      { prop: 'items.authorName', type: 'label', maxWords: 5 },
      { prop: 'items.date', type: 'label', maxWords: 5 },
      { prop: 'items.category', type: 'label', maxWords: 3 },
      { prop: 'items.readTime', type: 'label', maxWords: 5 },
      { prop: 'paginationItems.label', type: 'label', maxWords: 2 }
    ],
  },

  // ── ABOUT ───────────────────────────────────────────────────────────
  'about-bio-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'ctaText', type: 'cta', maxWords: 3 },
      { prop: 'storyTitle', type: 'heading', maxWords: 5 },
      { prop: 'storyDescription', type: 'paragraph', maxWords: 30 },
      { prop: 'missionTitle', type: 'heading', maxWords: 5 },
      { prop: 'missionDescription', type: 'paragraph', maxWords: 25 },
      { prop: 'visionTitle', type: 'heading', maxWords: 5 },
      { prop: 'visionDescription', type: 'paragraph', maxWords: 25 },
    ],
  },

  'about-brand-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 12 },
      { prop: 'description', type: 'paragraph', maxWords: 50 },
      { prop: 'ctaText', type: 'cta', maxWords: 4 },
      { prop: 'items', type: 'list', maxWords: 30 },
    ],
  },

  // ── FOOTER ──────────────────────────────────────────────────────────
  'footer-simple': {
    isDynamic: true,
    contentSlots: [
      { prop: 'brandName',   type: 'label',     maxWords: 4  },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
      { prop: 'copyright',   type: 'label',     maxWords: 10 },
    ],
  },

  // ── COMPANY-STORY ───────────────────────────────────────────────────
  'company-story-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'tagline', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'milestones', type: 'list', maxWords: 100 },
    ],
  },

  'story-archive-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'topHeading', type: 'heading', maxWords: 15 },
      { prop: 'topDescription', type: 'paragraph', maxWords: 30 },
      { prop: 'bottomHeading', type: 'heading', maxWords: 25 },
      { prop: 'bottomDescription', type: 'paragraph', maxWords: 60 },
      { prop: 'ratingValue', type: 'label', maxWords: 5 },
      { prop: 'ratingLabel', type: 'label', maxWords: 5 },
      { prop: 'stats', type: 'list', maxWords: 20 },
    ],
  },

  // ── FAQ-PROCESS ─────────────────────────────────────────────────────
  'faq-process-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'tagline', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'items', type: 'list', maxWords: 150 },
    ],
  },

  // ── CONTACT ─────────────────────────────────────────────────────────
  'contact-form-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'emailLabel', type: 'label', maxWords: 5 },
      { prop: 'email', type: 'paragraph', maxWords: 10 },
      { prop: 'phoneLabel', type: 'label', maxWords: 5 },
      { prop: 'phone', type: 'paragraph', maxWords: 10 },
      { prop: 'addressLabel', type: 'label', maxWords: 5 },
      { prop: 'address', type: 'paragraph', maxWords: 30 },
      { prop: 'socialTitle', type: 'label', maxWords: 5 },
      { prop: 'formNameLabel', type: 'label', maxWords: 5 },
      { prop: 'formNamePlaceholder', type: 'paragraph', maxWords: 10 },
      { prop: 'formEmailLabel', type: 'label', maxWords: 5 },
      { prop: 'formEmailPlaceholder', type: 'paragraph', maxWords: 10 },
      { prop: 'formMessageLabel', type: 'label', maxWords: 5 },
      { prop: 'formMessagePlaceholder', type: 'paragraph', maxWords: 15 },
      { prop: 'formSubmitLabel', type: 'cta', maxWords: 5 },
    ],
  },

  // ── CTA ─────────────────────────────────────────────────────────────
  'cta-banner-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
      { prop: 'items', type: 'list', maxWords: 20 },
      { prop: 'bottomLabel', type: 'label', maxWords: 10 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
    ],
  },

  // ── NAVBAR ──────────────────────────────────────────────────────────
  'nav-bar-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'label', maxWords: 5 },
      { prop: 'loginLabel', type: 'cta', maxWords: 3 },
      { prop: 'signupLabel', type: 'cta', maxWords: 3 },
      { prop: 'navLinks', type: 'list', maxWords: 10 },
    ],
  },

  'nav-float-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'label', maxWords: 3 },
      { prop: 'ctaText', type: 'cta', maxWords: 3 },
    ],
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-client-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'subtext', type: 'paragraph', maxWords: 25 },
      { prop: 'testimonials', type: 'list', maxWords: 0 },
    ],
  },

  // ── GALLERY ─────────────────────────────────────────────────────────
  'gallery-album-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
    ],
  },

  // ── FEATURE ─────────────────────────────────────────────────────────
  'feature-aspect-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 30 },
      { prop: 'feature1Title', type: 'label', maxWords: 5 },
      { prop: 'feature1Description', type: 'paragraph', maxWords: 15 },
      { prop: 'feature2Title', type: 'label', maxWords: 5 },
      { prop: 'feature2Description', type: 'paragraph', maxWords: 15 },
      { prop: 'feature3Title', type: 'label', maxWords: 5 },
      { prop: 'feature3Description', type: 'paragraph', maxWords: 15 },
      { prop: 'feature4Title', type: 'label', maxWords: 5 },
      { prop: 'feature4Description', type: 'paragraph', maxWords: 15 },
    ],
  },

  'feature-detail-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'loadMoreText', type: 'cta', maxWords: 5 },
      { prop: 'items', type: 'list', maxWords: 100 },
    ],
  },

  // ── BENEFITS ──────────────────────────────────────────────────────────
  'benefits-advantage-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 3 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'items', type: 'list', maxWords: 60 },
      { prop: 'experienceValue', type: 'label', maxWords: 2 },
      { prop: 'experienceLabel', type: 'label', maxWords: 3 },
    ],
  },

  'benefits-asset-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'footerButtonText', type: 'cta', maxWords: 5 },
      { prop: 'items', type: 'list', maxWords: 100 },
    ],
  },

  // ── FEATURES ──────────────────────────────────────────────────────────
  'feature-element-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 3 },
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 3 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 3 },
      { prop: 'features', type: 'list', maxWords: 100 },
    ],
  },

};

/**
 * Check if a component can accept dynamic content.
 */
export function isComponentDynamic(componentName: string): boolean {
  // Explicit map entry takes priority
  if (componentName in COMPONENT_CONTENT_MAP) {
    return COMPONENT_CONTENT_MAP[componentName].isDynamic;
  }
  // Any component whose name ends with -dynamic is implicitly dynamic
  // (it accepts AI-generated props even without a manual content slot declaration)
  return componentName.endsWith('-dynamic');
}

/**
 * Get all dynamic component names for a given section category.
 * Used by the layout generator to exclude static-only components.
 */
export function getDynamicComponents(category: string): string[] {
  return Object.entries(COMPONENT_CONTENT_MAP)
    .filter(([name, config]) => {
      const isInCategory = name.startsWith(category);
      return isInCategory && config.isDynamic;
    })
    .map(([name]) => name);
}

/**
 * Get all dynamic-only component names (components ending with -dynamic).
 * These are the ONLY components that should be selected by the AI layout generator.
 */
export function getDynamicOnlyComponents(): string[] {
  return Object.entries(COMPONENT_CONTENT_MAP)
    .filter(([name, config]) => name.endsWith('-dynamic') && config.isDynamic)
    .map(([name]) => name);
}

/**
 * Get all static-only component names.
 * These should never be selected by the AI layout generator.
 * ANY component NOT ending in '-dynamic' is treated as static/excluded.
 */
export function getStaticOnlyComponents(): string[] {
  return Object.keys(COMPONENT_CONTENT_MAP).filter(name => !name.endsWith('-dynamic'));
}
