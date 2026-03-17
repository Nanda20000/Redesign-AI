import componentsData from "@/components-library/components.json";

export interface ComponentMetadata {
  name: string;
  category: string;
  file: string;
  description?: string;
}

export interface ComponentsLibrary {
  components: ComponentMetadata[];
  categories: string[];
}

const componentsLibrary = componentsData as ComponentsLibrary;

/**
 * Get all components from the library
 */
export function getAllComponents(): ComponentMetadata[] {
  return componentsLibrary.components;
}

/**
 * Get components filtered by category
 */
export function getComponentsByCategory(category: string): ComponentMetadata[] {
  return componentsLibrary.components.filter(
    (component) => component.category === category
  );
}

/**
 * Get a single component by name
 */
export function getComponentByName(name: string): ComponentMetadata | undefined {
  return componentsLibrary.components.find(
    (component) => component.name === name
  );
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  return componentsLibrary.categories;
}

/**
 * Get components by multiple categories
 */
export function getComponentsByCategories(
  categories: string[]
): ComponentMetadata[] {
  return componentsLibrary.components.filter((component) =>
    categories.includes(component.category)
  );
}

/**
 * Search components by name or description
 */
export function searchComponents(query: string): ComponentMetadata[] {
  const lowerQuery = query.toLowerCase();
  return componentsLibrary.components.filter(
    (component) =>
      component.name.toLowerCase().includes(lowerQuery) ||
      component.description?.toLowerCase().includes(lowerQuery)
  );
}
