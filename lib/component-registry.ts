import { HeroSlide } from '@/components-library/hero/hero-ab';
import { FeaturesSlideshow } from '@/components-library/features/features-slideshow';
import { About3 } from '@/components-library/about/about-two-column';
import { TestimonialsCards } from '@/components-library/testimonials/testimonial-cards';
import { ContactCard } from '@/components-library/contact/contact-form';
import { FooterSimple } from '@/components-library/footer/footer-simple';
import NavbarMinimal from '@/components-library/navbar/navbar-minimal';

const components = {
  "hero-ab": HeroSlide,
  "features-slideshow": FeaturesSlideshow,
  "about-two-column": About3,
  "testimonial-cards": TestimonialsCards,
  "contact-form": ContactCard,
  "footer-simple": FooterSimple,
  "navbar-minimal": NavbarMinimal
};

export const SAFE_COMPONENTS = {
  hero: ["hero-ab"],
  features: ["features-slideshow"],
  about: ["about-two-column"],
  testimonials: ["testimonial-cards"],
  contact: ["contact-form"],
  footer: ["footer-simple"],
  navbar: ["navbar-minimal"]
};

export function getComponentByName(name: string) {
  return components[name as keyof typeof components];
}
