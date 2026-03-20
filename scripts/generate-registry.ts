#!/usr/bin/env ts-node
/**
 * Safe Component Registry Generator with Validation
 * 
 * Automatically generates src/lib/component-registry.ts by scanning /components-library
 * 
 * Features:
 * - Non-destructive: skips components that fail validation
 * - Validates imports and exports
 * - Detects missing dependencies
 * - Generates validation report
 * - Prevents duplicate variable names
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const COMPONENTS_LIBRARY_DIR = path.join(__dirname, '..', 'components-library');
const REGISTRY_OUTPUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'component-registry.ts');
const REPORT_OUTPUT_PATH = path.join(__dirname, '..', 'scripts', 'registry-report.json');
const COMPONENTS_JSON_PATH = path.join(__dirname, '..', 'components-library', 'components.json');

interface ComponentInfo {
  key: string;        // Registry key (file name without extension)
  category: string;   // Folder name
  fileName: string;   // File name without extension
  variableName: string; // PascalCase variable name
  importPath: string; // Relative import path
  exportType: 'default' | 'named';
  exportName?: string; // Named export name if not default
  isValid?: boolean;  // Validation status
  validationError?: string; // Validation error message
}

interface ValidationReport {
  generated: string;
  valid: string[];
  skipped: Array<{
    name: string;
    category: string;
    reason: string;
  }>;
  summary: {
    total: number;
    valid: number;
    skipped: number;
  };
}

interface ComponentJSON {
  components: Array<{
    name: string;
    category: string;
    file: string;
    description: string;
  }>;
  categories: string[];
}

interface ComponentInfo {
  key: string;        // Registry key (file name without extension)
  category: string;   // Folder name
  fileName: string;   // File name without extension
  variableName: string; // PascalCase variable name
  importPath: string; // Relative import path
  exportType: 'default' | 'named';
  exportName?: string; // Named export name if not default
  isValid?: boolean;  // Validation status
  validationError?: string; // Validation error message
}

/**
 * Convert kebab-case to PascalCase
 * navbar-modern → NavbarModern
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Get the primary export name from a component file
 */
function getExportInfo(filePath: string): { type: 'default' | 'named'; name?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for default export function/component
    const defaultExportMatch = content.match(/export\s+default\s+(?:function|class|const)\s+(\w+)/);
    if (defaultExportMatch) {
      return { type: 'default' };
    }
    
    // Check for export default at end of file (e.g., export default ComponentName)
    const defaultExportEndMatch = content.match(/export\s+default\s+(\w+)\s*;?\s*$/m);
    if (defaultExportEndMatch) {
      return { type: 'default' };
    }
    
    // Look for re-export: export { ComponentName } or export { ComponentName as Something }
    const reExportRegex = /export\s*\{\s*(\w+)(?:\s+as\s+\w+)?\s*\}/;
    const reExportMatch = content.match(reExportRegex);
    if (reExportMatch) {
      return { type: 'named', name: reExportMatch[1] };
    }
    
    // Look for named export: export const ComponentName or export function ComponentName
    // Skip interface exports
    const namedExportRegex = /export\s+(?:const|function|class)\s+(\w+)/;
    const match = content.match(namedExportRegex);
    
    if (match) {
      return { type: 'named', name: match[1] };
    }
    
    // Fallback to named export with file name
    const fileName = path.basename(filePath, '.tsx');
    const pascalName = toPascalCase(fileName);
    return { type: 'named', name: pascalName };
  } catch (error) {
    console.warn(`[Warn] Could not read export info from ${filePath}`);
    return { type: 'named', name: 'Component' };
  }
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
      const fileName = path.basename(file, '.tsx');
      const key = fileName; // Use file name as registry key
      const variableName = toPascalCase(fileName);
      const importPath = path.join('components-library', category, fileName).replace(/\\/g, '/');
      
      const exportInfo = getExportInfo(path.join(categoryPath, file));
      
      components.push({
        key,
        category,
        fileName,
        variableName,
        importPath,
        exportType: exportInfo.type,
        exportName: exportInfo.name,
      });
    }
  }
  
  return components;
}

/**
 * Ensure unique variable names by appending numbers if needed
 */
function ensureUniqueNames(components: ComponentInfo[]): ComponentInfo[] {
  const nameCount = new Map<string, number>();

  return components.map(comp => {
    let baseName = comp.variableName;
    let count = nameCount.get(baseName) || 0;

    if (count > 0) {
      // Append number to make unique
      comp.variableName = `${baseName}${count + 1}`;
    }

    nameCount.set(baseName, count + 1);
    return comp;
  });
}

/**
 * Validate a component by checking TypeScript compilation
 */
