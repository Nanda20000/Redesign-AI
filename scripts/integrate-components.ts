#!/usr/bin/env ts-node
/**
 * Simplified Component Integration System
 * 
 * Scans components-library for .tsx files, extracts imports,
 * installs missing packages, and generates component registry.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const COMPONENTS_LIBRARY_DIR = path.join(__dirname, '..', 'components-library');
const REGISTRY_OUTPUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'component-registry.ts');
const COMPONENTS_JSON_PATH = path.join(__dirname, '..', 'components-library', 'components.json');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');

// Known internal UI component paths
const INTERNAL_UI_COMPONENTS = new Set([
  '@/components/ui/accordion',
  '@/components/ui/button',
  '@/components/ui/navigation-menu',
  '@/components/ui/sheet',
  '@/components/ui/card',
  '@/components/ui/input',
  '@/components/ui/label',
  '@/components/ui/tabs',
  '@/components/ui/tooltip',
  '@/components/ui/badge',
  '@/components/ui/switch',
  '@/components/ui/textarea',
  '@/components/ui/icons',
  '@/components/ui/carousel',
  '@/components/ui/avatar',
  '@/components/ui/play-store-button',
  '@/components/ui/app-store-button',
  '@/components/ui/menu-toggle-icon',
  '@/lib/utils',
  '@/hooks/use-media-query',
]);

// Known external packages (already installed or need installation)
const EXTERNAL_PACKAGES = new Map<string, string>([
  ['framer-motion', 'framer-motion'],
  ['lucide-react', 'lucide-react'],
  ['clsx', 'clsx'],
  ['tailwind-merge', 'tailwind-merge'],
  ['class-variance-authority', 'class-variance-authority'],
  ['@radix-ui/react-accordion', '@radix-ui/react-accordion'],
  ['@radix-ui/react-dialog', '@radix-ui/react-dialog'],
  ['@radix-ui/react-label', '@radix-ui/react-label'],
  ['@radix-ui/react-navigation-menu', '@radix-ui/react-navigation-menu'],
  ['@radix-ui/react-slot', '@radix-ui/react-slot'],
  ['@radix-ui/react-switch', '@radix-ui/react-switch'],
  ['@radix-ui/react-tabs', '@radix-ui/react-tabs'],
  ['@radix-ui/react-tooltip', '@radix-ui/react-tooltip'],
  ['@radix-ui/react-icons', '@radix-ui/react-icons'],
  ['@number-flow/react', '@number-flow/react'],
  ['@paper-design/shaders-react', '@paper-design/shaders-react'],
  ['axios', 'axios'],
  ['next', 'next'],
  ['react', 'react'],
  ['react-dom', 'react-dom'],
  ['playwright', 'playwright'],
  ['react-icons', 'react-icons'],
  ['canvas-confetti', 'canvas-confetti'],
  ['motion', 'motion'],
]);

interface ComponentInfo {
  fileName: string;
  category: string;
  componentPath: string;
  exportName: string;
  imports: {
    external: string[];
    internal: string[];
  };
}

/**
 * Extract imports from a TypeScript file
 */
function extractImports(filePath: string): { external: string[]; internal: string[] } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s+(?:{[^}]+}\s+from\s+|[\w]+\s+from\s+)?['"]([^'"]+)['"]/g;
  
  const external: string[] = [];
  const internal: string[] = [];
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip relative imports from components-library
    if (importPath.startsWith('.')) {
      continue;
    }
    
    // Categorize import
    if (importPath.startsWith('@/')) {
      internal.push(importPath);
    } else if (!importPath.startsWith('.')) {
      // External package (get root package name)
      const packageName = importPath.startsWith('@') 
        ? importPath.split('/').slice(0, 2).join('/')
        : importPath.split('/')[0];
      external.push(packageName);
    }
  }
  
  return { 
    external: [...new Set(external)], 
    internal: [...new Set(internal)] 
  };
}

/**
 * Get the main export name from a component file
 */
