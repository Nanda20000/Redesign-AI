// Auto-generated component registry
// Run: npm run generate:registry to regenerate

import type { ComponentType } from "react";

// Footer components
import { FooterSimple } from '../../components-library/footer/footer-simple';

// Hero components
import { HeroActionDynamic } from '../../components-library/hero/hero-action-dynamic';
import { HeroActiveDynamic } from '../../components-library/hero/hero-active-dynamic';
import { HeroAdaptDynamic } from '../../components-library/hero/hero-adapt-dynamic';
import { HeroAlphaDynamic } from '../../components-library/hero/hero-alpha-dynamic';
import { HeroAnchorDynamic } from '../../components-library/hero/hero-anchor-dynamic';
import { HeroApexDynamic } from '../../components-library/hero/hero-apex-dynamic';
import { HeroAspectDynamic } from '../../components-library/hero/hero-aspect-dynamic';
import { HeroAtlasDynamic } from '../../components-library/hero/hero-atlas-dynamic';

// About components
import { AboutBioDynamic } from '../../components-library/about/about-bio-dynamic';
import { AboutBrandDynamic } from '../../components-library/about/about-brand-dynamic';
import { AboutBriefDynamic } from '../../components-library/about/about-brief-dynamic';
import { AboutCardDynamic } from '../../components-library/about/about-card-dynamic';
import { AboutCrewDynamic } from '../../components-library/about/about-crew-dynamic';

// Blog components
import { BlogArticleDynamic } from '../../components-library/blog/blog-article-dynamic';
import { BlogFeedDynamic } from '../../components-library/blog/blog-feed-dynamic';
import { BlogGridDynamic } from '../../components-library/blog/blog-grid-dynamic';

// Contact components
import { ContactFormDynamic } from '../../components-library/contact/contact-form-dynamic';
import { ContactHelpDynamic } from '../../components-library/contact/contact-help-dynamic';
import { ContactInboxDynamic } from '../../components-library/contact/contact-inbox-dynamic';
import { ContactLeadDynamic } from '../../components-library/contact/contact-lead-dynamic';
import { ContactLinkDynamic } from '../../components-library/contact/contact-link-dynamic';
import { ContactMailDynamic } from '../../components-library/contact/contact-mail-dynamic';

// CTA components
import { CtaBannerDynamic } from '../../components-library/cta/cta-banner-dynamic';

// Navbar components
import { NavBarDynamic } from '../../components-library/navbar/nav-bar-dynamic';
import { NavFloatDynamic } from '../../components-library/navbar/nav-float-dynamic';

// Testimonials components
import { TestiClientDynamic } from '../../components-library/testimonials/testi-client-dynamic';

// Gallery components
import { GalleryAlbumDynamic } from '../../components-library/gallery/gallery-album-dynamic';

// Company Story components
import { StoryArchiveDynamic } from '../../components-library/company-story/story-archive-dynamic';

// Feature components
import { FeatureAspectDynamic } from '../../components-library/feature/feature-aspect-dynamic';
import { FeatureDetailDynamic } from '../../components-library/feature/feature-detail-dynamic';
import { FeatureFacetDynamic } from '../../components-library/feature/feature-facet-dynamic';
import { FeatureFocusDynamic } from '../../components-library/feature/feature-focus-dynamic';
import { FeatureItemDynamic } from '../../components-library/feature/feature-item-dynamic';
import { FeatureListDynamic } from '../../components-library/feature/feature-list-dynamic';

// Benefits components
import { BenefitsAdvantageDynamic } from '../../components-library/benefits/benefits-advantage-dynamic';
import { BenefitsAssetDynamic } from '../../components-library/benefits/benefits-asset-dynamic';

// Component registry mapping component names to their implementations
export const componentRegistry: Record<string, ComponentType<any>> = {
  // Footer components
  'footer-simple': FooterSimple,

  // Hero components
  'hero-action-dynamic': HeroActionDynamic,
  'hero-active-dynamic': HeroActiveDynamic,
  'hero-adapt-dynamic': HeroAdaptDynamic,
  'hero-alpha-dynamic': HeroAlphaDynamic,
  'hero-anchor-dynamic': HeroAnchorDynamic,
  'hero-apex-dynamic': HeroApexDynamic,
  'hero-aspect-dynamic': HeroAspectDynamic,
  'hero-atlas-dynamic': HeroAtlasDynamic,

  // About components
  'about-bio-dynamic': AboutBioDynamic,
  'about-brand-dynamic': AboutBrandDynamic,
  'about-brief-dynamic': AboutBriefDynamic,
  'about-card-dynamic': AboutCardDynamic,
  'about-crew-dynamic': AboutCrewDynamic,

  // Blog components
  'blog-article-dynamic': BlogArticleDynamic,
  'blog-feed-dynamic': BlogFeedDynamic,
  'blog-grid-dynamic': BlogGridDynamic,

  // Contact components
  'contact-form-dynamic': ContactFormDynamic,
  'contact-help-dynamic': ContactHelpDynamic,
  'contact-inbox-dynamic': ContactInboxDynamic,
  'contact-lead-dynamic': ContactLeadDynamic,
  'contact-link-dynamic': ContactLinkDynamic,
  'contact-mail-dynamic': ContactMailDynamic,

  // CTA components
  'cta-banner-dynamic': CtaBannerDynamic,

  // Navbar components
  'nav-bar-dynamic': NavBarDynamic,
  'nav-float-dynamic': NavFloatDynamic,

  // Testimonials components
  'testi-client-dynamic': TestiClientDynamic,

  // Gallery components
  'gallery-album-dynamic': GalleryAlbumDynamic,

  // Company Story components
  'story-archive-dynamic': StoryArchiveDynamic,

  // Feature components
  'feature-aspect-dynamic': FeatureAspectDynamic,
  'feature-detail-dynamic': FeatureDetailDynamic,
  'feature-facet-dynamic': FeatureFacetDynamic,
  'feature-focus-dynamic': FeatureFocusDynamic,
  'feature-item-dynamic': FeatureItemDynamic,
  'feature-list-dynamic': FeatureListDynamic,

  // Benefits components
  'benefits-advantage-dynamic': BenefitsAdvantageDynamic,
  'benefits-asset-dynamic': BenefitsAssetDynamic,

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
