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
  'hero-dynamic': { imageCount: 1, imageProp: 'image', imageMode: 'single' },
  'hero-simple-dynamic': { imageCount: 1, imageProp: 'image', imageMode: 'single' },
  'hero-elegant-dynamic': { imageCount: 1, imageProp: 'mediaUrl', imageMode: 'single' },
  'hero-stylish-coloured-dynamic': {
    imageCount: 0,
    imageProp: 'none',
    imageMode: 'none',
  },
  'hero-super-coloured-dynamic': {
    imageCount: 1,
    imageProp: 'mainImage',
    imageMode: 'single',
  },
  'hero-supersimple-coloured-dynamic': {
    imageCount: 1,
    imageProp: 'heroImage',
    imageMode: 'single',
  },
  'hero-banner-dynamic': { imageCount: 1, imageProp: 'backgroundImage', imageMode: 'single' },

  // ── GALLERY ───────────────────────────────────────────────────────────
  'gallery-dynamic': {
    imageCount: 6,
    imageProp: 'items',
    imageMode: 'items',
  },
  'gallery-elegant-dynamic': {
    imageCount: 5,
    imageProp: 'items',
    imageMode: 'items',
  },

  // ── CTA ───────────────────────────────────────────────────────────────
  'cta-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },
  'cta-simple-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  // ── BLOG ──────────────────────────────────────────────────────────────
  'blog-dynamic': {
    imageCount: 6,
    imageProp: 'items',
    imageMode: 'items',
  },
  'blog-elegant-dynamic': {
    imageCount: 3,
    imageProp: 'posts',
    imageMode: 'items',
  },

  // ── FEATURES ──────────────────────────────────────────────────────────
  'features-simple-dynamic': {
    imageCount: 3,
    imageProp: 'features',
    imageMode: 'items',
  },

  // ── ABOUT ─────────────────────────────────────────────────────────────
  'about-simple-dynamic': { imageCount: 2, imageProp: 'heroImage', imageMode: 'single' },
  'about-supersimple-coloured-dynamic': {
    imageCount: 1,
    imageProp: 'imageSrc',
    imageMode: 'single',
  },

  // ── TESTIMONIALS ──────────────────────────────────────────────────────
  'testimonials-elegant-dynamic': { imageCount: 5, imageProp: 'testimonials', imageMode: 'items' },

  // ── NAVBAR ────────────────────────────────────────────────────────────
  'navbar-dynamic':  { imageCount: 0, imageProp: '', imageMode: 'none' },
  'navbar-floating-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },
  'navbar-floatingtwo-dynamic': {
    imageCount: 1,
    imageProp: 'logoImage',
    imageMode: 'single',
  },

  // ── FOOTER ────────────────────────────────────────────────────────────
  'footer-simple':    { imageCount: 0, imageProp: '', imageMode: 'none' },

  // ── CONTACT ───────────────────────────────────────────────────────────
  'contact-split-dynamic': { imageCount: 0, imageProp: '', imageMode: 'none' },
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