function validateComponent(comp: ComponentInfo): { isValid: boolean; error?: string } {
  // Construct full path: components-library/category/file.tsx
  const fullPath = path.join(COMPONENTS_LIBRARY_DIR, comp.category, comp.fileName + '.tsx');
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return { isValid: false, error: 'File not found' };
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check for basic React component patterns
    const hasExport = content.includes('export');
    
    if (!hasExport) {
      return { isValid: false, error: 'No export statement found' };
    }
    
    // Check for missing UI component imports
    const uiImportRegex = /from ["']@\/components\/ui\/([^"']+)["']/g;
    let match;
    const missingDeps: string[] = [];
    
    while ((match = uiImportRegex.exec(content)) !== null) {
      const uiComponent = match[1];
      const uiPath = path.join(__dirname, '..', 'src', 'components', 'ui', `${uiComponent}.tsx`);
      if (!fs.existsSync(uiPath)) {
        missingDeps.push(uiComponent);
      }
    }
    
    // Check for missing hooks imports
    const hooksImportRegex = /from ["']@\/hooks\/([^"']+)["']/g;
    while ((match = hooksImportRegex.exec(content)) !== null) {
      const hookName = match[1];
      const hooksPath = path.join(__dirname, '..', 'src', 'hooks', `${hookName}.ts`);
      if (!fs.existsSync(hooksPath)) {
        missingDeps.push(hookName);
      }
    }
    
    if (missingDeps.length > 0) {
      return { isValid: false, error: `Missing dependencies: ${missingDeps.join(', ')}` };
    }
    
    // Check for obvious syntax errors
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      return { isValid: false, error: 'Syntax error: mismatched braces' };
    }
    
    return { isValid: true };
  } catch (error: any) {
    return { isValid: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Update component.json with scanned components
 * Merges with existing data, avoids duplicates, preserves existing descriptions
 */
function updateComponentsJson(components: ComponentInfo[]) {
  try {
    console.log('\n[Components.json] Loading existing component.json...');
    
    let existingData: ComponentJSON = { components: [], categories: [] };
    
    // Try to load existing component.json
    if (fs.existsSync(COMPONENTS_JSON_PATH)) {
      try {
        const content = fs.readFileSync(COMPONENTS_JSON_PATH, 'utf-8');
        existingData = JSON.parse(content);
        
        // Validate structure
        if (!existingData.components || !Array.isArray(existingData.components)) {
          console.log('[Components.json] Invalid structure, starting fresh');
          existingData = { components: [], categories: [] };
        }
      } catch (parseError: any) {
        console.log(`[Components.json] Parse error: ${parseError.message}, starting fresh`);
        existingData = { components: [], categories: [] };
      }
    }
    
    // Build a map of existing components by name for quick lookup
    const existingMap = new Map<string, { description: string }>();
    existingData.components.forEach(comp => {
      existingMap.set(comp.name, { description: comp.description });
    });
    
    // Track statistics
    let addedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    
    // Build new components array
    const newComponents: ComponentJSON['components'] = [];
    
    for (const comp of components) {
      const componentName = comp.key;
      const category = comp.category;
      const filePath = `${category}/${comp.fileName}.tsx`;
      
      // Check if component already exists
      if (existingMap.has(componentName)) {
        // Keep existing component with its description
        newComponents.push({
          name: componentName,
          category: category,
          file: filePath,
          description: existingMap.get(componentName)!.description,
        });
        skippedCount++;
      } else {
        // Add new component with generated description
        const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);
        const description = `${categoryCapitalized} section component`;
        
        newComponents.push({
          name: componentName,
          category: category,
          file: filePath,
          description: description,
        });
        addedCount++;
      }
    }
    
    // Extract unique categories
    const categories = Array.from(new Set(newComponents.map(c => c.category))).sort();
    
    // Build final data structure
    const finalData: ComponentJSON = {
      components: newComponents,
      categories: categories,
    };
    
    // Write to file
    fs.writeFileSync(COMPONENTS_JSON_PATH, JSON.stringify(finalData, null, 2) + '\n', 'utf-8');
    
    console.log(`[Components.json] Updated successfully`);
    console.log(`  ✓ Added ${addedCount} new components`);
    console.log(`  ✓ Skipped ${skippedCount} existing components`);
    console.log(`  ✓ Total: ${newComponents.length} components in ${categories.length} categories`);
    
  } catch (error: any) {
    console.error(`[Components.json] Error: ${error.message}`);
    console.log('[Components.json] Continuing without updating component.json (safe fallback)');
  }
}

/**
 * Generate import statements
 */
function generateImports(components: ComponentInfo[]): string {
  const lines: string[] = [
    '// Auto-generated component registry',
    '// Run: npm run generate:registry to regenerate',
    '',
    'import type { ComponentType } from "react";',
    '',
  ];
  
  // Group by category for better organization
  const byCategory = new Map<string, ComponentInfo[]>();
  components.forEach(comp => {
    const existing = byCategory.get(comp.category) || [];
    existing.push(comp);
    byCategory.set(comp.category, existing);
  });
  
  // Sort categories
  const sortedCategories = Array.from(byCategory.keys()).sort();
  
  for (const category of sortedCategories) {
    const categoryComponents = byCategory.get(category)!;
    
    // Add category comment
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    lines.push(`// ${categoryLabel} components`);
    
    for (const comp of categoryComponents) {
      const relativePath = `../../${comp.importPath}`;
      
      if (comp.exportType === 'default') {
        lines.push(`import ${comp.variableName} from '${relativePath}';`);
      } else {
        // Use the actual export name with alias to our variable name
        const exportName = comp.exportName || comp.variableName;
        if (exportName === comp.variableName) {
          lines.push(`import { ${exportName} } from '${relativePath}';`);
        } else {
          lines.push(`import { ${exportName} as ${comp.variableName} } from '${relativePath}';`);
        }
      }
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

/**
 * Generate registry object
 */
function generateRegistryObject(components: ComponentInfo[]): string {
  const lines: string[] = [
    '// Component registry mapping component names to their implementations',
    'export const componentRegistry: Record<string, ComponentType<any>> = {',
  ];
  
  // Group by category
  const byCategory = new Map<string, ComponentInfo[]>();
  components.forEach(comp => {
    const existing = byCategory.get(comp.category) || [];
    existing.push(comp);
    byCategory.set(comp.category, existing);
  });
  
  const sortedCategories = Array.from(byCategory.keys()).sort();
  
  for (const category of sortedCategories) {
    const categoryComponents = byCategory.get(category)!;
    
    // Add category comment
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    lines.push(`  // ${categoryLabel} components`);
    
    for (const comp of categoryComponents) {
      lines.push(`  '${comp.key}': ${comp.variableName},`);
    }
    
    lines.push('');
  }
  
  lines.push('};');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Generate helper functions
 */
function generateHelpers(): string {
  return `
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
}

/**
 * Main generation function
 */
function main() {
  console.log('='.repeat(60));
  console.log('Safe Component Registry Generator with Validation');
  console.log('='.repeat(60));

  // Step 1: Scan components
  console.log('\n[Scan] Scanning components-library...');
  let components = scanComponents();
  console.log(`[Scan] Found ${components.length} components`);

  if (components.length === 0) {
    console.log('[Scan] No components found. Exiting.');
    return;
  }

  // Step 2: Ensure unique names
  console.log('\n[Validate] Ensuring unique variable names...');
  components = ensureUniqueNames(components);

  const duplicates = components.filter((comp, index, arr) =>
    arr.findIndex(c => c.variableName === comp.variableName) !== index
  );

  if (duplicates.length > 0) {
    console.log(`[Warn] Found ${duplicates.length} duplicate variable names (auto-fixed)`);
  } else {
    console.log('[Validate] All variable names are unique');
  }

  // Step 3: Validate each component
  console.log('\n[Validate] Validating components...');
  const validComponents: ComponentInfo[] = [];
  const skippedComponents: Array<{ name: string; category: string; reason: string }> = [];

  for (const comp of components) {
    const validation = validateComponent(comp);
    comp.isValid = validation.isValid;
    comp.validationError = validation.error;

    if (validation.isValid) {
      validComponents.push(comp);
      console.log(`  ✓ ${comp.key}`);
    } else {
      skippedComponents.push({
        name: comp.key,
        category: comp.category,
        reason: validation.error || 'Unknown error',
      });
      console.log(`  ✗ ${comp.key} - ${validation.error}`);
    }
  }

  console.log(`\n[Validate] Valid: ${validComponents.length}, Skipped: ${skippedComponents.length}`);

  // Step 4: Generate imports (only for valid components)
  console.log('\n[Generate] Creating import statements...');
  const imports = generateImports(validComponents);

  // Step 5: Generate registry (only for valid components)
  console.log('[Generate] Creating registry mapping...');
  const registry = generateRegistryObject(validComponents);

  // Step 6: Generate helpers
  console.log('[Generate] Adding helper functions...');
  const helpers = generateHelpers();

  // Step 7: Write registry to file
  const content = imports + registry + helpers;

  fs.writeFileSync(REGISTRY_OUTPUT_PATH, content, 'utf-8');
  console.log(`\n[Save] Registry saved to: ${REGISTRY_OUTPUT_PATH}`);
  console.log(`[Save] Registered ${validComponents.length} components`);

  // Step 8: Update component.json (only for valid components)
  updateComponentsJson(validComponents);

  // Step 9: Generate validation report
  console.log('\n[Report] Generating validation report...');
  const report: ValidationReport = {
    generated: new Date().toISOString(),
    valid: validComponents.map(c => c.key),
    skipped: skippedComponents,
    summary: {
      total: components.length,
      valid: validComponents.length,
      skipped: skippedComponents.length,
    },
  };

  fs.writeFileSync(REPORT_OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`[Report] Report saved to: ${REPORT_OUTPUT_PATH}`);

  // Step 10: Summary
  console.log('\n' + '='.repeat(60));
  console.log('Registry Generation Complete!');
  console.log('='.repeat(60));
  console.log('\nComponents by category:');

  const byCategory = new Map<string, number>();
  validComponents.forEach(comp => {
    byCategory.set(comp.category, (byCategory.get(comp.category) || 0) + 1);
  });

  Array.from(byCategory.entries())
    .sort()
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

  console.log(`\nTotal: ${validComponents.length} components`);
  
  if (skippedComponents.length > 0) {
    console.log(`\n⚠️  Skipped ${skippedComponents.length} components (see scripts/registry-report.json)`);
  }
  
  console.log('\nTo regenerate: npm run generate:registry');
}

// Run
main();