function getExportName(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Look for named export: export { ComponentName } or export function ComponentName
  const namedExportRegex = /export\s+(?:function|const|class)\s+(\w+)/;
  const exportFromRegex = /export\s+{\s*(\w+)(?:\s+as\s+\w+)?\s*}/;
  
  let match = content.match(namedExportRegex);
  if (match) {
    return match[1];
  }
  
  match = content.match(exportFromRegex);
  if (match) {
    return match[1];
  }
  
  // Default export
  if (content.includes('export default')) {
    return 'default';
  }
  
  // Fallback to filename
  const fileName = path.basename(filePath, '.tsx');
  return fileName.charAt(0).toUpperCase() + fileName.slice(1);
}

/**
 * Scan components-library for all .tsx files
 */
function scanComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  
  if (!fs.existsSync(COMPONENTS_LIBRARY_DIR)) {
    console.error(`[Error] Components library directory not found: ${COMPONENTS_LIBRARY_DIR}`);
    return components;
  }
  
  const categories = fs.readdirSync(COMPONENTS_LIBRARY_DIR);
  
  for (const category of categories) {
    const categoryPath = path.join(COMPONENTS_LIBRARY_DIR, category);
    
    if (!fs.statSync(categoryPath).isDirectory()) {
      continue;
    }
    
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.tsx'));
    
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const fileName = path.basename(file, '.tsx');
      const componentName = `${category}-${fileName}`;
      
      const imports = extractImports(filePath);
      const exportName = getExportName(filePath);
      
      components.push({
        fileName,
        category,
        componentPath: path.join('components-library', category, fileName).replace(/\\/g, '/'),
        exportName,
        imports,
      });
    }
  }
  
  return components;
}

/**
 * Check and install missing npm packages
 */
function installMissingPackages(components: ComponentInfo[]) {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  const installedPackages = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ]);
  
  const allExternalPackages = new Set<string>();
  components.forEach(comp => {
    comp.imports.external.forEach(pkg => allExternalPackages.add(pkg));
  });
  
  const missingPackages: string[] = [];
  
  for (const pkg of allExternalPackages) {
    if (!installedPackages.has(pkg) && EXTERNAL_PACKAGES.has(pkg)) {
      missingPackages.push(pkg);
    }
  }
  
  if (missingPackages.length > 0) {
    console.log('\n[Install] Missing packages detected:');
    missingPackages.forEach(pkg => console.log(`  - ${pkg}`));
    
    console.log('\n[Install] Installing missing packages...');
    try {
      execSync(`npm install ${missingPackages.join(' ')}`, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('[Install] Packages installed successfully!');
    } catch (error: any) {
      console.error('[Error] Failed to install packages:', error.message);
    }
  } else {
    console.log('\n[Check] All required packages are already installed.');
  }
  
  // Log all dependencies
  console.log('\n[Dependencies] Current project dependencies:');
  Object.keys(packageJson.dependencies || {}).forEach(pkg => {
    console.log(`  ✓ ${pkg}@${packageJson.dependencies[pkg]}`);
  });
}

/**
 * Validate imports - check for missing or broken paths
 */
function validateImports(components: ComponentInfo[]) {
  console.log('\n[Validate] Checking imports...');
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (const comp of components) {
    // Check internal imports
    for (const internalImport of comp.imports.internal) {
      if (!INTERNAL_UI_COMPONENTS.has(internalImport)) {
        warnings.push(`[${comp.componentPath}] Unknown internal import: ${internalImport}`);
      }
    }
    
    // Check external imports
    for (const externalImport of comp.imports.external) {
      if (!EXTERNAL_PACKAGES.has(externalImport)) {
        warnings.push(`[${comp.componentPath}] Unknown external package: ${externalImport}`);
      }
    }
  }
  
  if (warnings.length > 0) {
    console.log('\n[Warnings]');
    warnings.forEach(w => console.log(`  ⚠ ${w}`));
  }
  
  if (errors.length > 0) {
    console.log('\n[Errors]');
    errors.forEach(e => console.log(`  ✗ ${e}`));
  }
  
  if (warnings.length === 0 && errors.length === 0) {
    console.log('[Validate] All imports are valid!');
  }
  
  return { errors, warnings };
}

/**
 * Normalize component name: remove duplicate prefixes, spaces, and clean up
 */
