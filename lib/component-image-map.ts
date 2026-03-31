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
  'hero-ab':      { imageCount: 4, imageProp: 'images',      imageMode: 'array'  },
  'hero-ac':      { imageCount: 5, imageProp: 'images',      imageMode: 'array'  },
  'hero-ad':      { imageCount: 4, imageProp: 'images',      imageMode: 'array'  },
  'hero-ae':      { imageCount: 1, imageProp: 'images',      imageMode: 'array'  },
  'hero-dynamic': { imageCount: 1, imageProp: 'image',       imageMode: 'single' },
  'hero-simple-dynamic': { imageCount: 1, imageProp: 'image', imageMode: 'single' },
  'hero-elegant-dynamic': { imageCount: 1, imageProp: 'mediaUrl', imageMode: 'single' },
  'hero-elegant-coloured-dynamic': {
    imageCount: 2,
    imageProp: 'images',
    imageMode: 'array',
  },
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
  'hero-elegant': { imageCount: 0, imageProp: '',             imageMode: 'none'   },
  'hero-minimal': { imageCount: 0, imageProp: '',             imageMode: 'none'   },
  'hero-modern':  { imageCount: 0, imageProp: '',             imageMode: 'none'   },
  'hero-simple':  { imageCount: 0, imageProp: '',             imageMode: 'none'   },
  'hero-stylish': { imageCount: 0, imageProp: '',             imageMode: 'none'   },

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
  'features- Image':    { imageCount: 5, imageProp: 'images', imageMode: 'array' },
  'features-coursel':   { imageCount: 5, imageProp: 'images', imageMode: 'array' },
  'features-gallery-type': { imageCount: 5, imageProp: 'images', imageMode: 'array' },
  'features-grid':      { imageCount: 3, imageProp: 'images', imageMode: 'array' },
  'features-Image-new': { imageCount: 1, imageProp: 'images', imageMode: 'array' },
  'features-slideshow': { imageCount: 5, imageProp: 'images', imageMode: 'array' },
  'features-simple-dynamic': {
    imageCount: 3,
    imageProp: 'features',
    imageMode: 'items',
  },

  // ── ABOUT ─────────────────────────────────────────────────────────────
  'about-two-column': { imageCount: 2, imageProp: 'images', imageMode: 'array' },
  'about-simple-dynamic': { imageCount: 2, imageProp: 'heroImage', imageMode: 'single' },
  'about-supersimple-coloured-dynamic': {
    imageCount: 1,
    imageProp: 'imageSrc',
    imageMode: 'single',
  },

  // ── TESTIMONIALS ──────────────────────────────────────────────────────
  'testimonials-elegant-dynamic': { imageCount: 5, imageProp: 'testimonials', imageMode: 'items' },
  'testimonial-cards':    { imageCount: 3, imageProp: 'testimonials', imageMode: 'items' },
  'testimonial-gradient': { imageCount: 3, imageProp: 'testimonials', imageMode: 'items' },
  'testimonial-modern':   { imageCount: 3, imageProp: 'testimonials', imageMode: 'items' },
  'testimonial-section4': { imageCount: 3, imageProp: 'testimonials', imageMode: 'items' },
  'testimonial-section5': { imageCount: 3, imageProp: 'testimonials', imageMode: 'items' },

  // ── NAVBAR ────────────────────────────────────────────────────────────
  'navbar-elegant':  { imageCount: 0, imageProp: '', imageMode: 'none' },
  'navbar-gradient': { imageCount: 0, imageProp: '', imageMode: 'none' },
  'navbar-minimal':  { imageCount: 0, imageProp: '', imageMode: 'none' },
  'navbar-modern':   { imageCount: 0, imageProp: '', imageMode: 'none' },
  'navbar-stylish':  { imageCount: 0, imageProp: '', imageMode: 'none' },
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
  'footer-corporate': { imageCount: 0, imageProp: '', imageMode: 'none' },
  'footer-elegant':   { imageCount: 0, imageProp: '', imageMode: 'none' },
  'footer-gradient':  { imageCount: 0, imageProp: '', imageMode: 'none' },
  'footer-minimal':   { imageCount: 0, imageProp: '', imageMode: 'none' },
  'footer-modern':    { imageCount: 0, imageProp: '', imageMode: 'none' },
  'footer-simple':    { imageCount: 0, imageProp: '', imageMode: 'none' },
  'footer-startup':   { imageCount: 0, imageProp: '', imageMode: 'none' },

  // ── CONTACT ───────────────────────────────────────────────────────────
  'contact-form': { imageCount: 0, imageProp: '', imageMode: 'none' },
  'contact-split-dynamic': { imageCount: 0, imageProp: '', imageMode: 'none' },

  // ── PRICING ───────────────────────────────────────────────────────────
  'pricing-cards':    { imageCount: 0, imageProp: '', imageMode: 'none' },
  'pricing-elegant':  { imageCount: 0, imageProp: '', imageMode: 'none' },
  'pricing-gradient': { imageCount: 0, imageProp: '', imageMode: 'none' },
  'pricing-modern':   { imageCount: 0, imageProp: '', imageMode: 'none' },
  'pricing-simple':   { imageCount: 0, imageProp: '', imageMode: 'none' },
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
