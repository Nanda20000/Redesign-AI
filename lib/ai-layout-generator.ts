import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeWebsite, getComponentRecommendations } from './website-analyzer';
import { buildEnhancedPrompt, selectComponents, componentSupportsImages } from './component-selector';
import { COMPONENT_META } from './component-meta';
import { getStaticOnlyComponents } from './component-content-map';
import { isComponentDynamic } from './component-content-map';

// DeepSeek API endpoints (try primary, fallback to OpenRouter)
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Path to components library
const COMPONENTS_LIBRARY_PATH = path.join(process.cwd(), 'components-library');
const COMPONENTS_JSON_PATH = path.join(COMPONENTS_LIBRARY_PATH, 'components.json');
const GENERATED_PAGES_DIR = path.join(process.cwd(), 'generated-pages');
const LEGACY_GENERATED_PAGE_DIR = path.join(process.cwd(), 'generated-page');

/**
 * Get the directory path for a specific page slug
 * Sanitizes slug to prevent path traversal and ensure valid folder names
 */
function getPageDir(pageSlug: string): string {
  // Sanitize slug: lowercase, replace spaces and slashes with hyphens, remove special chars
  const safe = pageSlug
    .toLowerCase()
    .replace(/[\/\\]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'index';
  return path.join(GENERATED_PAGES_DIR, safe);
}

export interface ComponentInfo {
  name: string;
  category: string;
  file: string;
  description: string;
}

export interface ComponentsManifest {
  components: ComponentInfo[];
  categories: string[];
}

export interface LayoutItem {
  section: string;
  component: string;
}

export interface LayoutResponse {
  layout: LayoutItem[];
}

export interface PageStructure {
  sections: string[];
}

export interface ExtractedContent {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  images?: Array<{
    src: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
  }>;
  items?: string[];
  sourceUrl?: string;
  sectionSequence?: string[];
  sectionBuckets?: Record<string, Array<{
    sourceIndex?: number;
    heading?: string;
    text: string;
    className?: string;
    id?: string;
    links?: string[];
    images?: Array<{
      src: string;
      alt?: string;
      title?: string;
      width?: number;
      height?: number;
    }>;
  }>>;
}

export interface GeneratedPageData {
  layout: LayoutItem[];
  content?: ExtractedContent;
}

/**
 * Load available components from components-library/components.json
 */
export function loadAvailableComponents(): Promise<ComponentsManifest> {
  return new Promise((resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(COMPONENTS_JSON_PATH, 'utf-8');
      const manifest: ComponentsManifest = JSON.parse(fileContent);
      console.log('[AI Layout Generator] Loaded components manifest:', manifest.categories);
      resolve(manifest);
    } catch (error) {
      console.error('[AI Layout Generator] Failed to load components.json:', error);
      reject(error);
    }
  });
}

/**
 * Build available components map by category
 */
export function buildComponentsByCategory(manifest: ComponentsManifest): Record<string, string[]> {
  const componentsByCategory: Record<string, string[]> = {};

  for (const component of manifest.components) {
    if (!componentsByCategory[component.category]) {
      componentsByCategory[component.category] = [];
    }
    componentsByCategory[component.category].push(component.name);
  }

  console.log('[AI Layout Generator] Components by category:', componentsByCategory);
  return componentsByCategory;
}

/**
 * Build the prompt for DeepSeek AI (legacy - kept for compatibility)
 * @deprecated Use buildEnhancedPrompt from component-selector instead
 */
function buildPrompt(
  sections: string[],
  componentsByCategory: Record<string, string[]>
): string {
  return buildEnhancedPrompt(
    sections,
    componentsByCategory,
    {
      businessType: 'general',
      tone: 'professional',
      contentRichness: 'medium',
      confidence: 0.5,
      signals: {
        businessTypeSignals: [],
        toneSignals: [],
        richnessSignals: []
      }
    },
    getComponentRecommendations({
      businessType: 'general',
      tone: 'professional',
      contentRichness: 'medium',
      confidence: 0.5,
      signals: {
        businessTypeSignals: [],
        toneSignals: [],
        richnessSignals: []
      }
    })
  );
}

