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
import { ComponentsManifest, LayoutItem, ExtractedContent } from './ai-layout-generator';
import { isComponentDynamic } from './component-content-map';

export interface ComponentSelectionOptions {
  manifest: ComponentsManifest;
  analysis: WebsiteAnalysis;
  sections: string[];
  content?: ExtractedContent;
}

export interface ComponentSelectionResult {
  layout: LayoutItem[];
  selectionReasons: Record<string, string>;
  varietyScore: number;
}

/**
 * Component capability map - which components support images
 */
const IMAGE_CAPABLE_COMPONENTS: Record<string, string[]> = {
  hero: ['hero-dynamic', 'hero-simple-dynamic', 'hero-elegant-dynamic', 'hero-banner-dynamic', 'hero-ab', 'hero-ac', 'hero-ad', 'hero-ae'],
  features: ['features-dynamic', 'features-simple-dynamic', 'features-image', 'features-gallery-type', 'features-slideshow', 'features- Image', 'features-Image-new'],
  testimonials: ['testimonials-dynamic', 'testimonials-elegant-dynamic', 'testimonial-cards', 'testimonial-modern', 'testimonial-gradient'],
  about: ['about-dynamic', 'about-simple-dynamic', 'about-two-column'],
  gallery: ['gallery-dynamic', 'gallery-elegant-dynamic'],
  cta: ['cta-dynamic'],
  blog: ['blog-dynamic', 'blog-elegant-dynamic'],
};

/**
 * AI-safe component whitelist - ONLY these components can be selected
 * All components listed here are dynamic (prop-driven) and AI-compatible
 * First item in each category is highest priority
 * STRICT: Only components ending with '-dynamic' are allowed (exception: footer-simple)
 */
const AI_SAFE_COMPONENTS: Record<string, string[]> = {
  hero: ['hero-elegant-dynamic', 'hero-simple-dynamic', 'hero-dynamic', 'hero-banner-dynamic'],
  features: ['features-simple-dynamic', 'features-dynamic'],
  about: ['about-simple-dynamic', 'about-dynamic'],
  testimonials: ['testimonials-elegant-dynamic', 'testimonials-dynamic'],
  contact: ['contact-split-dynamic'],
  footer: ['footer-simple'],  // exception: no footer-dynamic exists yet
  navbar: ['navbar-dynamic'],
  gallery: ['gallery-elegant-dynamic', 'gallery-dynamic'],
  cta: ['cta-simple-dynamic', 'cta-dynamic'],
  blog: ['blog-elegant-dynamic', 'blog-dynamic'],
};

/**
 * Get AI-safe components for a section, with page-specific overrides
 * For non-home pages, force hero-banner-dynamic for hero section
 */
function getAIComponentsForSection(section: string, pageSlug: string): string[] {
  const safeComponents = AI_SAFE_COMPONENTS[section] || [];
  
  // For non-home pages, force hero-banner-dynamic for hero section
  if (section === 'hero' && pageSlug !== 'index') {
    return ['hero-banner-dynamic'];
  }
  
  return safeComponents;
}

/**
 * Check if a component supports images
 */
export function componentSupportsImages(componentName: string, section: string): boolean {
  const capableComponents = IMAGE_CAPABLE_COMPONENTS[section] || [];
  return capableComponents.includes(componentName);
}

/**
 * Component style categories for variety enforcement
 */
const COMPONENT_STYLES: Record<string, string[]> = {
  minimal: ['minimal', 'simple', 'elegant'],
  modern: ['modern', 'gradient', 'stylish'],
  visual: ['gallery', 'slideshow', 'coursel'],
  structured: ['grid', 'cards', 'two-column'],
  corporate: ['corporate', 'professional'],
  dynamic: ['dynamic', 'advanced', 'interactive']
};

/**
 * Business type to component style mapping
 */
const BUSINESS_STYLE_PREFERENCES: Record<BusinessType, string[]> = {
  education: ['structured', 'minimal', 'dynamic'],
  saas: ['modern', 'visual', 'dynamic'],
  ecommerce: ['modern', 'visual', 'structured', 'dynamic'],
  portfolio: ['visual', 'minimal', 'modern'],
  corporate: ['minimal', 'corporate', 'structured', 'dynamic'],
  startup: ['modern', 'visual', 'dynamic'],
  agency: ['modern', 'visual', 'minimal', 'dynamic'],
  nonprofit: ['minimal', 'structured'],
  restaurant: ['visual', 'modern'],
  healthcare: ['minimal', 'structured', 'corporate'],
  general: ['minimal', 'modern', 'dynamic']
};

/**
 * Tone to component style mapping
 */
