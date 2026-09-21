/**
 * Component Image Map
 * Defines how every component receives images.
 * To add a new component: just add one entry here.
 *
 * imageCount = how many images this component uses
 * imageProp  = the prop name the component expects images on
 * imageMode  = "array" (string[]) | "single" (string) | "object" ({src,alt})
 *              | "items" (array of objects with image field) | "none"
 */

export interface ComponentImageConfig {
  imageCount: number;
  imageProp: string;
  imageMode: 'array' | 'single' | 'object' | 'items' | 'none';
}

export const COMPONENT_IMAGE_MAP: Record<string, ComponentImageConfig> = {

  // ── HERO ──────────────────────────────────────────────────────────────
  'hero-action-dynamic': {
    imageCount: 1,
    imageProp: 'mainImage',
    imageMode: 'single',
  },

  'hero-new-base-dynamic': {
    imageCount: 1,
    imageProp: 'imageUrl',
    imageMode: 'single',
  },

  'hero-beam-dynamic': {
    imageCount: 4,
    imageProp: 'avatarImages',
    imageMode: 'array',
  },

  // ── BANNER ────────────────────────────────────────────────────────────
  'banner-header-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImageUrl',
    imageMode: 'single',
  },

  // ── ABOUT ─────────────────────────────────────────────────────────────
  'about-brand-dynamic': {
    imageCount: 1,
    imageProp: 'image',
    imageMode: 'single',
  },

  // ── FOOTER ────────────────────────────────────────────────────────────
  'footer-ether-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  // ── CONTACT ──────────────────────────────────────────────────────────
  'contact-form-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  // ── CTA ─────────────────────────────────────────────────────────────
  'cta-banner-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  // ── NAVBAR ──────────────────────────────────────────────────────────
  'nav-bar-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'nav-float-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'nav-header-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'nav-link-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'nav-menu-dynamic': {
    imageCount: 1,
    imageProp: 'logoImage',
    imageMode: 'single',
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-client-dynamic': {
    imageCount: 6,
    imageProp: 'authorImage',
    imageMode: 'items',
  },

  // ── MISSION-VISION ───────────────────────────────────────────────────
  'mission-brand-dynamic': {
    imageCount: 1,
    imageProp: 'imageUrl',
    imageMode: 'single',
  },

  // ── GALLERY ─────────────────────────────────────────────────────────
  'gallery-album-dynamic': {
    imageCount: 7,
    imageProp: 'images',
    imageMode: 'array',
  },

  // ── FEATURE ─────────────────────────────────────────────────────────
  'feature-aspect-dynamic': {
    imageCount: 1,
    imageProp: 'centerImage',
    imageMode: 'single',
  },

  // ── BLOG ─────────────────────────────────────────────────────────────
  'blog-journal-dynamic': {
    imageCount: 3,
    imageProp: 'items.image',
    imageMode: 'items',
  },

  // ── BENEFITS ─────────────────────────────────────────────────────────
  'benefits-advantage-dynamic': {
    imageCount: 2,
    imageProp: 'images',
    imageMode: 'array',
  },

  // ── PRICING ──────────────────────────────────────────────────────────
  'pricing-matrix-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  // ── FAQ-PROCESS ───────────────────────────────────────────────────────
  'faq-great-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  // ── SERVICE-OFFERINGS ──────────────────────────────────────────────────
  'service-grid-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  // ── COMPANY-STORY ─────────────────────────────────────────────────────
  'company-story-dynamic': {
    imageCount: 1,
    imageProp: 'milestones.image',
    imageMode: 'items',
  },

};

/**
 * Get image config for a component.
 * Returns a safe default if component is not registered.
 */
export function getComponentImageConfig(componentName: string): ComponentImageConfig {
  return COMPONENT_IMAGE_MAP[componentName] ?? {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  };
}

/**
 * Get total images needed for a list of components.
 * Used by the distributor to know how many images to pull.
 */
export function getTotalImagesNeeded(componentNames: string[]): number {
  return componentNames.reduce((total, name) => {
    return total + (COMPONENT_IMAGE_MAP[name]?.imageCount ?? 0);
  }, 0);
}
