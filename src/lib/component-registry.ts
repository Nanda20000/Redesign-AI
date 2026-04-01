// Auto-generated component registry
// Run: npm run generate:registry to regenerate

import type { ComponentType } from "react";

// About components
import { AboutSimpleDynamic } from '../../components-library/about/about-simple-dynamic';
import { AboutDynamic } from '../../components-library/about/about-dynamic';
import { AboutSupersimpleColouredDynamic } from '../../components-library/about/about-supersimple-coloured-dynamic';

// Blog components
import { BlogDynamic } from '../../components-library/blog/blog-dynamic';
import { BlogElegantDynamic } from '../../components-library/blog/blog-elegant-dynamic';

// CTA components
import { CtaDynamic } from '../../components-library/cta/cta-dynamic';
import { CtaSimpleDynamic } from '../../components-library/cta/cta-simple-dynamic';

// Contact components
import { ContactSplit as ContactSplitDynamic } from '../../components-library/contact/contact-split-dynamic';

// Features components
import { FeaturesDynamic } from '../../components-library/features/features-dynamic';
import { FeaturesSimpleDynamic } from '../../components-library/features/features-simple-dynamic';

// Footer components
import { FooterSimple } from '../../components-library/footer/footer-simple';

// Gallery components
import { GalleryDynamic } from '../../components-library/gallery/gallery-dynamic';
import { GalleryElegantDynamic } from '../../components-library/gallery/gallery-elegant-dynamic';

// Hero components
import { HeroDynamic } from '../../components-library/hero/hero-dynamic';
import { HeroSimpleDynamic } from '../../components-library/hero/hero-simple-dynamic';
import { HeroElegantDynamic } from '../../components-library/hero/hero-elegant-dynamic';
import { HeroBannerDynamic } from '../../components-library/hero/hero-banner-dynamic';
import { HeroStylishColouredDynamic } from '../../components-library/hero/hero-stylish-coloured-dynamic';
import { HeroSuperColouredDynamic } from '../../components-library/hero/hero-super-coloured-dynamic';
import { HeroSupersimpleColouredDynamic } from '../../components-library/hero/hero-supersimple-coloured-dynamic';

// Navbar components
import { NavbarDynamic } from '../../components-library/navbar/navbar-dynamic';
import { NavbarFloatingDynamic } from '../../components-library/navbar/navbar-floating-dynamic';
import { NavbarFloatingtwoDynamic } from '../../components-library/navbar/navbar-floatingtwo-dynamic';

// Testimonials components
import { TestimonialsDynamic } from '../../components-library/testimonials/testimonials-dynamic';
import { TestimonialsElegantDynamic } from '../../components-library/testimonials/testimonials-elegant-dynamic';

// Component registry mapping component names to their implementations
export const componentRegistry: Record<string, ComponentType<any>> = {
  // About components
  'about-simple-dynamic': AboutSimpleDynamic,
  'about-dynamic': AboutDynamic,
  'about-supersimple-coloured-dynamic': AboutSupersimpleColouredDynamic,

  // Blog components
  'blog-dynamic': BlogDynamic,
  'blog-elegant-dynamic': BlogElegantDynamic,

  // CTA components
  'cta-dynamic': CtaDynamic,
  'cta-simple-dynamic': CtaSimpleDynamic,

  // Contact components
  'contact-split-dynamic': ContactSplitDynamic,

  // Features components
  'features-dynamic': FeaturesDynamic,
  'features-simple-dynamic': FeaturesSimpleDynamic,

  // Footer components
  'footer-simple': FooterSimple,

  // Gallery components
  'gallery-dynamic': GalleryDynamic,
  'gallery-elegant-dynamic': GalleryElegantDynamic,

  // Hero components
  'hero-dynamic': HeroDynamic,
  'hero-simple-dynamic': HeroSimpleDynamic,
  'hero-elegant-dynamic': HeroElegantDynamic,
  'hero-banner-dynamic': HeroBannerDynamic,
  'hero-stylish-coloured-dynamic': HeroStylishColouredDynamic,
  'hero-super-coloured-dynamic': HeroSuperColouredDynamic,
  'hero-supersimple-coloured-dynamic': HeroSupersimpleColouredDynamic,

  // Navbar components
  'navbar-dynamic': NavbarDynamic,
  'navbar-floating-dynamic': NavbarFloatingDynamic,
  'navbar-floatingtwo-dynamic': NavbarFloatingtwoDynamic,

  // Testimonials components
  'testimonials-dynamic': TestimonialsDynamic,
  'testimonials-elegant-dynamic': TestimonialsElegantDynamic,

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