/**
 * Call DeepSeek API with retry and fallback
 */
async function callDeepSeekAPI(prompt: string): Promise<string> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY;

      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not configured in environment variables');
      }

      if (apiKey === 'your_api_key_here') {
        throw new Error('Please replace "your_api_key_here" with your actual DeepSeek API key');
      }

      console.log(`[AI Layout Generator] DeepSeek API attempt ${attempt}/${maxRetries}...`);

      // Try primary DeepSeek endpoint first
      try {
        const response = await axios.post(
          DEEPSEEK_API_URL,
          {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        );

        console.log(`[AI Layout Generator] DeepSeek API attempt ${attempt} succeeded`);
        return response.data.choices[0].message.content;
      } catch (primaryError: any) {
        console.warn(`[AI Layout Generator] Primary DeepSeek endpoint failed: ${primaryError.message}`);

        // Fallback to OpenRouter if DeepSeek direct fails
        console.log('[AI Layout Generator] Trying OpenRouter fallback...');

        const openRouterKey = process.env.OPENROUTER_API_KEY || apiKey;

        const response = await axios.post(
          OPENROUTER_API_URL,
          {
            model: 'deepseek/deepseek-chat',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3000',
            },
            timeout: 30000,
          }
        );

        console.log('[AI Layout Generator] OpenRouter fallback succeeded');
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`[AI Layout Generator] API attempt ${attempt} failed:`, lastError.message);

      // Wait before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError || new Error('Failed to get response from DeepSeek API');
}

/**
 * Parse AI response to extract layout JSON
 */
function parseLayoutResponse(response: string): LayoutResponse {
  console.log('[AI Layout Generator] Raw AI response:', response);

  try {
    // Try to extract JSON from the response
    // Remove markdown code blocks if present
    let cleanResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON object in the response
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    const layout: LayoutResponse = JSON.parse(cleanResponse);
    
    console.log('[AI Layout Generator] Parsed layout response:', layout);
    return layout;
  } catch (error) {
    console.error('[AI Layout Generator] Failed to parse AI response:', error);
    console.error('[AI Layout Generator] Raw response was:', response);
    throw new Error('Failed to parse AI response as JSON');
  }
}

/**
 * Save layout to generated-pages/[pageSlug]/layout.json
 */
export function saveLayout(layout: LayoutResponse, pageSlug: string = 'index'): void {
  try {
    const pageDir = getPageDir(pageSlug);
    // Ensure directory exists
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
      console.log('[AI Layout Generator] Created page directory:', pageDir);
    }

    const layoutPath = path.join(pageDir, 'layout.json');
    fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');
    console.log(`[AI Layout Generator] Layout saved for page: ${pageSlug}`);
  } catch (error) {
    console.error('[AI Layout Generator] Failed to save layout:', error);
    throw error;
  }
}

/**
 * Save extracted content to generated-pages/[pageSlug]/content.json
 */
export function saveContent(content: ExtractedContent, pageSlug: string = 'index'): void {
  try {
    const pageDir = getPageDir(pageSlug);
    // Ensure directory exists
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
      console.log('[AI Layout Generator] Created page directory:', pageDir);
    }

    const contentPath = path.join(pageDir, 'content.json');
    console.log('[AI Layout Generator] Saving content with images:', content.images?.length || 0);
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`[AI Layout Generator] Content saved for page: ${pageSlug}`);
  } catch (error) {
    console.error('[AI Layout Generator] Failed to save content:', error);
    throw error;
  }
}

/**
 * Load layout from generated-pages/[pageSlug]/layout.json
 * Falls back to legacy generated-page/layout.json for backward compatibility
 */
