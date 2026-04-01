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
  'hero-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'subtitle',       type: 'label',     maxWords: 6  },
      { prop: 'title',         type: 'heading',   maxWords: 8  },
      { prop: 'description',   type: 'paragraph', maxWords: 25 },
      { prop: 'buttonText',    type: 'cta',       maxWords: 4  },
      { prop: 'secondaryButtonText', type: 'cta', maxWords: 4  },
    ],
  },
  'hero-simple-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 3 },
      { prop: 'titlePart1', type: 'heading', maxWords: 10 },
      { prop: 'titlePart2', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 4 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 4 },
    ],
  },
  'hero-elegant-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 15 },
      { prop: 'title', type: 'heading', maxWords: 12 },
      { prop: 'description', type: 'paragraph', maxWords: 25 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 4 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 4 }
    ],
  },
  'hero-stylish-coloured-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 25 },
      { prop: 'emailPlaceholder', type: 'label', maxWords: 5 },
      { prop: 'buttonText', type: 'cta', maxWords: 3 },
      { prop: 'sectionTitle', type: 'heading', maxWords: 5 },
      { prop: 'exploreText', type: 'cta', maxWords: 3 },
      { prop: 'items', type: 'list', maxWords: 100 },
    ],
  },
  'hero-super-coloured-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'statTopRightValue', type: 'label', maxWords: 3 },
      { prop: 'statTopRightLabel', type: 'label', maxWords: 5 },
      { prop: 'smallCardText', type: 'paragraph', maxWords: 10 },
      { prop: 'bottomLeftStatValue', type: 'label', maxWords: 5 },
      { prop: 'bottomLeftStatLabel', type: 'paragraph', maxWords: 15 },
    ],
  },
  'hero-supersimple-coloured-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'features.title', type: 'label', maxWords: 10 },
      { prop: 'features.description', type: 'paragraph', maxWords: 20 },
    ],
  },
  'hero-banner-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'breadcrumb', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
    ],
  },

  // ── GALLERY ─────────────────────────────────────────────────────────
  'gallery-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 30 },
      { prop: 'items', type: 'list', maxWords: 100 },
    ],
  },
  'gallery-elegant-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 3 },
      { prop: 'heading', type: 'heading', maxWords: 8 },
      { prop: 'subheading', type: 'paragraph', maxWords: 25 },
      { prop: 'items', type: 'list', maxWords: 60 },
    ],
  },

  // ── CTA ─────────────────────────────────────────────────────────────
  'cta-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 5 },
      { prop: 'headline', type: 'heading', maxWords: 12 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'primaryButtonText', type: 'cta', maxWords: 4 },
      { prop: 'secondaryButtonText', type: 'cta', maxWords: 4 },
    ],
  },
  'cta-simple-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 25 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 3 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 3 },
      { prop: 'stats', type: 'list', maxWords: 15 }
    ],
  },

  // ── BLOG ────────────────────────────────────────────────────────────
  'blog-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 30 },
      { prop: 'items', type: 'list', maxWords: 150 },
    ],
  },
  'blog-elegant-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'tagline', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'posts', type: 'list', maxWords: 100 }
    ],
  },

  // ── FEATURES ────────────────────────────────────────────────────────
  'features-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',        type: 'heading',   maxWords: 8  },
      { prop: 'description',  type: 'paragraph', maxWords: 25 },
      { prop: 'items',        type: 'list',     maxWords: 50 },
    ],
  },
  'features-simple-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'tagline', type: 'label', maxWords: 10 },
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'features', type: 'list', maxWords: 0 },
    ],
  },

  // ── ABOUT ───────────────────────────────────────────────────────────
  'about-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',        type: 'heading',   maxWords: 6  },
      { prop: 'description',  type: 'paragraph', maxWords: 40 },
      { prop: 'stats',        type: 'list',     maxWords: 10 },
      { prop: 'companies',    type: 'list',     maxWords: 15 },
    ],
  },
  'about-simple-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'headline', type: 'heading', maxWords: 10 },
      { prop: 'topIntro', type: 'paragraph', maxWords: 40 },
      { prop: 'label', type: 'label', maxWords: 10 },
      { prop: 'subIntro', type: 'paragraph', maxWords: 50 },
      { prop: 'avatarName', type: 'label', maxWords: 10 },
      { prop: 'avatarTitle', type: 'label', maxWords: 15 },
      { prop: 'mainStatement', type: 'paragraph', maxWords: 80 },
    ],
  },
  'about-supersimple-coloured-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'descriptionLeft', type: 'paragraph', maxWords: 50 },
      { prop: 'descriptionRight', type: 'paragraph', maxWords: 50 },
      { prop: 'testimonialQuote', type: 'paragraph', maxWords: 15 },
      { prop: 'testimonialAuthor', type: 'label', maxWords: 10 },
      { prop: 'subTitle', type: 'heading', maxWords: 15 },
      { prop: 'subDescription', type: 'paragraph', maxWords: 50 },
      { prop: 'highlightQuote', type: 'paragraph', maxWords: 30 },
    ],
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testimonials-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',        type: 'heading',   maxWords: 6  },
      { prop: 'description',  type: 'paragraph', maxWords: 15 },
      { prop: 'testimonials', type: 'list',     maxWords: 60 },
    ],
  },
  'testimonials-elegant-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'testimonials', type: 'list', maxWords: 100 },
    ],
  },

  // ── NAVBAR ──────────────────────────────────────────────────────────
  'navbar-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'navItems', type: 'list', maxWords: 5 },
      { prop: 'actions', type: 'list', maxWords: 3 },
    ],
  },
  'navbar-floating-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'links', type: 'list', maxWords: 12 },
      { prop: 'ctaLabel', type: 'cta', maxWords: 3 },
    ],
  },
  'navbar-floatingtwo-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'navItems', type: 'list', maxWords: 10 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
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

  // ── CONTACT ─────────────────────────────────────────────────────────
  'contact-split-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',            type: 'heading',   maxWords: 8  },
      { prop: 'description',      type: 'paragraph', maxWords: 20 },
      { prop: 'formTitle',        type: 'heading',   maxWords: 6  },
      { prop: 'nameLabel',        type: 'label',     maxWords: 3  },
      { prop: 'namePlaceholder',  type: 'label',     maxWords: 5  },
      { prop: 'emailLabel',       type: 'label',     maxWords: 3  },
      { prop: 'emailPlaceholder', type: 'label',     maxWords: 5  },
      { prop: 'phoneLabel',       type: 'label',     maxWords: 3  },
      { prop: 'phonePlaceholder', type: 'label',     maxWords: 5  },
      { prop: 'messageLabel',     type: 'label',     maxWords: 3  },
      { prop: 'messagePlaceholder', type: 'label',   maxWords: 8  },
      { prop: 'submitButtonText', type: 'cta',       maxWords: 4  },
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
