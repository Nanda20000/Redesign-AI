/**
 * Components Metadata System
 * 
 * Provides backward-compatible access to components.json
 * Supports both old format (category: [components]) and new format (structured metadata)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ComponentMetadata {
  name: string;
  category: string;
  file: string;
  description: string;
}

export interface ComponentsData {
  components: ComponentMetadata[];
  categories: string[];
}

/**
 * Load components.json data
 */
function loadComponentsData(): any {
  const componentsJsonPath = path.join(process.cwd(), 'components-library', 'components.json');
  
  try {
    const data = fs.readFileSync(componentsJsonPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[Components] Failed to load components.json:', error);
    return { components: [], categories: [] };
  }
}

/**
 * Transform old format to new structured format
 * Old: { "hero": ["hero-modern", "hero-minimal"] }
 * New: { components: [...], categories: [...] }
 */
function transformOldFormat(data: Record<string, string[]>): ComponentsData {
  const components: ComponentMetadata[] = [];
  const categories: string[] = [];

  for (const [category, componentNames] of Object.entries(data)) {
    if (!categories.includes(category)) {
      categories.push(category);
    }

    for (const name of componentNames) {
      components.push({
        name,
        category,
        file: `${category}/${name.replace(`${category}-`, '')}.tsx`,
        description: generateDescription(category, name),
      });
    }
  }

  return { components, categories };
}

/**
 * Generate description based on component name
 */
function generateDescription(category: string, name: string): string {
  const templates: Record<string, string> = {
    hero: 'A hero section with modern design and call-to-action',
    navbar: 'A navigation bar with links and branding',
    features: 'A features section showcasing product capabilities',
    testimonials: 'Customer testimonials and reviews',
    footer: 'A footer with links and contact information',
    pricing: 'Pricing plans and comparison',
    contact: 'Contact form and information',
    about: 'About section with company information',
  };

  const baseDescription = templates[category] || 'A customizable component section';

  // Add style modifiers
  const modifiers: Record<string, string> = {
    modern: 'with contemporary styling',
    minimal: 'with clean minimal design',
    gradient: 'with gradient background effects',
    elegant: 'with sophisticated elegant styling',
    stylish: 'with stylish modern design',
    grid: 'in grid layout',
    carousel: 'in carousel layout',
    gallery: 'with gallery-style presentation',
    cards: 'using card-based layout',
  };

  for (const [keyword, modifier] of Object.entries(modifiers)) {
    if (name.toLowerCase().includes(keyword)) {
      return `${baseDescription} ${modifier}`;
    }
  }

  return baseDescription;
}

/**
 * Normalize and validate components data
 * Ensures consistent format regardless of source
 */
function normalizeComponentsData(data: any): ComponentsData {
  // Check if already in new format
  if (data.components && Array.isArray(data.components)) {
    return {
      components: data.components.map((c: any) => ({
        name: c.name,
        category: c.category,
        file: c.file,
        description: c.description || generateDescription(c.category, c.name),
      })),
      categories: data.categories || Array.from(new Set(data.components.map((c: any) => c.category))),
    };
  }

  // Old format detected - transform
  console.log('[Components] Detected old format, transforming to new structure...');
  return transformOldFormat(data);
}

// Load and normalize data
const rawData = loadComponentsData();
const normalizedData = normalizeComponentsData(rawData);

// Export normalized data
export const components: ComponentMetadata[] = normalizedData.components;
export const categories: string[] = normalizedData.categories;

/**
 * Get all components
 */
export function getAllComponents(): ComponentMetadata[] {
  return components;
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): ComponentMetadata[] {
  return components.filter(c => c.category === category);
}

/**
 * Get component by name
 */
export function getComponentByName(name: string): ComponentMetadata | null {
  const component = components.find(c => c.name === name);
  if (!component) {
    console.warn(`[Components] Component "${name}" not found`);
    return null;
  }
  return component;
}

/**
 * Get available component names
 */
export function getAvailableComponentNames(): string[] {
  return components.map(c => c.name);
}

/**
 * Get component file path
 */
export function getComponentFile(name: string): string | null {
  const component = getComponentByName(name);
  return component?.file || null;
}

/**
 * Validate component exists
 */
export function componentExists(name: string): boolean {
  return components.some(c => c.name === name);
}

/**
 * Get categories with component count
 */
export function getCategoriesWithCount(): Array<{ category: string; count: number }> {
  return categories.map(category => ({
    category,
    count: components.filter(c => c.category === category).length,
  }));
}
