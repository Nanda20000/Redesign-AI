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
import { COMPONENT_META } from './component-meta';

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
  hero: ['hero-atlas-dynamic', 'hero-aspect-dynamic', 'hero-apex-dynamic', 'hero-anchor-dynamic', 'hero-alpha-dynamic', 'hero-adapt-dynamic', 'hero-active-dynamic', 'hero-action-dynamic'],
  about: ['about-crew-dynamic', 'about-card-dynamic', 'about-brief-dynamic', 'about-brand-dynamic', 'about-bio-dynamic'],
  blog: ['blog-grid-dynamic', 'blog-feed-dynamic', 'blog-article-dynamic'],
  'company-story': ['story-archive-dynamic'],
  cta: ['cta-banner-dynamic'],
  testimonials: ['testi-client-dynamic'],
  gallery: ['gallery-album-dynamic'],
  feature: ['feature-list-dynamic', 'feature-focus-dynamic', 'feature-facet-dynamic', 'feature-detail-dynamic', 'feature-aspect-dynamic'],
  benefits: ['benefits-advantage-dynamic'],
};

function isSelectableAIComponent(componentName: string): boolean {
  return componentName.endsWith('-dynamic') || componentName === 'footer-simple';
}

/**
 * Get AI-selectable components for a section using the manifest instead of a hardcoded whitelist.
 * Only returns kept components: hero-action-dynamic, about-bio-dynamic, blog-article-dynamic, story-archive-dynamic, footer-simple.
 */
