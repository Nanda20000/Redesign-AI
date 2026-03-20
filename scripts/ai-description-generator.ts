/**
 * AI Component Description Generator - Smart TSX Analyzer
 * 
 * Analyzes TSX component files to generate unique, meaningful descriptions
 * based on actual structure, layout patterns, and UI elements.
 * 
 * No external API dependencies - pure static analysis.
 */

import * as fs from 'fs';

/**
 * Generate a unique description for a component based on its TSX content
 * 
 * @param componentName - The name of the component (e.g., "hero-modern")
 * @param fileContent - The TSX file content
 * @returns A functional, structural description (1-2 lines)
 */
export async function generateDescription(
  componentName: string,
  fileContent: string
): Promise<string> {
  try {
    const content = fileContent.toLowerCase();

    let parts: string[] = [];

    // Detect layout structure
    if (content.includes("grid")) parts.push("grid layout");
    if (content.includes("flex")) parts.push("flex layout");
    if (content.includes("carousel") || content.includes("slider")) parts.push("carousel/slider");
    if (content.includes("tabs")) parts.push("tab-based navigation");

    // Detect UI elements
    if (content.includes("button")) parts.push("CTA buttons");
    if (content.includes("image") || content.includes("img")) parts.push("image content");
    if (content.includes("video")) parts.push("video support");
    if (content.includes("icon")) parts.push("icons");

    // Detect interaction
    if (content.includes("useState") || content.includes("onClick")) parts.push("interactive elements");
    if (content.includes("animation") || content.includes("motion")) parts.push("animations");

    // Detect sections
    if (componentName.includes("hero")) parts.unshift("hero section");
    if (componentName.includes("navbar")) parts.unshift("navigation bar");
    if (componentName.includes("footer")) parts.unshift("footer section");
    if (componentName.includes("features")) parts.unshift("features section");
    if (componentName.includes("testimonials")) parts.unshift("testimonial section");
    if (componentName.includes("pricing")) parts.unshift("pricing section");

    // Build description
    let description = parts.length > 0
      ? `A ${parts.join(", ")} component`
      : "A reusable UI component";

    // Clean formatting
    description = description.replace(/, ([^,]*)$/, " and $1");

    return description;

  } catch (error) {
    console.warn("Description generation failed, using fallback");
    return "A reusable UI component";
  }
}

/**
 * Generate description from a file path
 *
 * @param filePath - Full path to the TSX file
 * @param fileName - Component file name (without extension)
 * @param category - Component category (folder name)
 * @returns Generated description
 */
export async function generateDescriptionFromFile(
  filePath: string,
  fileName: string,
  category: string
): Promise<string> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return await generateDescription(fileName, content);
  } catch (error) {
    console.warn(`Failed to read component file: ${filePath}`);
    return `${category.charAt(0).toUpperCase() + category.slice(1)} section component`;
  }
}
