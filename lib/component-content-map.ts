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
  'hero-ab': {
    isDynamic: true,
    contentSlots: [
      { prop: 'content.title',       type: 'heading',   maxWords: 8  },
      { prop: 'content.subtitle',    type: 'paragraph', maxWords: 20 },
      { prop: 'content.buttonText',  type: 'cta',       maxWords: 4  },
    ],
  },
  'hero-ac': {
    isDynamic: true,
    contentSlots: [
      { prop: 'content.title',       type: 'heading',   maxWords: 8  },
      { prop: 'content.description', type: 'paragraph', maxWords: 25 },
      { prop: 'content.buttonText',  type: 'cta',       maxWords: 4  },
    ],
  },
  'hero-ad': {
    isDynamic: true,
    contentSlots: [
      { prop: 'content.title',       type: 'heading',   maxWords: 8  },
      { prop: 'content.subtitle',    type: 'label',     maxWords: 6  },
      { prop: 'content.description', type: 'paragraph', maxWords: 25 },
      { prop: 'content.buttonText',  type: 'cta',       maxWords: 4  },
    ],
  },
  'hero-ae': {
    isDynamic: true,
    contentSlots: [
      { prop: 'content.title',       type: 'heading',   maxWords: 8  },
      { prop: 'content.subtitle',    type: 'label',     maxWords: 6  },
      { prop: 'content.description', type: 'paragraph', maxWords: 25 },
      { prop: 'content.buttonText',  type: 'cta',       maxWords: 4  },
    ],
  },
  'hero-elegant': { isDynamic: false, contentSlots: [] },
  'hero-minimal': { isDynamic: false, contentSlots: [] },
  'hero-modern':  { isDynamic: false, contentSlots: [] },
  'hero-simple':  { isDynamic: false, contentSlots: [] },
  'hero-stylish': { isDynamic: false, contentSlots: [] },

  // ── FEATURES ────────────────────────────────────────────────────────
  'features- Image': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 6 },
    ],
  },
  'features-coursel': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',       type: 'heading',   maxWords: 6  },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
    ],
  },
  'features-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',        type: 'heading',   maxWords: 8  },
      { prop: 'description',  type: 'paragraph', maxWords: 25 },
      { prop: 'items',        type: 'list',     maxWords: 50 },
    ],
  },
  'features-gallery-type': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',       type: 'heading',   maxWords: 6  },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
    ],
  },
  'features-grid': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge',       type: 'label',     maxWords: 3  },
      { prop: 'heading',     type: 'heading',   maxWords: 6  },
      { prop: 'description', type: 'paragraph', maxWords: 15 },
      { prop: 'featureItems', type: 'list',     maxWords: 10 },
    ],
  },
  'features-Image-new': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge',        type: 'label',     maxWords: 3  },
      { prop: 'title',        type: 'heading',   maxWords: 8  },
      { prop: 'description',  type: 'paragraph', maxWords: 25 },
    ],
  },
  'features-slideshow': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 6 },
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
  'about-two-column': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',                   type: 'heading',   maxWords: 6  },
      { prop: 'description',             type: 'paragraph', maxWords: 40 },
      { prop: 'achievementsTitle',        type: 'heading',   maxWords: 5  },
      { prop: 'achievementsDescription',  type: 'paragraph', maxWords: 20 },
      { prop: 'companiesTitle',           type: 'label',     maxWords: 6  },
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
  'testimonial-cards': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',       type: 'heading',   maxWords: 6  },
      { prop: 'description', type: 'paragraph', maxWords: 15 },
    ],
  },
  'testimonial-gradient': {
    isDynamic: true,
    contentSlots: [],
  },
  'testimonial-modern': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 6 },
    ],
  },
  'testimonial-section4': { isDynamic: true, contentSlots: [] },
  'testimonial-section5': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',       type: 'heading',   maxWords: 6  },
      { prop: 'description', type: 'paragraph', maxWords: 15 },
    ],
  },

  // ── NAVBAR ──────────────────────────────────────────────────────────
  'navbar-elegant':  { isDynamic: false, contentSlots: [] },
  'navbar-gradient': { isDynamic: false, contentSlots: [] },
  'navbar-minimal':  {
    isDynamic: true,
    contentSlots: [
      { prop: 'menuItems', type: 'list', maxWords: 3 },
    ],
  },
  'navbar-modern': {
    isDynamic: true,
    contentSlots: [
      { prop: 'menu', type: 'list', maxWords: 3 },
    ],
  },
  'navbar-stylish': { isDynamic: false, contentSlots: [] },
  'navbar-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'navItems', type: 'list', maxWords: 5 },
      { prop: 'actions', type: 'list', maxWords: 3 },
    ],
  },

  // ── FOOTER ──────────────────────────────────────────────────────────
  'footer-corporate': { isDynamic: false, contentSlots: [] },
  'footer-elegant':   { isDynamic: false, contentSlots: [] },
  'footer-gradient':  { isDynamic: false, contentSlots: [] },
  'footer-minimal':   { isDynamic: false, contentSlots: [] },
  'footer-modern':    { isDynamic: false, contentSlots: [] },
  'footer-simple': {
    isDynamic: true,
    contentSlots: [
      { prop: 'brandName',   type: 'label',     maxWords: 4  },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
      { prop: 'copyright',   type: 'label',     maxWords: 10 },
    ],
  },
  'footer-startup': { isDynamic: false, contentSlots: [] },

  // ── CONTACT ─────────────────────────────────────────────────────────
  'contact-form': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title',       type: 'heading',   maxWords: 5  },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
    ],
  },
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

  // ── PRICING ─────────────────────────────────────────────────────────
  'pricing-cards':    { isDynamic: false, contentSlots: [] },
  'pricing-elegant':  { isDynamic: false, contentSlots: [] },
  'pricing-gradient': { isDynamic: false, contentSlots: [] },
  'pricing-modern':   { isDynamic: false, contentSlots: [] },
  'pricing-simple':   { isDynamic: false, contentSlots: [] },
};

/**
 * Check if a component can accept dynamic content.
 */
export function isComponentDynamic(componentName: string): boolean {
  return COMPONENT_CONTENT_MAP[componentName]?.isDynamic ?? false;
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