function normalizeComponentName(category: string, fileName: string): string {
  // Remove spaces and trim
  let cleaned = fileName.trim();
  
  // Replace multiple spaces/dashes with single dash
  cleaned = cleaned.replace(/[\s_]+/g, '-');
  
  // Convert to lowercase
  cleaned = cleaned.toLowerCase();
  
  // Remove duplicate category prefix
  // Handle cases like: "testimonial-cards" in category "testimonials"
  // The category might be singular or plural
  const singularCategory = category.replace(/s$/, ''); // testimonials -> testimonial
  const pluralCategory = category + (category.endsWith('s') ? '' : 's'); // hero -> heroes
  
  // Pattern to match: category-categoryName or categories-categoryName
  const patterns = [
    `^${category}-`,      // exact match: "hero-hero-" 
    `^${singularCategory}-`, // singular: "testimonial-" in "testimonials" category
    `^${pluralCategory}-`,   // plural: "testimonials-" in "testimonial" category
  ];
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern);
    if (regex.test(cleaned)) {
      // Remove the duplicate prefix and keep only category + rest
      cleaned = cleaned.replace(regex, category + '-');
      break;
    }
  }
  
  // Clean up any double dashes
  cleaned = cleaned.replace(/-+/g, '-');
  
  // Remove trailing dashes
  cleaned = cleaned.replace(/^-+|-+$/g, '');
  
  return cleaned;
}

/**
 * Generate description based on component name and category
 */
function generateDescription(category: string, fileName: string): string {
  const name = fileName.toLowerCase();
  
  // Category-based templates
  const templates: Record<string, string[]> = {
    hero: [
      'A modern hero section with engaging headline and call-to-action',
      'A minimal hero section with clean design and focused messaging',
      'A gradient hero section with animated background effects',
      'An elegant hero section with sophisticated styling',
      'A stylish hero section with contemporary design',
    ],
    navbar: [
      'A modern navigation bar with logo, links, and CTA buttons',
      'A minimal navigation bar with clean and simple design',
      'A gradient navigation bar with colorful styling',
      'An elegant navigation bar with sophisticated layout',
      'A stylish navigation bar with contemporary design',
    ],
    features: [
      'A grid layout for displaying feature cards',
      'A carousel layout for showcasing features',
      'A gallery-style features section with images',
      'A slideshow layout for feature presentation',
      'An image-rich features section',
    ],
    testimonials: [
      'Cards displaying customer testimonials with avatars',
      'A gradient testimonial section with modern styling',
      'A modern testimonial layout with clean design',
      'A testimonial section with multiple layout options',
    ],
    footer: [
      'A simple footer with brand info and social links',
      'A modern footer with comprehensive navigation',
      'A gradient footer with stylish design',
      'A minimal footer with essential information',
      'An elegant footer with sophisticated layout',
      'A corporate footer with business information',
      'A startup-focused footer with app store links',
    ],
    pricing: [
      'Pricing cards with plan details and CTA buttons',
      'A modern pricing section with interactive elements',
      'A gradient pricing section with stylish design',
      'An elegant pricing layout with sophisticated styling',
      'A simple pricing section with clear plans',
    ],
    contact: [
      'A contact form with name, email, and message fields',
      'A modern contact section with multiple contact options',
    ],
    about: [
      'A two-column about section with image and text',
      'A modern about section with company information',
    ],
  };
  
  const categoryTemplates = templates[category] || templates.hero;
  
  // Select template based on name keywords
  let description = categoryTemplates[0];
  
  if (name.includes('modern')) description = categoryTemplates[0];
  else if (name.includes('minimal')) description = categoryTemplates[1] || categoryTemplates[0];
  else if (name.includes('gradient')) description = categoryTemplates[2] || categoryTemplates[0];
  else if (name.includes('elegant')) description = categoryTemplates[3] || categoryTemplates[0];
  else if (name.includes('stylish') || name.includes('stylish')) description = categoryTemplates[4] || categoryTemplates[0];
  else if (name.includes('carousel') || name.includes('coursel')) description = 'A carousel layout for showcasing features';
  else if (name.includes('gallery')) description = 'A gallery-style section with visual content';
  else if (name.includes('grid')) description = 'A grid layout for displaying content cards';
  else if (name.includes('slideshow')) description = 'A slideshow layout for dynamic content presentation';
  else if (name.includes('corporate')) description = 'A corporate section with business-focused design';
  else if (name.includes('startup')) description = 'A startup-focused section with modern elements';
  else if (name.includes('cards')) description = 'Cards layout with clean and organized design';
  else if (name.includes('section')) description = 'A versatile section with flexible layout';
  
  return description;
}

