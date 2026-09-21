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

  'hero-new-base-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'tagline', type: 'label', maxWords: 15 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'ctaText', type: 'cta', maxWords: 4 },
      { prop: 'statValue', type: 'label', maxWords: 4 },
      { prop: 'statLabel', type: 'paragraph', maxWords: 8 },
      { prop: 'highlightTitle', type: 'heading', maxWords: 6 },
      { prop: 'highlightDescription', type: 'paragraph', maxWords: 18 },
    ],
  },

  'hero-beam-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 4 },
      { prop: 'statValue', type: 'label', maxWords: 3 },
      { prop: 'statBadge', type: 'label', maxWords: 3 },
      { prop: 'cardOneTitle', type: 'heading', maxWords: 8 },
      { prop: 'cardTwoTitle', type: 'heading', maxWords: 8 },
      { prop: 'cardThreeTitle', type: 'heading', maxWords: 10 },
      { prop: 'cardThreeCtaText', type: 'cta', maxWords: 4 },
    ],
  },

  // ── BANNER ─────────────────────────────────────────────────────────
  'banner-header-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 20 },
      { prop: 'badgeText', type: 'label', maxWords: 10 },
    ],
  },

  // ── ABOUT ───────────────────────────────────────────────────────────
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
  'footer-ether-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'brandName', type: 'heading', maxWords: 10 },
      { prop: 'brandDescription', type: 'paragraph', maxWords: 80 },
      { prop: 'searchPlaceholder', type: 'label', maxWords: 6 },
      { prop: 'menuTitle', type: 'heading', maxWords: 8 },
      { prop: 'infoTitle', type: 'heading', maxWords: 8 },
      { prop: 'socialTitle', type: 'heading', maxWords: 8 },
      { prop: 'goOnTopText', type: 'label', maxWords: 6 },
      { prop: 'copyrightText', type: 'paragraph', maxWords: 15 }
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
      { prop: 'activeLabel', type: 'label', maxWords: 4 },
    ],
  },

  'nav-header-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'ctaText', type: 'cta', maxWords: 4 },
    ],
  },

  'nav-link-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'activeItem', type: 'label', maxWords: 3 },
      { prop: 'ctaText', type: 'cta', maxWords: 4 },
    ],
  },

  'nav-menu-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'label', maxWords: 3 },
      { prop: 'activeItem', type: 'label', maxWords: 3 },
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

  // ── MISSION-VISION ───────────────────────────────────────────────────
  'mission-brand-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
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

  // ── BLOG ─────────────────────────────────────────────────────────────
  'blog-journal-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'subtitle', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 20 },
      { prop: 'items.title', type: 'heading', maxWords: 25 },
      { prop: 'items.description', type: 'paragraph', maxWords: 50 },
      { prop: 'items.category', type: 'label', maxWords: 5 },
      { prop: 'items.date', type: 'label', maxWords: 10 }
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

  // ── PRICING ──────────────────────────────────────────────────────────
  'pricing-matrix-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'featuresHeader', type: 'label', maxWords: 5 }
    ],
  },

  // ── FAQ-PROCESS ─────────────────────────────────────────────────────
  'faq-great-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'titleHighlight', type: 'label', maxWords: 4 },
      { prop: 'description', type: 'paragraph', maxWords: 40 }
    ],
  },

  // ── SERVICE-OFFERINGS ──────────────────────────────────────────────────
  'service-grid-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 30 },
    ],
  },

  // ── COMPANY-STORY ──────────────────────────────────────────────────────
  'company-story-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'subtitle', type: 'label', maxWords: 10 },
      { prop: 'intro', type: 'paragraph', maxWords: 40 },
      { prop: 'milestones.title', type: 'heading', maxWords: 15 },
      { prop: 'milestones.description', type: 'paragraph', maxWords: 40 },
      { prop: 'milestones.year', type: 'label', maxWords: 5 }
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
