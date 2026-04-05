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

  // ── BLOG ──────────────────────────────────────────────────────────────
  'blog-article-dynamic': {
    imageCount: 6,
    imageProp: 'posts',
    imageMode: 'items',
  },

  // ── ABOUT ─────────────────────────────────────────────────────────────
  'about-bio-dynamic': {
    imageCount: 1,
    imageProp: 'storyImage',
    imageMode: 'single',
  },

  // ── COMPANY-STORY ─────────────────────────────────────────────────────
  'company-story-dynamic': {
    imageCount: 4,
    imageProp: 'milestones',
    imageMode: 'items',
  },

  // ── FAQ-PROCESS ───────────────────────────────────────────────────────
  'faq-process-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  // ── FOOTER ────────────────────────────────────────────────────────────
  'footer-simple': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
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

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-client-dynamic': {
    imageCount: 6,
    imageProp: 'authorImage',
    imageMode: 'items',
  },

  // ── GALLERY ─────────────────────────────────────────────────────────
  'gallery-album-dynamic': {
    imageCount: 7,
    imageProp: 'images',
    imageMode: 'array',
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