export function loadLayout(pageSlug: string = 'index'): Promise<LayoutResponse> {
  return new Promise((resolve, reject) => {
    try {
      const layoutPath = path.join(getPageDir(pageSlug), 'layout.json');
      
      if (!fs.existsSync(layoutPath)) {
        // Fallback: try old single generated-page/ directory for backward compatibility
        const legacyPath = path.join(LEGACY_GENERATED_PAGE_DIR, 'layout.json');
        if (fs.existsSync(legacyPath) && pageSlug === 'index') {
          const fileContent = fs.readFileSync(legacyPath, 'utf-8');
          console.log('[AI Layout Generator] Loaded legacy layout for index page');
          resolve(JSON.parse(fileContent));
          return;
        }
        reject(new Error(`No layout found for page: ${pageSlug}`));
        return;
      }

      const fileContent = fs.readFileSync(layoutPath, 'utf-8');
      console.log('[AI Layout Generator] Loaded layout for page:', pageSlug);
      resolve(JSON.parse(fileContent));
    } catch (error) {
      console.error('[AI Layout Generator] Failed to load layout:', error);
      reject(error);
    }
  });
}

/**
 * Load content from generated-pages/[pageSlug]/content.json
 * Falls back to legacy generated-page/content.json for backward compatibility
 */
export function loadContent(pageSlug: string = 'index'): Promise<ExtractedContent | null> {
  return new Promise((resolve) => {
    try {
      const contentPath = path.join(getPageDir(pageSlug), 'content.json');
      
      if (!fs.existsSync(contentPath)) {
        // Fallback: try old path for index page
        const legacyPath = path.join(LEGACY_GENERATED_PAGE_DIR, 'content.json');
        if (fs.existsSync(legacyPath) && pageSlug === 'index') {
          const fileContent = fs.readFileSync(legacyPath, 'utf-8');
          console.log('[AI Layout Generator] Loaded legacy content for index page');
          resolve(JSON.parse(fileContent));
          return;
        }
        console.log('[AI Layout Generator] No content.json found for page:', pageSlug);
        resolve(null);
        return;
      }

      const fileContent = fs.readFileSync(contentPath, 'utf-8');
      console.log('[AI Layout Generator] Loaded content for page:', pageSlug);
      resolve(JSON.parse(fileContent));
    } catch (error) {
      console.error('[AI Layout Generator] Failed to load content:', error);
      resolve(null);
    }
  });
}

/**
 * Load complete generated page data (layout + content)
 */