/**
 * Generate components.json file with structured metadata
 */
function generateComponentsJson(components: ComponentInfo[]) {
  console.log('\n[Generate] Creating components.json...');
  
  // Build components array with metadata
  const componentsArray = components.map(comp => {
    const componentName = normalizeComponentName(comp.category, comp.fileName);
    // Use the actual filename from the filesystem
    const actualFileName = comp.fileName + '.tsx';
    
    return {
      name: componentName,
      category: comp.category,
      file: `${comp.category}/${actualFileName}`,
      description: generateDescription(comp.category, comp.fileName),
    };
  });
  
  // Extract unique categories
  const categories = Array.from(new Set(components.map(c => c.category))).sort();
  
  // Build structured JSON
  const structuredData = {
    components: componentsArray,
    categories: categories,
  };
  
  // Write to file
  fs.writeFileSync(
    COMPONENTS_JSON_PATH,
    JSON.stringify(structuredData, null, 2) + '\n',
    'utf-8'
  );
  
  console.log(`[Generate] components.json saved to: ${COMPONENTS_JSON_PATH}`);
  console.log(`[Generate] ${categories.length} categories, ${componentsArray.length} total components`);
  console.log('components.json upgraded to structured metadata system');
}

/**
 * Generate component registry file
 */
function generateRegistry(components: ComponentInfo[]) {
  console.log('\n[Generate] Creating component registry...');

  let imports = '// Auto-generated component registry\n// Run: npm run integrate\n\n';
  imports += 'import type { ComponentType } from "react";\n\n';

  // Generate imports
  components.forEach(comp => {
    const relativePath = `../../${comp.componentPath}`;
    if (comp.exportName === 'default') {
      imports += `import ${comp.fileName.replace(/-/g, '')}Component from '${relativePath}';\n`;
    } else {
      imports += `import { ${comp.exportName} } from '${relativePath}';\n`;
    }
  });

  imports += '\n';

  // Generate registry object with normalized names
  let registry = 'export const componentRegistry: Record<string, ComponentType<any>> = {\n';

  components.forEach(comp => {
    const componentName = normalizeComponentName(comp.category, comp.fileName);
    const importName = comp.exportName === 'default'
      ? `${comp.fileName.replace(/-/g, '')}Component`
      : comp.exportName;
    registry += `  '${componentName}': ${importName},\n`;
  });

  registry += '};\n\n';
  
  // Generate helper functions
  registry += `
/**
 * Get a component by its name from the registry
 */
export function getComponentByName(name: string): ComponentType<any> | null {
  const component = componentRegistry[name];
  if (!component) {
    console.warn(\`[Component Registry] Component "\${name}" not found in registry\`);
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
`;
  
  // Write to file
  fs.writeFileSync(REGISTRY_OUTPUT_PATH, imports + registry, 'utf-8');
  console.log(`[Generate] Registry saved to: ${REGISTRY_OUTPUT_PATH}`);
  console.log(`[Generate] Registered ${components.length} components`);
}

/**
 * Main execution
 */
function main() {
  console.log('='.repeat(60));
  console.log('Component Integration System');
  console.log('='.repeat(60));
  
  // Step 1: Scan components
  console.log('\n[Scan] Scanning components-library...');
  const components = scanComponents();
  console.log(`[Scan] Found ${components.length} components`);
  
  if (components.length === 0) {
    console.log('[Scan] No components found. Exiting.');
    return;
  }
  
  // Step 2: Install missing packages
  installMissingPackages(components);
  
  // Step 3: Validate imports
  validateImports(components);
  
  // Step 4: Generate components.json
  generateComponentsJson(components);
  
  // Step 5: Generate registry
  generateRegistry(components);
  
  console.log('\n' + '='.repeat(60));
  console.log('Integration complete!');
  console.log('='.repeat(60));
}

// Run
main();
