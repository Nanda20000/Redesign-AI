// Dynamic component registry for components-library
// This maps component names to their actual React components

import { Navbar1 } from '../../components-library/navbar/navbar-modern';
import Header from '../../components-library/navbar/navbar-minimal';
import { FloatingNav } from '../../components-library/navbar/navbar-elegant';
import { OceanHero } from '../../components-library/hero/hero-modern';
import { HeroSection } from '../../components-library/hero/hero-minimal';
import WarpShaderHero from '../../components-library/hero/hero-elegant';
import { Feature108 } from '../../components-library/features/features-grid';
import { Testimonials } from '../../components-library/testimonials/testimonial-cards';
import { ContactCard } from '../../components-library/contact/contact-form';
import { Footerdemo } from '../../components-library/footer/footer-simple';
import { About3 } from '../../components-library/about/about-two-column';
import { Component as PricingCards } from '../../components-library/pricing/pricing-cards';

// Component registry mapping component names to their implementations
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  // Navbar components
  'navbar-modern': Navbar1,
  'navbar-minimal': Header,
  'navbar-elegant': FloatingNav,
  
  // Hero components
  'hero-modern': OceanHero,
  'hero-minimal': HeroSection,
  'hero-elegant': WarpShaderHero,
  
  // Features components
  'features-grid': Feature108,
  
  // Testimonials components
  'testimonial-cards': Testimonials,
  
  // Contact components
  'contact-form': ContactCard,
  
  // Footer components
  'footer-simple': Footerdemo,
  
  // About components
  'about-two-column': About3,
  
  // Pricing components
  'pricing-cards': PricingCards,
};

/**
 * Get a component by its name from the registry
 */
export function getComponentByName(name: string): React.ComponentType<any> | null {
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
