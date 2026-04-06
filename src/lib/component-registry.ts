// Auto-generated component registry
// Run: npm run generate:registry to regenerate

import type { ComponentType } from "react";

// Footer components
import { FooterSimple } from '../../components-library/footer/footer-simple';

// Hero components
import { HeroActionDynamic } from '../../components-library/hero/hero-action-dynamic';

// About components
import { AboutBioDynamic } from '../../components-library/about/about-bio-dynamic';
import { AboutBrandDynamic } from '../../components-library/about/about-brand-dynamic';

// Blog components
import { BlogArticleDynamic } from '../../components-library/blog/blog-article-dynamic';

// Contact components
import { ContactFormDynamic } from '../../components-library/contact/contact-form-dynamic';

// CTA components
import { CtaBannerDynamic } from '../../components-library/cta/cta-banner-dynamic';

// Navbar components
import { NavBarDynamic } from '../../components-library/navbar/nav-bar-dynamic';

// Testimonials components
import { TestiClientDynamic } from '../../components-library/testimonials/testi-client-dynamic';

// Gallery components
import { GalleryAlbumDynamic } from '../../components-library/gallery/gallery-album-dynamic';

// Feature components
import { FeatureAspectDynamic } from '../../components-library/feature/feature-aspect-dynamic';

// Component registry mapping component names to their implementations
export const componentRegistry: Record<string, ComponentType<any>> = {
  // Footer components
  'footer-simple': FooterSimple,

  // Hero components
  'hero-action-dynamic': HeroActionDynamic,

  // About components
  'about-bio-dynamic': AboutBioDynamic,
  'about-brand-dynamic': AboutBrandDynamic,

  // Blog components
  'blog-article-dynamic': BlogArticleDynamic,

  // Contact components
  'contact-form-dynamic': ContactFormDynamic,

  // CTA components
  'cta-banner-dynamic': CtaBannerDynamic,

  // Navbar components
  'nav-bar-dynamic': NavBarDynamic,

  // Testimonials components
  'testi-client-dynamic': TestiClientDynamic,

  // Gallery components
  'gallery-album-dynamic': GalleryAlbumDynamic,

  // Feature components
  'feature-aspect-dynamic': FeatureAspectDynamic,

};

/**
 * Get a component by its name from the registry
 */
export function getComponentByName(name: string): ComponentType<any> | null {
  const component = componentRegistry[name];
  if (!component) {
    console.warn(`[Component Registry] Component "${name}" not found in registry`);
    return null;
  }
  return component;
}

/**
 * Get all available component names
 */
export function getAvailableComponentNames(): string[] {
  return Object.keys(componentRegistry);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): string[] {
  return Object.keys(componentRegistry).filter(name => name.startsWith(category + '-'));
}
