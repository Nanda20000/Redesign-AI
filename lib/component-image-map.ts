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

  'hero-active-dynamic': {
    imageCount: 5,
    imageProp: 'expertAvatars',
    imageMode: 'array',
  },

  'hero-adapt-dynamic': {
    imageCount: 4,
    imageProp: 'images',
    imageMode: 'object',
  },

  'hero-alpha-dynamic': {
    imageCount: 1,
    imageProp: 'image',
    imageMode: 'single',
  },

  'hero-anchor-dynamic': {
    imageCount: 1,
    imageProp: 'image',
    imageMode: 'single',
  },

  'hero-apex-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  'hero-aspect-dynamic': {
    imageCount: 1,
    imageProp: 'videoThumbnail',
    imageMode: 'single',
  },

  'hero-atlas-dynamic': {
    imageCount: 4,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  // ── BLOG ──────────────────────────────────────────────────────────────
  'blog-article-dynamic': {
    imageCount: 6,
    imageProp: 'posts',
    imageMode: 'items',
  },

  'blog-feed-dynamic': {
    imageCount: 4,
    imageProp: 'posts.image',
    imageMode: 'items',
  },

  'blog-grid-dynamic': {
    imageCount: 6,
    imageProp: 'items',
    imageMode: 'items',
  },

  // ── ABOUT ─────────────────────────────────────────────────────────────
  'about-crew-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  'about-card-dynamic': {
    imageCount: 2,
    imageProp: 'image',
    imageMode: 'array',
  },

  'about-bio-dynamic': {
    imageCount: 1,
    imageProp: 'storyImage',
    imageMode: 'single',
  },

  'about-brand-dynamic': {
    imageCount: 1,
    imageProp: 'image',
    imageMode: 'single',
  },

  'about-brief-dynamic': {
    imageCount: 1,
    imageProp: 'image',
    imageMode: 'single',
  },

  // ── COMPANY-STORY ─────────────────────────────────────────────────────
  'story-archive-dynamic': {
    imageCount: 1,
    imageProp: 'mainImage',
    imageMode: 'single',
  },

  // ── FOOTER ────────────────────────────────────────────────────────────
  'footer-simple': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'footer-glow-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'footer-halo-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'footer-prism-dynamic': {
    imageCount: 1,
    imageProp: 'logoImgSrc',
    imageMode: 'single',
  },

  'footer-ether-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  'footer-lume-dynamic': {
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

  'contact-help-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'contact-inbox-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'contact-lead-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'contact-link-dynamic': {
    imageCount: 1,
    imageProp: 'imageUrl',
    imageMode: 'single',
  },

  'contact-mail-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'contact-office-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'contact-reach-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImageUrl',
    imageMode: 'single',
  },

  'contact-support-dynamic': {
    imageCount: 5,
    imageProp: 'images',
    imageMode: 'array',
  },

  // ── CTA ─────────────────────────────────────────────────────────────
  'cta-banner-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  'cta-button-dynamic': {
    imageCount: 1,
    imageProp: 'imageSrc',
    imageMode: 'single',
  },

  'cta-click-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'cta-convert-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'cta-drive-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'cta-goal-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
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
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'nav-panel-dynamic': {
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

  'testi-critique-dynamic': {
    imageCount: 3,
    imageProp: 'authorAvatar',
    imageMode: 'items',
  },

  'testi-feedback-dynamic': {
    imageCount: 4,
    imageProp: 'authorAvatarUrl',
    imageMode: 'items',
  },

  'testi-honor-dynamic': {
    imageCount: 1,
    imageProp: 'items.authorAvatar',
    imageMode: 'items',
  },

  'testi-praise-dynamic': {
    imageCount: 1,
    imageProp: 'items',
    imageMode: 'items',
  },

  'testi-quote-dynamic': {
    imageCount: 2,
    imageProp: 'testimonialImageUrl',
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

  'feature-detail-dynamic': {
    imageCount: 9,
    imageProp: 'items',
    imageMode: 'items',
  },

  'feature-facet-dynamic': {
    imageCount: 1,
    imageProp: 'imageSrc',
    imageMode: 'single',
  },

  'feature-focus-dynamic': {
    imageCount: 1,
    imageProp: 'imageSrc',
    imageMode: 'single',
  },

  'feature-item-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
  },

  'feature-list-dynamic': {
    imageCount: 1,
    imageProp: 'backgroundImage',
    imageMode: 'single',
  },

  // ── BENEFITS ─────────────────────────────────────────────────────────
  'benefits-advantage-dynamic': {
    imageCount: 2,
    imageProp: 'images',
    imageMode: 'array',
  },

  'benefits-asset-dynamic': {
    imageCount: 0,
    imageProp: '',
    imageMode: 'none',
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