export function loadGeneratedPageData(): Promise<GeneratedPageData> {
  return new Promise(async (resolve, reject) => {
    try {
      const layout = await loadLayout();
      const content = await loadContent();
      
      resolve({
        layout: layout.layout,
        content: content || undefined,
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get default image-capable component for a section
 */
function getDefaultImageComponent(section: string): string | null {
  switch (section) {
    case 'hero':
      return 'hero-action-dynamic';
    case 'about':
      return 'about-bio-dynamic';
    case 'blog':
      return 'blog-article-dynamic';
    case 'company-story':
      return 'company-story-dynamic';
    default:
      return null;
  }
}

/**
 * Force image-capable components when images exist
 */
function enforceImageComponents(
  layout: LayoutResponse,
  hasImages: boolean
): LayoutResponse {
  if (!hasImages) {
    return layout;
  }

  const enhancedLayout: LayoutItem[] = [];

  for (const item of layout.layout) {
    const newItem = { ...item };

    // Check if this section should have images (only for kept components)
    if (['hero', 'about', 'blog', 'company-story'].includes(item.section)) {
      if (!componentSupportsImages(item.component, item.section)) {
        const replacement = getDefaultImageComponent(item.section);
        if (replacement) {
          console.log('[FORCE FIX] Replacing non-image component:', {
            section: item.section,
            old: item.component,
            new: replacement
          });
          newItem.component = replacement;
        }
      }
    }

    enhancedLayout.push(newItem);
  }

  return { layout: enhancedLayout };
}

function isSelectableAIComponent(componentName: string): boolean {
  return componentName.endsWith('-dynamic') || componentName === 'footer-simple';
}

/**
 * Get AI-selectable components for a section.
 * Only returns the 6 kept components.
 */
function getAIComponentsForSection(
  section: string,
  availableComponents: string[],
  pageSlug: string
): string[] {
  return availableComponents.filter(isSelectableAIComponent);
}

/**
 * Enforce AI-compatible components on layout AFTER AI generation.
 * Uses token-overlap scoring to pick the best match instead of blind fallback.
 */
function enforceAICompatibleComponents(
  layout: LayoutResponse,
  componentsByCategory: Record<string, string[]>,
  pageSlug: string = 'index'
): LayoutResponse {
  const enhancedLayout: LayoutItem[] = [];

  for (const item of layout.layout) {
    const newItem = { ...item };
    const safeComponents = getAIComponentsForSection(
      item.section,
      componentsByCategory[item.section] || [],
      pageSlug
    );

    if (safeComponents.length > 0 && !safeComponents.includes(item.component)) {
      // Score candidates: prefer names that share tokens with the AI's original pick
      const aiTokens = item.component.toLowerCase().split('-');
      const scored = safeComponents.map(name => {
        const tokens = name.toLowerCase().split('-');
        const overlap = tokens.filter(t => aiTokens.includes(t)).length;
        return { name, overlap };
      });
      scored.sort((a, b) => b.overlap - a.overlap);
      newItem.component = scored[0].name;
      
      // Hero-specific logging for debugging
      if (item.section === 'hero') {
        console.log(`[enforceAI] Hero: AI chose "${item.component}", safe list: ${safeComponents.join(', ')}, final: "${newItem.component}"`);
      } else {
        console.log(`[enforceAI] ${item.section}: replaced "${item.component}" → "${newItem.component}" (token-scored)`);
      }
    }

    enhancedLayout.push(newItem);
  }

  return { layout: enhancedLayout };
}

function getUniqueSectionsInOrder(sections: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const section of sections) {
    if (!seen.has(section)) {
      seen.add(section);
      ordered.push(section);
    }
  }

  return ordered;
}

function normalizeStructuralSections(sections: string[]): string[] {
  const cleaned = sections.filter(Boolean);
  if (cleaned.length === 0) return [];

  const lastFooterIndexFromEnd = [...cleaned].reverse().findIndex((section) => section === 'footer');
  const lastFooterIndex = lastFooterIndexFromEnd >= 0
    ? cleaned.length - 1 - lastFooterIndexFromEnd
    : -1;

  const result = cleaned.filter((section, index) => {
    if (section === 'footer') return index === lastFooterIndex;
    return true; // hero, about, blog, company-story, faq-process all pass through
  });

  // Guarantee hero survives normalization
  if (!result.includes('hero')) {
    result.unshift('hero');
    console.log('[normalizeStructuralSections] Hero injected — was absent from input:', sections);
  }

  return result;
}

function mergeLayoutsByDetectedSections(
  detectedSections: string[],
  aiLayout: LayoutResponse,
  selectedLayout: LayoutItem[],
  pageSlug: string = 'index',
  options?: { preserveDuplicates?: boolean }
): LayoutResponse {
  let orderedSections: string[];

  if (pageSlug === 'index') {
    // For homepage, use rules engine sections in their order
    orderedSections = selectedLayout.map(item => item.section);
  } else {
    // Non-home pages: use detected sections
    orderedSections = options?.preserveDuplicates
      ? normalizeStructuralSections(detectedSections)
      : getUniqueSectionsInOrder(detectedSections);
  }

  // Guarantee hero exists in orderedSections — it is essential for all pages
  if (!orderedSections.includes('hero')) {
    orderedSections.unshift('hero');
    console.log('[mergeLayouts] Hero was missing from detectedSections — injected at start');
  }

  const aiBySection = new Map<string, LayoutItem[]>();
  for (const item of aiLayout.layout) {
    if (!aiBySection.has(item.section)) aiBySection.set(item.section, []);
    aiBySection.get(item.section)!.push(item);
  }

  const selectedBySection = new Map<string, LayoutItem[]>();
  for (const item of selectedLayout) {
    if (!selectedBySection.has(item.section)) selectedBySection.set(item.section, []);
    selectedBySection.get(item.section)!.push(item);
  }

  const fallbackBySection = new Map<string, LayoutItem>();
  const mergedLayout: LayoutItem[] = [];

  for (const section of orderedSections) {
    const aiCandidates = aiBySection.get(section) || [];
    const selectedCandidates = selectedBySection.get(section) || [];

    let candidate: LayoutItem | undefined;
    // For hero section, prefer rules engine (selectedLayout) over AI to enforce homepage restrictions
    if (section === 'hero' && selectedCandidates.length > 0) {
      candidate = selectedCandidates[0];
    } else if (aiCandidates.length > 0) {
      candidate = aiCandidates.shift();
    } else if (selectedCandidates.length > 0) {
      candidate = selectedCandidates[0];
    } else {
      candidate = fallbackBySection.get(section);
    }

    if (!candidate) continue;

    const normalized = { section, component: candidate.component };
    fallbackBySection.set(section, normalized);
    mergedLayout.push(normalized);
  }

  // Final deduplication safety net: ensure one of each section type
  // This catches any duplicates that may have slipped through
  const seen = new Set<string>();
  const dedupedLayout = mergedLayout.filter(item => {
    if (seen.has(item.section)) return false;
    seen.add(item.section);
    return true;
  });

  return {
    layout: dedupedLayout,
  };
}

/**
 * Select the best component for a section based on metadata and content
 */
function selectBestComponent(section: string, content?: ExtractedContent): string | null {
  const candidates = Object.entries(COMPONENT_META)
    .filter(([_, meta]) => meta.section === section);

  if (candidates.length === 0) return null;

  let best = candidates[0];

  for (const candidate of candidates) {
    const [name, meta] = candidate;

    // Rule 1: prefer image components if images exist
    if (content?.images?.length && content.images.length > 0 && meta.supportsImages) {
      best = candidate;
    }

    // Rule 2: prefer item components if items exist
    if (content?.items?.length && content.items.length > 0 && meta.supportsItems) {
      best = candidate;
    }

    // Rule 3: higher priority wins
    if (meta.priority > best[1].priority) {
      best = candidate;
    }
  }

  return best[0];
}

/**
 * Apply intelligent component selection based on metadata and content
 */
function applyIntelligentSelection(layout: LayoutItem[], content?: ExtractedContent): LayoutItem[] {
  return layout.map((item) => {
    const bestComponent = selectBestComponent(item.section, content);
    return {
      ...item,
      component: bestComponent || item.component
    };
  });
}

/**
 * Main function: Generate layout with AI based on page structure
 * Uses intelligent content analysis for component selection
 *
 * @param pageStructure - The detected page structure with sections
 * @param extractedContent - Optional extracted content for deeper analysis
 * @param pageSlug - The page slug for saving (default: 'index')
 * @returns The AI-selected layout mapping sections to components
 */
export async function generateLayoutWithAI(
  pageStructure: PageStructure,
  extractedContent?: ExtractedContent,
  pageSlug: string = 'index'
): Promise<LayoutResponse> {
  console.log('[AI Layout Generator] Starting intelligent layout generation...');
  console.log('[AI Layout Generator] Page structure sections:', pageStructure.sections);

  // Track if we have images for enforcement
  const hasImages = extractedContent?.images && extractedContent.images.length > 0;

  try {
    // Step 1: Load available components
    console.log('[AI Layout Generator] Loading available components...');
    const manifest = await loadAvailableComponents();

    // Step 2: Analyze website content for intelligent selection
    console.log('[AI Layout Generator] Analyzing website content...');
    const contentForAnalysis = extractedContent || {
      headings: [],
      paragraphs: [],
      navigationLinks: pageStructure.sections,
      footerText: ''
    };

    const analysis = analyzeWebsite(contentForAnalysis);
    console.log('[AI Layout Generator] Analysis results:', {
      businessType: analysis.businessType,
      tone: analysis.tone,
      contentRichness: analysis.contentRichness,
      confidence: analysis.confidence
    });
    console.log('[AI Layout Generator] Detection signals:', analysis.signals);

    // Step 3: Build components map by category
    const componentsByCategory = buildComponentsByCategory(manifest);

    // STRICT: Exclude ALL components that do not end with -dynamic
    // Only footer-simple is allowed as an exception (no footer-dynamic exists yet)
    const staticComponents = getStaticOnlyComponents();
    console.log('[AI Layout] Excluding static-only components:', staticComponents);

    for (const category of Object.keys(componentsByCategory)) {
      componentsByCategory[category] = componentsByCategory[category].filter(
        name => name.endsWith('-dynamic') || name === 'footer-simple' // footer-simple exception
      );
    }
    console.log('[AI Layout] Dynamic-only filtered components:', componentsByCategory);

    // Merge in any -dynamic components from components.json not yet in the manifest
    try {
      const { getDynamicComponentsBySection } = await import('./component-registry');
      const liveComponents = getDynamicComponentsBySection();
      for (const [category, names] of Object.entries(liveComponents)) {
        if (!componentsByCategory[category]) componentsByCategory[category] = [];
        for (const name of names) {
          if (!componentsByCategory[category].includes(name)) {
            componentsByCategory[category].push(name);
            console.log(`[AI Layout] Added newly registered component: ${name}`);
          }
        }
      }
    } catch (e) {
      console.warn('[AI Layout] Could not merge live component registry:', e);
    }

    // Step 4: Get intelligent recommendations
    const recommendations = getComponentRecommendations(analysis);

    // Step 5: Build enhanced prompt with analysis context
    console.log('[AI Layout Generator] Building intelligent AI prompt...');
    const prompt = buildEnhancedPrompt(
      pageStructure.sections,
      componentsByCategory,
      analysis,
      recommendations,
      pageSlug
    );

    // Step 6: Call DeepSeek API
    console.log('[AI Layout Generator] Calling DeepSeek API...');
    const aiResponse = await callDeepSeekAPI(prompt);

    // Step 7: Parse the response
    console.log('[AI Layout Generator] Parsing AI response...');
    let layout = parseLayoutResponse(aiResponse);

    // Step 8: Validate and enhance selection with rules engine (image-aware)
    console.log('[AI Layout Generator] Validating component selection...');
    const imageCount = extractedContent?.images?.length ?? 0;
    console.log('[AI Layout Generator] Passing content to selector:', {
      hasImages: imageCount > 0,
      imageCount: imageCount
    });
    const selectionResult = selectComponents({
      manifest,
      analysis,
      sections: pageStructure.sections,
      content: extractedContent,
      pageSlug
    });

    // Log selection reasoning
    console.log('[AI Layout Generator] Selection reasoning:');
    Object.entries(selectionResult.selectionReasons).forEach(([section, reason]) => {
      console.log(`  - ${section}: ${reason}`);
    });
    console.log(`[AI Layout Generator] Variety score: ${selectionResult.varietyScore}/100`);

    // Merge AI output with rule-based selection so we keep all detected sections
    // while preserving valid AI choices where they exist.
    // Note: preserveDuplicates is now true to allow multiple section types (e.g. multiple features or about)
    console.log('[AI Layout Generator] Pre-merge detectedSections:', pageStructure.sections);
    console.log('[AI Layout Generator] Pre-merge AI layout sections:', layout.layout.map(i => i.section));

    layout = mergeLayoutsByDetectedSections(
      pageStructure.sections,
      layout,
      selectionResult.layout,
      pageSlug,
      { preserveDuplicates: true }
    );

    console.log('[AI Layout Generator] Post-merge layout sections:', layout.layout.map(i => i.section));
    const heroAfterMerge = layout.layout.find(i => i.section === 'hero');
    if (!heroAfterMerge) {
      console.error('[AI Layout Generator] CRITICAL: Hero lost after merge. detectedSections had hero:', 
        pageStructure.sections.includes('hero'));
    }

    // FORCE IMAGE-CAPABLE COMPONENTS when images exist
    if (hasImages) {
      console.log('[AI Layout Generator] Enforcing image-capable components...');
      layout = enforceImageComponents(layout, hasImages);
    }

    // ENFORCE AI-COMPATIBLE COMPONENTS after merging so invalid selections are corrected
    console.log('[AI Layout Generator] Enforcing AI-safe component whitelist...');
    layout = enforceAICompatibleComponents(layout, componentsByCategory, pageSlug);

    // FINAL GUARD: Catch runaway layouts without severely restricting real duplicates
    if (layout.layout.length > 20) {
      console.warn(`[AI Layout Generator] Layout has ${layout.layout.length} items — trimming to 20`);

      // Keep first and last footer, and best middle sections
      const reversedLayout = [...layout.layout].reverse();
      const footer = reversedLayout.find(i => i.section === 'footer');

      // Extract hero explicitly before middle filter — hero must always survive
      const heroItem = layout.layout.find(i => i.section === 'hero');
      const middle = layout.layout.filter(
        i => i.section !== 'footer' && i.section !== 'hero'
      );

      // Deduplicate middle sections with limits for kept sections only
      const seen: Record<string, number> = {};
      const maxMid: Record<string, number> = {
        about: 3,
        blog: 3,
        'company-story': 2,
        'faq-process': 2
      };
      const dedupedMiddle = middle.filter(item => {
        const count = seen[item.section] || 0;
        const max = maxMid[item.section] ?? 6;
        if (count < max) { seen[item.section] = count + 1; return true; }
        return false;
      });

      // Reassemble: hero (always) → middle sections → footer
      layout = {
        layout: [
          ...(heroItem ? [heroItem] : []),  // hero always preserved
          ...dedupedMiddle.slice(0, 18),
          ...(footer ? [footer] : []),
        ]
      };

      saveLayout(layout, pageSlug);
    }

    // Step 9: Save the layout
    console.log('[AI Layout Generator] Saving layout...');
    saveLayout(layout, pageSlug);

    // Step 10: Log selected components (after enforcement)
    console.log('[AI Layout Generator] === AI Component Selection Complete (After Image Enforcement) ===');
    console.log('[AI Layout Generator] Website Analysis:');
    console.log(`  - Business Type: ${analysis.businessType} (${Math.round(analysis.confidence * 100)}% confidence)`);
    console.log(`  - Tone: ${analysis.tone}`);
    console.log(`  - Content Richness: ${analysis.contentRichness}`);
    console.log('[AI Layout Generator] Image enforcement:');
    console.log(`  - Has images: ${extractedContent?.images && extractedContent.images.length > 0}`);
    console.log(`  - Image count: ${extractedContent?.images?.length || 0}`);
    console.log('[AI Layout Generator] Final component selection:');
    layout.layout.forEach((item) => {
      const supportsImages = componentSupportsImages(item.component, item.section);
      const wasEnforced = hasImages && ['hero', 'features', 'about', 'testimonials'].includes(item.section) && supportsImages;
      console.log(`  - ${item.section}: ${item.component}${wasEnforced ? ' [IMAGE-CAPABLE ✓]' : supportsImages ? ' [IMAGE-CAPABLE]' : ''}`);
    });
    console.log('[AI Layout Generator] =========================================');

    // Return layout directly — enforceAICompatibleComponents above already ensures only dynamic components are selected
    return layout;
  } catch (error) {
    console.error('[AI Layout Generator] Error generating layout:', error);
    throw error;
  }
}

/**
 * List all generated pages with their available data
 */
export function listGeneratedPages(): Array<{ slug: string; hasLayout: boolean; hasContent: boolean }> {
  if (!fs.existsSync(GENERATED_PAGES_DIR)) return [];
  return fs.readdirSync(GENERATED_PAGES_DIR)
    .filter(name => fs.statSync(path.join(GENERATED_PAGES_DIR, name)).isDirectory())
    .map(slug => ({
      slug,
      hasLayout: fs.existsSync(path.join(GENERATED_PAGES_DIR, slug, 'layout.json')),
      hasContent: fs.existsSync(path.join(GENERATED_PAGES_DIR, slug, 'content.json')),
    }));
}
