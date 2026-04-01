import { HeroDynamic } from '../components-library/hero/hero-dynamic';
import { HeroStylishColouredDynamic } from '../components-library/hero/hero-stylish-coloured-dynamic';
import { HeroSuperColouredDynamic } from '../components-library/hero/hero-super-coloured-dynamic';
import { HeroSupersimpleColouredDynamic } from '../components-library/hero/hero-supersimple-coloured-dynamic';
import { HeroBannerDynamic } from '../components-library/hero/hero-banner-dynamic';
import { HeroSimpleDynamic } from '../components-library/hero/hero-simple-dynamic';
import { HeroElegantDynamic } from '../components-library/hero/hero-elegant-dynamic';
import { FeaturesDynamic } from '../components-library/features/features-dynamic';
import { FeaturesSimpleDynamic } from '../components-library/features/features-simple-dynamic';
import { AboutDynamic } from '../components-library/about/about-dynamic';
import { AboutSimpleDynamic } from '../components-library/about/about-simple-dynamic';
import { AboutSupersimpleColouredDynamic } from '../components-library/about/about-supersimple-coloured-dynamic';
import { TestimonialsDynamic } from '../components-library/testimonials/testimonials-dynamic';
import { TestimonialsElegantDynamic } from '../components-library/testimonials/testimonials-elegant-dynamic';
import { ContactSplit } from '../components-library/contact/contact-split-dynamic';
import { FooterSimple } from '../components-library/footer/footer-simple';
import { NavbarDynamic } from '../components-library/navbar/navbar-dynamic';
import { NavbarFloatingDynamic } from '../components-library/navbar/navbar-floating-dynamic';
import { NavbarFloatingtwoDynamic } from '../components-library/navbar/navbar-floatingtwo-dynamic';
import { BlogDynamic } from '../components-library/blog/blog-dynamic';
import { BlogElegantDynamic } from '../components-library/blog/blog-elegant-dynamic';
import { CtaDynamic } from '../components-library/cta/cta-dynamic';
import { CtaSimpleDynamic } from '../components-library/cta/cta-simple-dynamic';
import { GalleryDynamic } from '../components-library/gallery/gallery-dynamic';
import { GalleryElegantDynamic } from '../components-library/gallery/gallery-elegant-dynamic';
import * as fs from 'fs';
import * as path from 'path';

// Main component registry - includes only dynamic components (AI-selectable) plus footer-simple
const components = {
  // Dynamic components (AI-selectable)
  "hero-dynamic": HeroDynamic,
  "hero-stylish-coloured-dynamic": HeroStylishColouredDynamic,
  "hero-super-coloured-dynamic": HeroSuperColouredDynamic,
  "hero-supersimple-coloured-dynamic": HeroSupersimpleColouredDynamic,
  "hero-banner-dynamic": HeroBannerDynamic,
  "hero-simple-dynamic": HeroSimpleDynamic,
  "hero-elegant-dynamic": HeroElegantDynamic,
  "features-dynamic": FeaturesDynamic,
  "features-simple-dynamic": FeaturesSimpleDynamic,
  "about-dynamic": AboutDynamic,
  "about-simple-dynamic": AboutSimpleDynamic,
  "about-supersimple-coloured-dynamic": AboutSupersimpleColouredDynamic,
  "testimonials-dynamic": TestimonialsDynamic,
  "testimonials-elegant-dynamic": TestimonialsElegantDynamic,
  "contact-split-dynamic": ContactSplit,
  "navbar-dynamic": NavbarDynamic,
  "navbar-floating-dynamic": NavbarFloatingDynamic,
  "navbar-floatingtwo-dynamic": NavbarFloatingtwoDynamic,
  "blog-dynamic": BlogDynamic,
  "blog-elegant-dynamic": BlogElegantDynamic,
  "cta-dynamic": CtaDynamic,
  "cta-simple-dynamic": CtaSimpleDynamic,
  "gallery-dynamic": GalleryDynamic,
  "gallery-elegant-dynamic": GalleryElegantDynamic,
  "footer-simple": FooterSimple,
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
