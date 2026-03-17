import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// DeepSeek API endpoints (try primary, fallback to OpenRouter)
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Path to components library
const COMPONENTS_LIBRARY_PATH = path.join(process.cwd(), 'components-library');
const COMPONENTS_JSON_PATH = path.join(COMPONENTS_LIBRARY_PATH, 'components.json');
const GENERATED_PAGE_DIR = path.join(process.cwd(), 'generated-page');
const LAYOUT_JSON_PATH = path.join(GENERATED_PAGE_DIR, 'layout.json');
const CONTENT_JSON_PATH = path.join(GENERATED_PAGE_DIR, 'content.json');

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
function buildComponentsByCategory(manifest: ComponentsManifest): Record<string, string[]> {
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
 * Build the prompt for DeepSeek AI
 */
function buildPrompt(
  sections: string[],
  componentsByCategory: Record<string, string[]>
): string {
  const categories = Object.keys(componentsByCategory);
  
  return `You are an expert UI/UX designer and web developer. Your task is to select the best components from a component library to build a website layout.

## Detected Website Sections:
${sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Available Components by Category:
${JSON.stringify(componentsByCategory, null, 2)}

## Your Task:
For each detected section, select the most appropriate component from the available components. Consider:
- The purpose and content of each section
- The component descriptions and their suitability
- Creating a cohesive, modern design

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
4. Return ONLY the JSON, no explanations or additional text

Example response:
{
  "layout": [
    {"section": "navbar", "component": "navbar-modern"},
    {"section": "hero", "component": "hero-gradient"},
    {"section": "features", "component": "features-grid"},
    {"section": "footer", "component": "footer-simple"}
  ]
}`;
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
 * Save layout to generated-page/layout.json
 */
function saveLayout(layout: LayoutResponse): void {
  try {
    // Ensure directory exists
    if (!fs.existsSync(GENERATED_PAGE_DIR)) {
      fs.mkdirSync(GENERATED_PAGE_DIR, { recursive: true });
      console.log('[AI Layout Generator] Created generated-page directory');
    }

    fs.writeFileSync(LAYOUT_JSON_PATH, JSON.stringify(layout, null, 2), 'utf-8');
    console.log('[AI Layout Generator] Layout saved to:', LAYOUT_JSON_PATH);
  } catch (error) {
    console.error('[AI Layout Generator] Failed to save layout:', error);
    throw error;
  }
}

/**
 * Save extracted content to generated-page/content.json
 */
export function saveContent(content: ExtractedContent): void {
  try {
    // Ensure directory exists
    if (!fs.existsSync(GENERATED_PAGE_DIR)) {
      fs.mkdirSync(GENERATED_PAGE_DIR, { recursive: true });
      console.log('[AI Layout Generator] Created generated-page directory');
    }

    fs.writeFileSync(CONTENT_JSON_PATH, JSON.stringify(content, null, 2), 'utf-8');
    console.log('[AI Layout Generator] Content saved to:', CONTENT_JSON_PATH);
  } catch (error) {
    console.error('[AI Layout Generator] Failed to save content:', error);
    throw error;
  }
}

/**
 * Load layout from generated-page/layout.json
 */
export function loadLayout(): Promise<LayoutResponse> {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(LAYOUT_JSON_PATH)) {
        reject(new Error('layout.json does not exist. Run generateLayoutWithAI first.'));
        return;
      }

      const fileContent = fs.readFileSync(LAYOUT_JSON_PATH, 'utf-8');
      const layout: LayoutResponse = JSON.parse(fileContent);
      console.log('[AI Layout Generator] Loaded existing layout:', layout);
      resolve(layout);
    } catch (error) {
      console.error('[AI Layout Generator] Failed to load layout:', error);
      reject(error);
    }
  });
}

/**
 * Load content from generated-page/content.json
 */
export function loadContent(): Promise<ExtractedContent | null> {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(CONTENT_JSON_PATH)) {
        console.log('[AI Layout Generator] No content.json found, content will use defaults');
        resolve(null);
        return;
      }

      const fileContent = fs.readFileSync(CONTENT_JSON_PATH, 'utf-8');
      const content: ExtractedContent = JSON.parse(fileContent);
      console.log('[AI Layout Generator] Loaded existing content');
      resolve(content);
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
 * Main function: Generate layout with AI based on page structure
 * 
 * @param pageStructure - The detected page structure with sections
 * @returns The AI-selected layout mapping sections to components
 */
export async function generateLayoutWithAI(pageStructure: PageStructure): Promise<LayoutResponse> {
  console.log('[AI Layout Generator] Starting layout generation...');
  console.log('[AI Layout Generator] Page structure sections:', pageStructure.sections);

  try {
    // Step 1: Load available components
    console.log('[AI Layout Generator] Loading available components...');
    const manifest = await loadAvailableComponents();
    
    // Step 2: Build components map by category
    const componentsByCategory = buildComponentsByCategory(manifest);
    
    // Step 3: Build the prompt
    console.log('[AI Layout Generator] Building AI prompt...');
    const prompt = buildPrompt(pageStructure.sections, componentsByCategory);
    
    // Step 4: Call DeepSeek API
    console.log('[AI Layout Generator] Calling DeepSeek API...');
    const aiResponse = await callDeepSeekAPI(prompt);
    
    // Step 5: Parse the response
    console.log('[AI Layout Generator] Parsing AI response...');
    const layout = parseLayoutResponse(aiResponse);
    
    // Step 6: Save the layout
    console.log('[AI Layout Generator] Saving layout...');
    saveLayout(layout);
    
    // Step 7: Log selected components
    console.log('[AI Layout Generator] === AI Component Selection Complete ===');
    console.log('[AI Layout Generator] Selected components:');
    layout.layout.forEach((item) => {
      console.log(`  - ${item.section}: ${item.component}`);
    });
    console.log('[AI Layout Generator] =========================================');
    
    return layout;
  } catch (error) {
    console.error('[AI Layout Generator] Error generating layout:', error);
    throw error;
  }
}
