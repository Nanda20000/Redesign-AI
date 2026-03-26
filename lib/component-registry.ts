import { HeroSlide } from '@/components-library/hero/hero-ab';
import { HeroDynamic } from '@/components-library/hero/hero-dynamic';
import { FeaturesSlideshow } from '@/components-library/features/features-slideshow';
import { FeaturesDynamic } from '@/components-library/features/features-dynamic';
import { About3 } from '@/components-library/about/about-two-column';
import { AboutDynamic } from '@/components-library/about/about-dynamic';
import { TestimonialsCards } from '@/components-library/testimonials/testimonial-cards';
import { TestimonialsDynamic } from '@/components-library/testimonials/testimonials-dynamic';
import { ContactCard } from '@/components-library/contact/contact-form';
import { ContactSplitDynamic } from '@/components-library/contact/contact-split-dynamic';
import { FooterSimple } from '@/components-library/footer/footer-simple';
import NavbarMinimal from '@/components-library/navbar/navbar-minimal';
import { NavbarDynamic } from '@/components-library/navbar/navbar-dynamic';

// Main component registry - includes all components (dynamic + fallback-only)
const components = {
  // Dynamic components (AI-selectable)
  "hero-dynamic": HeroDynamic,
  "features-dynamic": FeaturesDynamic,
  "about-dynamic": AboutDynamic,
  "testimonials-dynamic": TestimonialsDynamic,
  "contact-split-dynamic": ContactSplitDynamic,
  "navbar-dynamic": NavbarDynamic,
  "footer-simple": FooterSimple,
  
  // Fallback-only components (not AI-selectable, kept for compatibility)
  "hero-ab": HeroSlide,
  "features-slideshow": FeaturesSlideshow,
  "about-two-column": About3,
  "testimonial-cards": TestimonialsCards,
  "contact-form": ContactCard,
  "navbar-minimal": NavbarMinimal
};

// AI-safe component whitelist - ONLY -dynamic components (plus footer-simple exception)
export const SAFE_COMPONENTS = {
  hero: ["hero-dynamic"],
  features: ["features-dynamic"],
  about: ["about-dynamic"],
  testimonials: ["testimonials-dynamic"],
  contact: ["contact-split-dynamic"],
  footer: ["footer-simple"],
  navbar: ["navbar-dynamic"]
};

export function getComponentByName(name: string) {
  return components[name as keyof typeof components];
}
