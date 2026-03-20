/**
 * Component Selection Rules Engine
 * Uses website analysis to make intelligent component selections
 * with proper constraints and variety enforcement
 */

import {
  WebsiteAnalysis,
  BusinessType,
  Tone,
  ContentRichness,
  getComponentRecommendations,
  ComponentRecommendations
} from './website-analyzer';
import { ComponentsManifest, LayoutItem } from './ai-layout-generator';

export interface ComponentSelectionOptions {
  manifest: ComponentsManifest;
  analysis: WebsiteAnalysis;
  sections: string[];
}

export interface ComponentSelectionResult {
  layout: LayoutItem[];
  selectionReasons: Record<string, string>;
  varietyScore: number;
}

/**
 * Component style categories for variety enforcement
 */
const COMPONENT_STYLES: Record<string, string[]> = {
  minimal: ['minimal', 'simple', 'elegant'],
  modern: ['modern', 'gradient', 'stylish'],
  visual: ['gallery', 'slideshow', 'coursel'],
  structured: ['grid', 'cards', 'two-column'],
  corporate: ['corporate', 'professional']
};

/**
 * Business type to component style mapping
 */
const BUSINESS_STYLE_PREFERENCES: Record<BusinessType, string[]> = {
  education: ['structured', 'minimal'],
  saas: ['modern', 'visual'],
  ecommerce: ['modern', 'visual', 'structured'],
  portfolio: ['visual', 'minimal', 'modern'],
  corporate: ['minimal', 'corporate', 'structured'],
  startup: ['modern', 'visual'],
  agency: ['modern', 'visual', 'minimal'],
  nonprofit: ['minimal', 'structured'],
  restaurant: ['visual', 'modern'],
  healthcare: ['minimal', 'structured', 'corporate'],
  general: ['minimal', 'modern']
};

/**
 * Tone to component style mapping
 */
const TONE_STYLE_PREFERENCES: Record<Tone, string[]> = {
  modern: ['modern'],
  corporate: ['corporate', 'minimal', 'structured'],
  minimal: ['minimal'],
  creative: ['visual', 'modern'],
  professional: ['structured', 'corporate', 'minimal'],
  friendly: ['modern', 'minimal'],
  luxury: ['minimal', 'elegant'],
  playful: ['visual', 'modern']
};

/**
 * Required sections that must always be included
 */
const REQUIRED_SECTIONS = ['hero', 'footer'];

/**
 * Conditional sections based on content/business type
 */
const CONDITIONAL_SECTIONS: Record<string, {
  shouldInclude: (analysis: WebsiteAnalysis, sections: string[]) => boolean;
  reason: string;
}> = {
  features: {
    shouldInclude: (analysis) => analysis.contentRichness !== 'low',
    reason: 'Features section included due to sufficient content'
  },
  testimonials: {
    shouldInclude: (analysis) => {
      const trustHeavyTypes: BusinessType[] = ['saas', 'ecommerce', 'corporate', 'healthcare', 'agency'];
      return trustHeavyTypes.includes(analysis.businessType) || analysis.contentRichness === 'high';
    },
    reason: 'Testimonials included for trust/social proof'
  },
  navbar: {
    shouldInclude: () => true,
    reason: 'Navigation is essential'
  },
  about: {
    shouldInclude: (analysis) => {
      const aboutHeavyTypes: BusinessType[] = ['corporate', 'agency', 'nonprofit', 'education'];
      return aboutHeavyTypes.includes(analysis.businessType);
    },
    reason: 'About section for organization background'
  },
  pricing: {
    shouldInclude: (analysis) => {
      const pricingTypes: BusinessType[] = ['saas', 'ecommerce', 'startup'];
      return pricingTypes.includes(analysis.businessType);
    },
    reason: 'Pricing section for product/service tiers'
  },
  contact: {
    shouldInclude: (analysis) => {
      const contactHeavyTypes: BusinessType[] = ['corporate', 'agency', 'healthcare', 'restaurant'];
      return contactHeavyTypes.includes(analysis.businessType) || analysis.contentRichness === 'high';
    },
    reason: 'Contact section for user communication'
  }
};