function getAIComponentsForSection(
  section: string,
  availableComponents: string[],
  pageSlug: string
): string[] {
  return availableComponents.filter(isSelectableAIComponent);
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
 * All sections for homepage - always included in fixed order
 */
const HOMEPAGE_SECTIONS = [
  'navbar',
  'hero',
  'about',
  'features',
  'blog',
  'company-story',
  'gallery',
  'testimonials',
  'cta',
  'contact',
  'faq-process',
  'footer'
];

/**
 * Conditional sections based on content/business type
 */
const CONDITIONAL_SECTIONS: Record<string, {
  shouldInclude: (analysis: WebsiteAnalysis, sections: string[]) => boolean;
  reason: string;
}> = {
  about: {
    shouldInclude: (analysis) => {
      const aboutHeavyTypes: BusinessType[] = ['corporate', 'agency', 'nonprofit', 'education'];
      return aboutHeavyTypes.includes(analysis.businessType);
    },
    reason: 'About section for organization background'
  },
  blog: {
    shouldInclude: (analysis) => {
      const blogTypes: BusinessType[] = ['education', 'saas', 'agency', 'corporate', 'startup'];
      return blogTypes.includes(analysis.businessType) || analysis.contentRichness === 'high';
    },
    reason: 'Blog section for content and news'
  },
  'company-story': {
    shouldInclude: (analysis) => {
      const storyHeavyTypes: BusinessType[] = ['corporate', 'education', 'agency', 'portfolio'];
      return storyHeavyTypes.includes(analysis.businessType) || analysis.contentRichness === 'high';
    },
    reason: 'Company story/history for brand heritage'
  },
  'faq-process': {
    shouldInclude: (analysis) => {
      const faqHeavyTypes: BusinessType[] = ['saas', 'education', 'ecommerce', 'healthcare'];
      return faqHeavyTypes.includes(analysis.businessType) || analysis.contentRichness !== 'low';
    },
    reason: 'FAQ/Process to address questions and explain workflows'
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
  const meta = COMPONENT_META[componentName as keyof typeof COMPONENT_META];

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

  // Metadata-driven scoring so newly registered components can influence selection
  if (meta) {
    score += meta.priority;

    if (analysis.contentRichness === 'high') {
      if (meta.contentLevel === 'high') score += 6;
      if (meta.contentLevel === 'medium') score += 2;
    } else if (analysis.contentRichness === 'low') {
      if (meta.contentLevel === 'low') score += 4;
      if (meta.contentLevel === 'high') score -= 3;
    }

    if (content?.images && content.images.length > 0 && meta.supportsImages) {
      score += 5;
    }

    if (meta.supportsItems && analysis.contentRichness !== 'low') {
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
 * Uses random selection from valid candidates for variety across regenerations
 */
function selectBestComponent(
  category: string,
  availableComponents: string[],
  analysis: WebsiteAnalysis,
  recommendations: ComponentRecommendations,
  usedStyles: Set<string>,
  content?: ExtractedContent
): { component: string; score: number; reason: string } {
  let candidates = availableComponents.filter(isSelectableAIComponent);
  
  if (candidates.length === 0) {
    candidates = availableComponents;
  }

  // If images exist, prefer image-capable components but don't restrict entirely
  if (content?.images && content.images.length > 0) {
    const imageCandidates = candidates.filter(name => 
      componentSupportsImages(name, category)
    );
    if (imageCandidates.length > 0) {
      candidates = imageCandidates;
    }
  }

  const selected = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    component: selected,
    score: 100,
    reason: `Randomly selected "${selected}" from ${candidates.length} available ${category} components`,
  };
}

/**
 * Determine which sections to include based on analysis
 * For homepage: Always includes all 11 sections in fixed order
 * For non-home pages: All sections detected in the source website are ALWAYS included.
 * Business type analysis only ADDS extra sections, never removes detected ones.
 */
function determineSections(
  detectedSections: string[],
  analysis: WebsiteAnalysis,
  pageSlug: string = 'index'
): { section: string; required: boolean; reason: string }[] {
  // For homepage, force all 11 sections in fixed order
  if (pageSlug === 'index') {
    return HOMEPAGE_SECTIONS.map(section => ({
      section,
      required: true,
      reason: 'Homepage always includes all sections'
    }));
  }

  // Non-home pages: keep current detection-based logic
  const sections: { section: string; required: boolean; reason: string }[] = [];
  const processedSections = new Set<string>();

  // 1. Add ALL detected sections first (no filtering by business type)
  // This ensures sections like testimonials, gallery, CTA are preserved if detected
  for (const section of detectedSections) {
    if (!processedSections.has(section)) {
      sections.push({
        section,
        required: false,
        reason: 'Detected from source content'
      });
      processedSections.add(section);
    }
  }

  // 2. Ensure required sections (hero, footer) exist even if classification missed them
  for (const requiredSection of REQUIRED_SECTIONS) {
    if (!processedSections.has(requiredSection)) {
      sections.push({
        section: requiredSection,
        required: true,
        reason: `${requiredSection} is essential for all websites`
      });
      processedSections.add(requiredSection);
    }
  }

  // 3. Add navbar for structural consistency (if not already detected)
  if (!processedSections.has('navbar')) {
    sections.unshift({
      section: 'navbar',
      required: true,
      reason: 'Navigation provides site structure'
    });
    processedSections.add('navbar');
  }

  // 4. CONDITIONAL_SECTIONS: Only ADD if not already detected
  // This step now only adds EXTRA sections based on business type,
  // never removes detected ones
  for (const [section, config] of Object.entries(CONDITIONAL_SECTIONS)) {
    if (processedSections.has(section)) continue; // Already detected from source
    if (config.shouldInclude(analysis, detectedSections)) {
      sections.push({
        section,
        required: false,
        reason: config.reason
      });
      processedSections.add(section);
    }
  }

  return sections;
}

/**
 * Enforce AI-compatible components from the current manifest.
 */
function enforceAICompatibleComponents(
  layout: LayoutItem[],
  componentsByCategory: Record<string, string[]>,
  pageSlug: string = 'index'
): LayoutItem[] {
  const enhancedLayout: LayoutItem[] = [];

  for (const item of layout) {
    const newItem = { ...item };
    const safeComponents = getAIComponentsForSection(
      item.section,
      componentsByCategory[item.section] || [],
      pageSlug
    );

    if (safeComponents.length > 0) {
      const isSafe = safeComponents.includes(item.component);
      if (!isSafe) {
        newItem.component = safeComponents[Math.floor(Math.random() * safeComponents.length)];
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
  const sectionsToBuild = determineSections(detectedSections, analysis, pageSlug);

  console.log('[Component Selector] Sections to build:', sectionsToBuild);

  const layout: LayoutItem[] = [];
  const selectionReasons: Record<string, string> = {};

  // Select components for each section
  for (const { section, required, reason } of sectionsToBuild) {
    const category = section; // Section name matches category

    if (!componentsByCategory[category]) {
      console.warn(`[Component Selector] No components found for category: ${category}`);
      continue;
    }

    const availableComponents = getAIComponentsForSection(
      category,
      componentsByCategory[category],
      pageSlug
    );

    if (availableComponents.length === 0) {
      console.warn(`[Component Selector] No AI-selectable components found for category: ${category}`);
      continue;
    }

    // Select best component (with image awareness)
    const selection = selectBestComponent(
      category,
      availableComponents,
      analysis,
      recommendations,
      new Set<string>(),
      content
    );

    layout.push({
      section,
      component: selection.component
    });

    const supportsImages = componentSupportsImages(selection.component, section);
    selectionReasons[section] = `${selection.reason}. ${reason}${content?.images && content.images.length > 0 ? ` (Image support: ${supportsImages ? 'YES' : 'NO'})` : ''}`;

    console.log(`[Component Selector] ${section}: ${selection.component} (${selection.score} pts)${supportsImages && content?.images?.length ? ' [IMAGE-CAPABLE]' : ''}`);
  }

  console.log('[Component Selector] Selection complete.');

  // ENFORCE AI-COMPATIBLE COMPONENTS from the current manifest
  console.log('[Component Selector] Enforcing AI-safe component whitelist...');
  const filteredLayout = enforceAICompatibleComponents(layout, componentsByCategory, pageSlug);

  return {
    layout: filteredLayout,
    selectionReasons,
    varietyScore: 100
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

  // Filter to manifest-backed AI-selectable components for the prompt
  const dynamicOnlyByCategory: Record<string, string[]> = {};
  for (const [category, comps] of Object.entries(componentsByCategory)) {
    const selectable = getAIComponentsForSection(category, comps, pageSlug);
    if (selectable.length > 0) {
      dynamicOnlyByCategory[category] = selectable;
    }
  }

  // For non-home pages, hero must only be hero-banner-dynamic
  const isNonHomePage = pageSlug !== 'index';
  if (isNonHomePage && dynamicOnlyByCategory.hero?.includes('hero-banner-dynamic')) {
    dynamicOnlyByCategory.hero = ['hero-banner-dynamic'];
  }

  // Build dynamic selection guidelines from actual available components
  const sectionGuidelines = Object.entries(dynamicOnlyByCategory)
    .map(([section, comps]) => {
      if (comps.length === 0) return null;
      const randomPick = comps[Math.floor(Math.random() * comps.length)];
      return `- ${section} section → choose ANY from: [${comps.join(', ')}] (suggested this run: ${randomPick})`;
    })
    .filter(Boolean)
    .join('\n');

  return `You are an expert UI/UX designer. Your job is to select the best dynamic components to rebuild a website.

## STRICT RULE — DYNAMIC COMPONENTS ONLY
You MUST only select components whose name ends with "-dynamic".
Never select components like hero-modern, hero-minimal, navbar-gradient, footer-elegant etc.
Only valid selections end with: -dynamic (e.g. hero-action-dynamic, about-bio-dynamic, blog-article-dynamic)
Exception: footer-simple is also valid.

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

## IMPORTANT: All components listed above are valid choices.

## How to Choose the Best Dynamic Component:
Analyze the source website's detected sections and match them to the best available component.
ALWAYS check the full "Available DYNAMIC-ONLY Components" list above before deciding.

Selection guidelines — pick freely from the available components list above:
${sectionGuidelines}

IMPORTANT: You are encouraged to pick DIFFERENT components on different runs. Do not default to the same component every time.

## Business Type Guidance:
- education/academy → prioritize about-bio-dynamic, blog-article-dynamic, story-archive-dynamic
- saas/startup → prioritize hero-action-dynamic, blog-article-dynamic
- corporate → prioritize about-bio-dynamic, story-archive-dynamic
- portfolio/agency → prioritize story-archive-dynamic, blog-article-dynamic
- ecommerce → prioritize blog-article-dynamic

## Response Format — Return ONLY this JSON, no markdown, no explanation:
{
  "layout": [
    {"section": "hero", "component": "hero-action-dynamic"},
    {"section": "about", "component": "about-bio-dynamic"},
    {"section": "blog", "component": "blog-article-dynamic"},
    {"section": "company-story", "component": "story-archive-dynamic"},
    {"section": "footer", "component": "footer-simple"}
  ]
}

IMPORTANT: Only include sections that were detected. Always include hero and footer.
Every component name you return MUST end with "-dynamic" (exception: footer-simple).
`;
}
