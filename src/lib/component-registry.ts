// Auto-generated component registry
// Run: npm run generate:registry to regenerate

import type { ComponentType } from "react";

// About components
import { About3 as AboutTwoColumn } from '../../components-library/about/about-two-column';

// Contact components
import { ContactCard as ContactForm } from '../../components-library/contact/contact-form';

// Features components
import { FeaturesImage } from '../../components-library/features/features- Image';
import { FeaturesCoursel } from '../../components-library/features/features-coursel';
import { FeaturesGalleryType } from '../../components-library/features/features-gallery-type';
import { FeaturesGrid } from '../../components-library/features/features-grid';
import { FeaturesImageNew } from '../../components-library/features/features-Image-new';
import { FeaturesSlideshow } from '../../components-library/features/features-slideshow';

// Footer components
import { FooterCorporate } from '../../components-library/footer/footer-corporate';
import { FooterElegant } from '../../components-library/footer/footer-elegant';
import { FooterGradient } from '../../components-library/footer/footer-gradient';
import { NeoMinimalFooter as FooterMinimal } from '../../components-library/footer/footer-minimal';
import FooterModern from '../../components-library/footer/footer-modern';
import { FooterSimple } from '../../components-library/footer/footer-simple';
import { FooterStartup } from '../../components-library/footer/footer-startup';

// Hero components
import { HeroSlide as HeroAb } from '../../components-library/hero/hero-ab';
import { HeroSection as HeroAc } from '../../components-library/hero/hero-ac';
import HeroAd from '../../components-library/hero/hero-ad';
import { HeroSection as HeroAe } from '../../components-library/hero/hero-ae';
import HeroElegant from '../../components-library/hero/hero-elegant';
import { HeroMinimal } from '../../components-library/hero/hero-minimal';
import { OceanHero as HeroModern } from '../../components-library/hero/hero-modern';
import { HeroSimple } from '../../components-library/hero/hero-simple';
import HeroStylish from '../../components-library/hero/hero-stylish';

// Navbar components
import { FloatingNav as NavbarElegant } from '../../components-library/navbar/navbar-elegant';
import { TruncatingNavbar as NavbarGradient } from '../../components-library/navbar/navbar-gradient';
import NavbarMinimal from '../../components-library/navbar/navbar-minimal';
import { NavbarModern } from '../../components-library/navbar/navbar-modern';
import { NavbarStylish } from '../../components-library/navbar/navbar-stylish';

// Pricing components
import { PricingCards } from '../../components-library/pricing/pricing-cards';
import { PricingElegant } from '../../components-library/pricing/pricing-elegant';
import { PricingGradient } from '../../components-library/pricing/pricing-gradient';
import { PricingModern } from '../../components-library/pricing/pricing-modern';
import { PricingSimple } from '../../components-library/pricing/pricing-simple';

// Testimonials components
import { TestimonialsCards as TestimonialCards } from '../../components-library/testimonials/testimonial-cards';
import { TestimonialsGradient as TestimonialGradient } from '../../components-library/testimonials/testimonial-gradient';
import { TestimonialsModern as TestimonialModern } from '../../components-library/testimonials/testimonial-modern';
import { TestimonialsSection4 as TestimonialSection4 } from '../../components-library/testimonials/testimonial-section4';
import { TestimonialsSection5 as TestimonialSection5 } from '../../components-library/testimonials/testimonial-section5';
// Component registry mapping component names to their implementations
export const componentRegistry: Record<string, ComponentType<any>> = {
  // About components
  'about-two-column': AboutTwoColumn,

  // Contact components
  'contact-form': ContactForm,

  // Features components
  'features- Image': FeaturesImage,
  'features-coursel': FeaturesCoursel,
  'features-gallery-type': FeaturesGalleryType,
  'features-grid': FeaturesGrid,
  'features-Image-new': FeaturesImageNew,
  'features-slideshow': FeaturesSlideshow,

  // Footer components
  'footer-corporate': FooterCorporate,
  'footer-elegant': FooterElegant,
  'footer-gradient': FooterGradient,
  'footer-minimal': FooterMinimal,
  'footer-modern': FooterModern,
  'footer-simple': FooterSimple,
  'footer-startup': FooterStartup,

  // Hero components
  'hero-ab': HeroAb,
  'hero-ac': HeroAc,
  'hero-ad': HeroAd,
  'hero-ae': HeroAe,
  'hero-elegant': HeroElegant,
  'hero-minimal': HeroMinimal,
  'hero-modern': HeroModern,
  'hero-simple': HeroSimple,
  'hero-stylish': HeroStylish,

  // Navbar components
  'navbar-elegant': NavbarElegant,
  'navbar-gradient': NavbarGradient,
  'navbar-minimal': NavbarMinimal,
  'navbar-modern': NavbarModern,
  'navbar-stylish': NavbarStylish,

  // Pricing components
  'pricing-cards': PricingCards,
  'pricing-elegant': PricingElegant,
  'pricing-gradient': PricingGradient,
  'pricing-modern': PricingModern,
  'pricing-simple': PricingSimple,

  // Testimonials components
  'testimonial-cards': TestimonialCards,
  'testimonial-gradient': TestimonialGradient,
  'testimonial-modern': TestimonialModern,
  'testimonial-section4': TestimonialSection4,
  'testimonial-section5': TestimonialSection5,

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
