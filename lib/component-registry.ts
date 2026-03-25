import { HeroSlide } from '@/components-library/hero/hero-ab';
import { HeroDynamic } from '@/components-library/hero/hero-dynamic';
import { FeaturesSlideshow } from '@/components-library/features/features-slideshow';
import { FeaturesDynamic } from '@/components-library/features/features-dynamic';
import { About3 } from '@/components-library/about/about-two-column';
import { AboutDynamic } from '@/components-library/about/about-dynamic';
import { TestimonialsCards } from '@/components-library/testimonials/testimonial-cards';
import { TestimonialsDynamic } from '@/components-library/testimonials/testimonials-dynamic';
import { ContactCard } from '@/components-library/contact/contact-form';
import { FooterSimple } from '@/components-library/footer/footer-simple';
import NavbarMinimal from '@/components-library/navbar/navbar-minimal';

const components = {
  "hero-ab": HeroSlide,
  "hero-dynamic": HeroDynamic,
  "features-slideshow": FeaturesSlideshow,
  "features-dynamic": FeaturesDynamic,
  "about-two-column": About3,
  "about-dynamic": AboutDynamic,
  "testimonial-cards": TestimonialsCards,
  "testimonials-dynamic": TestimonialsDynamic,
  "contact-form": ContactCard,
  "footer-simple": FooterSimple,
  "navbar-minimal": NavbarMinimal
};

export const SAFE_COMPONENTS = {
  hero: ["hero-dynamic", "hero-ab"],
  features: ["features-dynamic", "features-slideshow"],
  about: ["about-dynamic", "about-two-column"],
  testimonials: ["testimonials-dynamic", "testimonial-cards"],
  contact: ["contact-form"],
  footer: ["footer-simple"],
  navbar: ["navbar-minimal"]
};

export function getComponentByName(name: string) {
  return components[name as keyof typeof components];
}
