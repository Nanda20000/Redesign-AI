import { HeroSlide } from '../components-library/hero/hero-ab';
import { HeroDynamic } from '../components-library/hero/hero-dynamic';
import { HeroElegantColouredDynamic } from '../components-library/hero/hero-elegant-coloured-dynamic';
import { HeroStylishColouredDynamic } from '../components-library/hero/hero-stylish-coloured-dynamic';
import { FeaturesSlideshow } from '../components-library/features/features-slideshow';
import { FeaturesDynamic } from '../components-library/features/features-dynamic';
import { About3 } from '../components-library/about/about-two-column';
import { AboutDynamic } from '../components-library/about/about-dynamic';
import { TestimonialsCards } from '../components-library/testimonials/testimonial-cards';
import { TestimonialsDynamic } from '../components-library/testimonials/testimonials-dynamic';
import { ContactCard } from '../components-library/contact/contact-form';
import { ContactSplit } from '../components-library/contact/contact-split-dynamic';
import { FooterSimple } from '../components-library/footer/footer-simple';
import NavbarMinimal from '../components-library/navbar/navbar-minimal';
import { NavbarDynamic } from '../components-library/navbar/navbar-dynamic';
import * as fs from 'fs';
import * as path from 'path';

// Main component registry - includes all components (dynamic + fallback-only)
const components = {
  // Dynamic components (AI-selectable)
  "hero-dynamic": HeroDynamic,
  "hero-elegant-coloured-dynamic": HeroElegantColouredDynamic,
  "hero-stylish-coloured-dynamic": HeroStylishColouredDynamic,
  "features-dynamic": FeaturesDynamic,
  "about-dynamic": AboutDynamic,
  "testimonials-dynamic": TestimonialsDynamic,
  "contact-split-dynamic": ContactSplit,
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

export function getComponentByName(name: string) {
  return components[name as keyof typeof components];
}

/**
 * Load dynamic components by section from components.json manifest.
 * Only includes components ending with -dynamic (plus footer-simple exception).
 */
function loadDynamicComponentsBySection(): Record<string, string[]> {
  try {
    const jsonPath = path.join(process.cwd(), 'components-library', 'components.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const result: Record<string, string[]> = {};
    for (const comp of data.components) {
      if (!comp.name.endsWith('-dynamic') && comp.name !== 'footer-simple') continue;
      if (!result[comp.category]) result[comp.category] = [];
      result[comp.category].push(comp.name);
    }
    return result;
  } catch {
    return {};
  }
}

export function getDynamicComponentsBySection(): Record<string, string[]> {
  return loadDynamicComponentsBySection();
}