/**
 * Get components by category from manifest
 */
function getComponentsByCategory(manifest: ComponentsManifest): Record<string, string[]> {
  const componentsByCategory: Record<string, string[]> = {};

  for (const component of manifest.components) {
    if (!componentsByCategory[component.category]) {
      componentsByCategory[component.category] = [];
    }
    componentsByCategory[component.category].push(component.name);
  }

  return componentsByCategory;
}

/**
 * Get component description from manifest
 */
function getComponentDescription(
  manifest: ComponentsManifest,
  componentName: string
): string {
  const component = manifest.components.find(c => c.name === componentName);
  return component?.description || '';
}

/**
 * Check if component matches a style category
 */
function componentMatchesStyle(componentName: string, style: string): boolean {
  const styleKeywords = COMPONENT_STYLES[style] || [];
  const componentLower = componentName.toLowerCase();
  return styleKeywords.some(keyword => componentLower.includes(keyword));
}

/**
 * Score a component based on analysis
 */
function scoreComponent(
  componentName: string,
  analysis: WebsiteAnalysis,
  recommendations: ComponentRecommendations,
  category: string
): number {
  let score = 0;

  // Check if in preferred list
  const categoryRec = recommendations[category as keyof ComponentRecommendations];
  if (categoryRec) {
    if (categoryRec.preferred.includes(componentName)) {
      score += 10;
    }
    if (categoryRec.avoid.includes(componentName)) {
      score -= 20;
    }
  }

  // Business type style match
  const businessStyles = BUSINESS_STYLE_PREFERENCES[analysis.businessType];
  for (const style of businessStyles) {
    if (componentMatchesStyle(componentName, style)) {
      score += 5;
    }
  }

  // Tone style match
  const toneStyles = TONE_STYLE_PREFERENCES[analysis.tone];
  for (const style of toneStyles) {
    if (componentMatchesStyle(componentName, style)) {
      score += 3;
    }
  }

  // Content richness adjustment
  if (analysis.contentRichness === 'low') {
    // Prefer simpler components
    if (componentMatchesStyle(componentName, 'minimal') || 
        componentMatchesStyle(componentName, 'simple')) {
      score += 5;
    }
    if (componentMatchesStyle(componentName, 'visual') || 
        componentMatchesStyle(componentName, 'modern')) {
      score -= 3;
    }
  } else if (analysis.contentRichness === 'high') {
    // Can handle more complex components
    if (componentMatchesStyle(componentName, 'visual')) {
      score += 3;
    }
  }

  return score;
}

/**
 * Select the best component for a section
 */