const TONE_STYLE_PREFERENCES: Record<Tone, string[]> = {
  modern: ['modern', 'dynamic'],
  corporate: ['corporate', 'minimal', 'structured', 'dynamic'],
  minimal: ['minimal'],
  creative: ['visual', 'modern'],
  professional: ['structured', 'corporate', 'minimal', 'dynamic'],
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
  },
  gallery: {
    shouldInclude: (analysis) => {
      const visualTypes: BusinessType[] = ['portfolio', 'agency', 'restaurant', 'ecommerce', 'education'];
      return visualTypes.includes(analysis.businessType);
    },
    reason: 'Gallery section for visual content showcase'
  },
  cta: {
    shouldInclude: (analysis) => {
      return analysis.contentRichness !== 'low';
    },
    reason: 'CTA section to drive conversions'
  },
  blog: {
    shouldInclude: (analysis) => {
      const blogTypes: BusinessType[] = ['education', 'saas', 'agency', 'corporate', 'startup'];
      return blogTypes.includes(analysis.businessType) || analysis.contentRichness === 'high';
    },
    reason: 'Blog section for content and news'
  },
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
  category: string,
  content?: ExtractedContent
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

  // IMAGE-AWARE SCORING: Boost components that support images when images exist
  if (content?.images && content.images.length > 0) {
    if (componentSupportsImages(componentName, category)) {
      score += 15; // Significant boost for image-capable components
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
  usedStyles: Set<string>,
  content?: ExtractedContent
): { component: string; score: number; reason: string } {
  const scoredComponents = availableComponents.map(name => ({
    name,
    score: scoreComponent(name, analysis, recommendations, category, content),
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
 * Check if a component is in the AI-safe whitelist
 */
function isComponentAICompatible(componentName: string, section: string): boolean {
  const safeComponents = AI_SAFE_COMPONENTS[section] || [];
  return safeComponents.includes(componentName);
}

/**
 * Enforce AI-safe component whitelist on layout
 * Always uses the first (highest priority) component for each section
 * For non-home pages, hero section always uses hero-banner-dynamic
 * STRICT: Only components ending with '-dynamic' are allowed (exception: footer-simple)
 */
function enforceAICompatibleComponents(layout: LayoutItem[], pageSlug: string = 'index'): LayoutItem[] {
  const enhancedLayout: LayoutItem[] = [];

  for (const item of layout) {
    const newItem = { ...item };
    const safeComponents = getAIComponentsForSection(item.section, pageSlug);

    if (safeComponents.length > 0) {
      const isSafe = safeComponents.includes(item.component);
      if (!isSafe) {
        newItem.component = safeComponents[0];
      }
    }

    enhancedLayout.push(newItem);
  }

  return enhancedLayout;
}

/**
 * Main component selection function
 */
export function selectComponents(
  options: ComponentSelectionOptions & { pageSlug?: string }
): ComponentSelectionResult {
  const { manifest, analysis, sections: detectedSections, content, pageSlug = 'index' } = options;

  const imageCount = content?.images?.length ?? 0;
  console.log('[Component Selector] Received content:', {
    hasImages: imageCount > 0,
    imageCount: imageCount
  });

  console.log('[Component Selector] Starting intelligent component selection...');
  console.log('[Component Selector] Analysis:', {
    businessType: analysis.businessType,
    tone: analysis.tone,
    contentRichness: analysis.contentRichness,
    confidence: analysis.confidence
  });
  console.log('[Component Selector] Image-aware selection:', {
    hasImages: content?.images && content.images.length > 0,
    imageCount: content?.images?.length || 0
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

    // Select best component (with image awareness)
    const selection = selectBestComponent(
      category,
      availableComponents,
      analysis,
      recommendations,
      usedStyles,
      content
    );

    layout.push({
      section,
      component: selection.component
    });

    const supportsImages = componentSupportsImages(selection.component, section);
    selectionReasons[section] = `${selection.reason}. ${reason}${content?.images && content.images.length > 0 ? ` (Image support: ${supportsImages ? 'YES' : 'NO'})` : ''}`;

    // Track the style used
    for (const [style, keywords] of Object.entries(COMPONENT_STYLES)) {
      if (keywords.some(k => selection.component.toLowerCase().includes(k))) {
        usedStyles.add(style);
        break;
      }
    }

    console.log(`[Component Selector] ${section}: ${selection.component} (${selection.score} pts)${supportsImages && content?.images?.length ? ' [IMAGE-CAPABLE]' : ''}`);
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

  // ENFORCE AI-SAFE COMPONENTS: Replace any non-whitelisted components
  console.log('[Component Selector] Enforcing AI-safe component whitelist...');
  const filteredLayout = enforceAICompatibleComponents(layout, pageSlug);

  return {
    layout: filteredLayout,
    selectionReasons,
    varietyScore
  };
}

/**
 * Build enhanced prompt with analysis context for AI
 * This provides the AI with intelligent recommendations while letting it make final decisions
 * STRICT: Only shows -dynamic components to ensure AI selects dynamic-only components
 */
export function buildEnhancedPrompt(
  sections: string[],
  componentsByCategory: Record<string, string[]>,
  analysis: WebsiteAnalysis,
  recommendations: ComponentRecommendations,
  pageSlug: string = 'index'
): string {
  const { businessType, tone, contentRichness } = analysis;

  // Filter to ONLY dynamic components for the prompt
  const dynamicOnlyByCategory: Record<string, string[]> = {};
  for (const [category, comps] of Object.entries(componentsByCategory)) {
    const dynamic = comps.filter(name => name.endsWith('-dynamic'));
    if (dynamic.length > 0) {
      dynamicOnlyByCategory[category] = dynamic;
    }
  }

  // For non-home pages, hero must only be hero-banner-dynamic
  const isNonHomePage = pageSlug !== 'index';
  if (isNonHomePage && dynamicOnlyByCategory.hero) {
    dynamicOnlyByCategory.hero = ['hero-banner-dynamic'];
  }

  return `You are an expert UI/UX designer. Your job is to select the best dynamic components to rebuild a website.

## STRICT RULE — DYNAMIC COMPONENTS ONLY
You MUST only select components whose name ends with "-dynamic".
Never select components like hero-modern, hero-minimal, navbar-gradient, footer-elegant etc.
Only valid selections end with: -dynamic (e.g. hero-dynamic, features-dynamic, about-dynamic)
${isNonHomePage ? '\n## CRITICAL: NON-HOME PAGE RULE\nThis is NOT the homepage. The hero section MUST use "hero-banner-dynamic" only.\nDo NOT use hero-elegant-dynamic, hero-simple-dynamic, or hero-dynamic for this page.\n' : ''}

## Source Website Analysis:
- Business Type: ${businessType} (confidence: ${Math.round(analysis.confidence * 100)}%)
- Detected Tone: ${tone}
- Content Richness: ${contentRichness}
- Key Business Signals: ${analysis.signals.businessTypeSignals.join(', ')}
- Tone Signals: ${analysis.signals.toneSignals.join(', ')}

## Detected Sections from Source Website:
${sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Available DYNAMIC-ONLY Components (ONLY choose from these):
${JSON.stringify(dynamicOnlyByCategory, null, 2)}

## How to Choose the Best Dynamic Component:
Analyze the source website's detected sections and content:
- If the source hero has a large background image → hero-dynamic (supports image prop)
- If the source has a services/courses grid → features-dynamic (supports items[] with image)
- If the source has an about/history section → about-dynamic (supports stats, companies, image)
- If the source has student/customer reviews → testimonials-dynamic (supports testimonials[])
- If the source has a contact form → contact-split-dynamic
- For navbar → navbar-dynamic (supports full nav items and CTA actions)
- For footer → footer-simple (only option currently)
- For gallery/portfolio showcase → gallery-elegant-dynamic (bento grid layout with hover effects)
- For CTA with statistics → cta-simple-dynamic (split layout with key metrics)
${isNonHomePage ? '- For ALL non-home pages → hero-banner-dynamic (page banner with breadcrumb and title)' : ''}

## Business Type Guidance:
- education/academy → prioritize about-dynamic (show stats like years, students), features-dynamic (courses)
- saas/startup → prioritize features-dynamic (product features), hero-dynamic (strong CTA)
- corporate → prioritize about-dynamic (company info), contact-split-dynamic
- portfolio/agency → prioritize features-dynamic (gallery/work items), hero-dynamic (visual)

## Response Format — Return ONLY this JSON, no markdown, no explanation:
{
  "layout": [
    {"section": "navbar", "component": "navbar-dynamic"},
    {"section": "hero", "component": "${isNonHomePage ? 'hero-banner-dynamic' : 'hero-dynamic'}"},
    {"section": "features", "component": "features-dynamic"},
    {"section": "about", "component": "about-dynamic"},
    {"section": "testimonials", "component": "testimonials-dynamic"},
    {"section": "footer", "component": "footer-simple"}
  ]
}

IMPORTANT: Only include sections that were detected. Always include navbar, hero, and footer.
Every component name you return MUST end with "-dynamic" (exception: footer-simple).
${isNonHomePage ? 'CRITICAL: This is NOT the homepage. Use hero-banner-dynamic for the hero section.' : ''}
`;
}
