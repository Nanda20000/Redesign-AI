// Auto-generated component registry
// Run: npm run generate:registry to regenerate

import type { ComponentType } from "react";

// About components
import AboutBrandDynamic from '../../components-library/about/about-brand-dynamic';

// Banner components
import BannerHeaderDynamic from '../../components-library/banner/banner-header-dynamic';

// Benefits components
import BenefitsAdvantageDynamic from '../../components-library/benefits/benefits-advantage-dynamic';

// Blog components
import BlogJournalDynamic from '../../components-library/blog/blog-journal-dynamic';

// Company-story components
import CompanyStoryDynamic from '../../components-library/company-story/company-story-dynamic';

// Contact components
import ContactFormDynamic from '../../components-library/contact/contact-form-dynamic';

// Cta components
import CtaBannerDynamic from '../../components-library/cta/cta-banner-dynamic';

// Faq-process components
import FaqGreatDynamic from '../../components-library/faq-process/faq-great-dynamic';

// Feature components
import FeatureAspectDynamic from '../../components-library/feature/feature-aspect-dynamic';

// Footer components
import FooterEtherDynamic from '../../components-library/footer/footer-ether-dynamic';

// Gallery components
import GalleryAlbumDynamic from '../../components-library/gallery/gallery-album-dynamic';

// Hero components
import HeroActionDynamic from '../../components-library/hero/hero-action-dynamic';
import HeroBeamDynamic from '../../components-library/hero/hero-beam-dynamic';
import HeroNewBaseDynamic from '../../components-library/hero/hero-new-base-dynamic';

// Mission-vision components
import MissionBrandDynamic from '../../components-library/mission-vision/mission-brand-dynamic';

// Navbar components
import NavBarDynamic from '../../components-library/navbar/nav-bar-dynamic';
import NavFloatDynamic from '../../components-library/navbar/nav-float-dynamic';
import NavHeaderDynamic from '../../components-library/navbar/nav-header-dynamic';
import NavLinkDynamic from '../../components-library/navbar/nav-link-dynamic';
import NavMenuDynamic from '../../components-library/navbar/nav-menu-dynamic';

// Pricing components
import PricingMatrixDynamic from '../../components-library/pricing/pricing-matrix-dynamic';

// Service-offerings components
import ServiceGridDynamic from '../../components-library/service-offerings/service-grid-dynamic';

// Testimonials components
import TestiClientDynamic from '../../components-library/testimonials/testi-client-dynamic';

// Component registry mapping component names to their implementations
export const componentRegistry: Record<string, ComponentType<any>> = {
  // About components
  'about-brand-dynamic': AboutBrandDynamic,

  // Banner components
  'banner-header-dynamic': BannerHeaderDynamic,

  // Benefits components
  'benefits-advantage-dynamic': BenefitsAdvantageDynamic,

  // Blog components
  'blog-journal-dynamic': BlogJournalDynamic,

  // Company-story components
  'company-story-dynamic': CompanyStoryDynamic,

  // Contact components
  'contact-form-dynamic': ContactFormDynamic,

  // Cta components
  'cta-banner-dynamic': CtaBannerDynamic,

  // Faq-process components
  'faq-great-dynamic': FaqGreatDynamic,

  // Feature components
  'feature-aspect-dynamic': FeatureAspectDynamic,

  // Footer components
  'footer-ether-dynamic': FooterEtherDynamic,

  // Gallery components
  'gallery-album-dynamic': GalleryAlbumDynamic,

  // Hero components
  'hero-action-dynamic': HeroActionDynamic,
  'hero-beam-dynamic': HeroBeamDynamic,
  'hero-new-base-dynamic': HeroNewBaseDynamic,

  // Mission-vision components
  'mission-brand-dynamic': MissionBrandDynamic,

  // Navbar components
  'nav-bar-dynamic': NavBarDynamic,
  'nav-float-dynamic': NavFloatDynamic,
  'nav-header-dynamic': NavHeaderDynamic,
  'nav-link-dynamic': NavLinkDynamic,
  'nav-menu-dynamic': NavMenuDynamic,

  // Pricing components
  'pricing-matrix-dynamic': PricingMatrixDynamic,

  // Service-offerings components
  'service-grid-dynamic': ServiceGridDynamic,

  // Testimonials components
  'testi-client-dynamic': TestiClientDynamic,

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