function selectBestComponent(
  category: string,
  availableComponents: string[],
  analysis: WebsiteAnalysis,
  recommendations: ComponentRecommendations,
  usedStyles: Set<string>
): { component: string; score: number; reason: string } {
  const scoredComponents = availableComponents.map(name => ({
    name,
    score: scoreComponent(name, analysis, recommendations, category),
    description: ''
  }));

  // Sort by score descending
  scoredComponents.sort((a, b) => b.score - a.score);

  // Variety enforcement: if we've used the same style too much, boost alternatives
  const styleCounts: Record<string, number> = {};
  usedStyles.forEach(style => {
    styleCounts[style] = (styleCounts[style] || 0) + 1;
  });

  // Find most used style
  const maxUsedStyle = Object.entries(styleCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // If one style dominates, boost alternatives
  if (maxUsedStyle && styleCounts[maxUsedStyle] >= 2) {
    for (const comp of scoredComponents) {
      const isAlternativeStyle = !componentMatchesStyle(comp.name, maxUsedStyle);
      if (isAlternativeStyle && comp.score >= scoredComponents[0].score - 3) {
        // Boost alternative styles if score is close
        comp.score += 2;
      }
    }
    // Re-sort after adjustment
    scoredComponents.sort((a, b) => b.score - a.score);
  }

  const selected = scoredComponents[0];

  // Determine the style of selected component
  let selectedStyle = 'standard';
  for (const [style, keywords] of Object.entries(COMPONENT_STYLES)) {
    if (keywords.some(k => selected.name.toLowerCase().includes(k))) {
      selectedStyle = style;
      break;
    }
  }

  // Build reason
  const categoryRec = recommendations[category as keyof ComponentRecommendations];
  const isPreferred = categoryRec?.preferred.includes(selected.name);
  const reason = isPreferred
    ? `Selected based on ${analysis.businessType}/${analysis.tone} preferences`
    : `Good match for ${analysis.tone} tone and ${analysis.contentRichness} content`;

  return {
    component: selected.name,
    score: selected.score,
    reason
  };
}

/**
 * Determine which sections to include based on analysis
 */
function determineSections(
  detectedSections: string[],
  analysis: WebsiteAnalysis
): { section: string; required: boolean; reason: string }[] {
  const sections: { section: string; required: boolean; reason: string }[] = [];
  const processedSections = new Set<string>();

  // Always include required sections if detected or generally needed
  for (const requiredSection of REQUIRED_SECTIONS) {
    if (detectedSections.includes(requiredSection)) {
      sections.push({
        section: requiredSection,
        required: true,
        reason: `${requiredSection} is essential for all websites`
      });
      processedSections.add(requiredSection);
    }
  }

  // Add navbar if detected
  if (detectedSections.includes('navbar')) {
    sections.unshift({
      section: 'navbar',
      required: true,
      reason: 'Navigation provides site structure'
    });
    processedSections.add('navbar');
  }

  // Evaluate conditional sections
  for (const [section, config] of Object.entries(CONDITIONAL_SECTIONS)) {
    if (processedSections.has(section)) continue;
    if (!detectedSections.includes(section)) continue;

    if (config.shouldInclude(analysis, detectedSections)) {
      sections.push({
        section,
        required: false,
        reason: config.reason
      });
      processedSections.add(section);
    }
  }

  // Add any remaining detected sections not covered
  for (const section of detectedSections) {
    if (!processedSections.has(section)) {
      sections.push({
        section,
        required: false,
        reason: 'Detected from source content'
      });
    }
  }

  return sections;
}

/**
 * Main component selection function
 */
export function selectComponents(
  options: ComponentSelectionOptions
): ComponentSelectionResult {
  const { manifest, analysis, sections: detectedSections } = options;

  console.log('[Component Selector] Starting intelligent component selection...');
  console.log('[Component Selector] Analysis:', {
    businessType: analysis.businessType,
    tone: analysis.tone,
    contentRichness: analysis.contentRichness,
    confidence: analysis.confidence
  });

  // Get components by category
  const componentsByCategory = getComponentsByCategory(manifest);

  // Get recommendations based on analysis
  const recommendations = getComponentRecommendations(analysis);

  // Determine which sections to include
  const sectionsToBuild = determineSections(detectedSections, analysis);

  console.log('[Component Selector] Sections to build:', sectionsToBuild);

  // Track used styles for variety enforcement
  const usedStyles = new Set<string>();
  const layout: LayoutItem[] = [];
  const selectionReasons: Record<string, string> = {};

  // Select components for each section
  for (const { section, required, reason } of sectionsToBuild) {
    const category = section; // Section name matches category

    if (!componentsByCategory[category]) {
      console.warn(`[Component Selector] No components found for category: ${category}`);
      continue;
    }

    const availableComponents = componentsByCategory[category];

    // Select best component
    const selection = selectBestComponent(
      category,
      availableComponents,
      analysis,
      recommendations,
      usedStyles
    );

    layout.push({
      section,
      component: selection.component
    });

    selectionReasons[section] = `${selection.reason}. ${reason}`;

    // Track the style used
    for (const [style, keywords] of Object.entries(COMPONENT_STYLES)) {
      if (keywords.some(k => selection.component.toLowerCase().includes(k))) {
        usedStyles.add(style);
        break;
      }
    }

    console.log(`[Component Selector] ${section}: ${selection.component} (${selection.score} pts)`);
  }

  // Calculate variety score (0-100)
  const styleCounts: Record<string, number> = {};
  usedStyles.forEach(style => {
    styleCounts[style] = (styleCounts[style] || 0) + 1;
  });

  const styleDistribution = Object.values(styleCounts);
  const maxStyleCount = Math.max(...styleDistribution, 0);
  const minStyleCount = Math.min(...styleDistribution, 0);
  const varietyScore = styleDistribution.length > 1
    ? Math.round(100 - ((maxStyleCount - minStyleCount) / maxStyleCount) * 100)
    : 50;

  console.log('[Component Selector] Selection complete. Variety score:', varietyScore);
  console.log('[Component Selector] Styles used:', Array.from(usedStyles));

  return {
    layout,
    selectionReasons,
    varietyScore
  };
}

/**
 * Build enhanced prompt with analysis context for AI
 * This provides the AI with intelligent recommendations while letting it make final decisions
 */
export function buildEnhancedPrompt(
  sections: string[],
  componentsByCategory: Record<string, string[]>,
  analysis: WebsiteAnalysis,
  recommendations: ComponentRecommendations
): string {
  const { businessType, tone, contentRichness } = analysis;

  return `You are an expert UI/UX designer and web developer. Your task is to select the best components from a component library to build a website layout.

## Website Analysis Results:
- **Business Type**: ${businessType} (detected from content patterns)
- **Tone**: ${tone} (based on language and style indicators)
- **Content Richness**: ${contentRichness} (based on content volume and complexity)
- **Analysis Confidence**: ${Math.round(analysis.confidence * 100)}%

## Detected Website Sections:
${sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Available Components by Category:
${JSON.stringify(componentsByCategory, null, 2)}

## Intelligent Component Recommendations:
Based on the analysis, here are the recommended component styles:

${Object.entries(recommendations).map(([category, rec]) => `
### ${category.toUpperCase()}
- **Preferred**: ${rec.preferred.join(', ') || 'N/A'}
- **Avoid**: ${rec.avoid.join(', ') || 'N/A'}
- **Reason**: ${rec.reason}
`).join('\n')}

## Component Selection Rules:
1. **HERO section is MANDATORY** - Every website must have a hero section
2. **FOOTER is MANDATORY** - Every website must have a footer
3. **NAVBAR** - Keep it clean and minimal (avoid overly complex navigation)
4. **Variety** - Don't use the same style everywhere (e.g., not all "modern" or all "minimal")
5. **Content Matching** - For low-content sites, prefer simpler components
6. **Business Type Matching**:
   - Education → clean, structured, readable components
   - SaaS → modern, gradient, feature-heavy components
   - Portfolio → visual-heavy, elegant components
   - Corporate → minimal, professional components
   - E-commerce → modern, product-focused components

## Response Format:
Return ONLY a valid JSON object with this exact structure (no additional text, no markdown):
{
  "layout": [
    {"section": "section_name", "component": "component_name"},
    ...
  ]
}

## Rules:
1. Each section must be mapped to exactly one component from the same category
2. Use only component names from the availableComponents list
3. Include all detected sections in your response
4. ALWAYS include hero and footer sections
5. Return ONLY the JSON, no explanations or additional text

Example response:
{
  "layout": [
    {"section": "navbar", "component": "navbar-minimal"},
    {"section": "hero", "component": "hero-modern"},
    {"section": "features", "component": "features-grid"},
    {"section": "testimonials", "component": "testimonial-cards"},
    {"section": "footer", "component": "footer-simple"}
  ]
}`;
}
