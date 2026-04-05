import { FooterSimple } from '../components-library/footer/footer-simple';
import * as fs from 'fs';
import * as path from 'path';

// Main component registry - includes only dynamic components (AI-selectable) plus footer-simple
const components = {
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
