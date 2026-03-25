/**
 * AI Prop Injector
 * 
 * Uses DeepSeek AI to intelligently generate component props
 * from extracted website content.
 * 
 * For each component in the layout, AI receives:
 * 1. The extracted website content (headings, paragraphs, nav links etc.)
 * 2. The component's prop schema (what props it accepts and their types)
 * 3. Instructions to write natural, summarised content — not copy-paste
 * 
 * Returns a map of section → props object ready to spread into the component.
 */

import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ExtractedWebsiteContent {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  images?: Array<{ src: string; alt?: string; title?: string; width?: number; height?: number }>;
  processed?: {
    features?: {
      heading: string;
      description: string;
      items: Array<{ title: string; description: string }>;
    };
    about?: {
      title: string;
      description: string;
      companies?: string[];
      achievements?: Array<{ label: string; value: string }>;
      breakout?: { title: string; description: string };
    };
    footer?: {
      brandName: string;
      description: string;
      contactInfo?: { email?: string; phone?: string; address?: string };
      copyright: string;
    };
  };
}

export interface ComponentPropSchema {
  componentName: string;
  section: string;
  props: Array<{
    name: string;
    type: string;
    description: string;
    maxWords?: number;
    required: boolean;
  }>;
}

/**
 * Registry of every component's prop schema.
 * AI uses this to know what to write for each component.
 * Add one entry per component.
 */
export const COMPONENT_PROP_SCHEMAS: Record<string, ComponentPropSchema> = {

  // ── HERO ──────────────────────────────────────────────────────────
  'hero-dynamic': {
    componentName: 'hero-dynamic',
    section: 'hero',
    props: [
      { name: 'subtitle',              type: 'string', description: 'Small label above title, max 6 words', maxWords: 6,  required: false },
      { name: 'title',                 type: 'string', description: 'Main headline — bold, impactful, max 8 words', maxWords: 8,  required: true  },
      { name: 'description',           type: 'string', description: 'Supporting paragraph, max 25 words',   maxWords: 25, required: false },
      { name: 'buttonText',            type: 'string', description: 'Primary CTA button label, max 4 words', maxWords: 4,  required: false },
      { name: 'secondaryButtonText',   type: 'string', description: 'Secondary CTA button, max 4 words',    maxWords: 4,  required: false },
      { name: 'image',                 type: 'string', description: 'Hero section image URL — select most relevant image from Available Images list', required: false },
    ],
  },
  'hero-ab': {
    componentName: 'hero-ab',
    section: 'hero',
    props: [
      { name: 'content.title',       type: 'string',   description: 'Main hero headline — bold, impactful, max 8 words',    maxWords: 8,  required: true  },
      { name: 'content.subtitle',    type: 'string',   description: 'Tagline below headline, max 6 words',                  maxWords: 6,  required: false },
      { name: 'content.description', type: 'string',   description: 'Supporting paragraph, max 20 words',                  maxWords: 20, required: false },
      { name: 'content.buttonText',  type: 'string',   description: 'Primary CTA button label, max 4 words',               maxWords: 4,  required: false },
    ],
  },
  'hero-ac': {
    componentName: 'hero-ac',
    section: 'hero',
    props: [
      { name: 'content.title',       type: 'string',   description: 'Main hero headline, max 8 words',  maxWords: 8,  required: true  },
      { name: 'content.description', type: 'string',   description: 'Supporting text, max 25 words',    maxWords: 25, required: false },
      { name: 'content.buttonText',  type: 'string',   description: 'CTA button label, max 4 words',    maxWords: 4,  required: false },
    ],
  },
  'hero-ad': {
    componentName: 'hero-ad',
    section: 'hero',
    props: [
      { name: 'content.title',              type: 'string', description: 'Main headline, max 8 words',    maxWords: 8,  required: true  },
      { name: 'content.subtitle',           type: 'string', description: 'Small label above title, max 6 words', maxWords: 6, required: false },
      { name: 'content.description',        type: 'string', description: 'Paragraph text, max 25 words',  maxWords: 25, required: false },
      { name: 'content.buttonText',         type: 'string', description: 'Primary CTA, max 4 words',      maxWords: 4,  required: false },
      { name: 'content.secondaryButtonText',type: 'string', description: 'Secondary CTA, max 4 words',    maxWords: 4,  required: false },
    ],
  },
  'hero-ae': {
    componentName: 'hero-ae',
    section: 'hero',
    props: [
      { name: 'content.title',       type: 'string', description: 'Main headline, max 8 words',    maxWords: 8,  required: true  },
      { name: 'content.subtitle',    type: 'string', description: 'Small label, max 6 words',      maxWords: 6,  required: false },
      { name: 'content.description', type: 'string', description: 'Paragraph, max 25 words',       maxWords: 25, required: false },
      { name: 'content.buttonText',  type: 'string', description: 'CTA button, max 4 words',       maxWords: 4,  required: false },
    ],
  },

  // ── FEATURES ──────────────────────────────────────────────────────
  'features-dynamic': {
    componentName: 'features-dynamic',
    section: 'features',
    props: [
      { name: 'title',       type: 'string', description: 'Section title, max 8 words',       maxWords: 8,  required: true  },
      { name: 'description', type: 'string', description: 'Short description, max 25 words',  maxWords: 25, required: false },
      { name: 'items',       type: 'Array<{title:string,description:string,image?:string}>', description: 'List of 2-6 feature cards. Each title max 6 words, each description max 20 words. For each item, select the most relevant image from Available Images list if applicable.', required: true },
    ],
  },
  'features-slideshow': {
    componentName: 'features-slideshow',
    section: 'features',
    props: [
      { name: 'heading', type: 'string', description: 'Section heading, max 6 words', maxWords: 6, required: true },
    ],
  },
  'features- Image': {
    componentName: 'features- Image',
    section: 'features',
    props: [
      { name: 'heading', type: 'string', description: 'Section heading, max 6 words', maxWords: 6, required: true },
    ],
  },
  'features-coursel': {
    componentName: 'features-coursel',
    section: 'features',
    props: [
      { name: 'title',       type: 'string', description: 'Section title, max 6 words',       maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'Short description, max 20 words',  maxWords: 20, required: false },
    ],
  },
  'features-gallery-type': {
    componentName: 'features-gallery-type',
    section: 'features',
    props: [
      { name: 'title',       type: 'string', description: 'Section title, max 6 words',       maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'Short description, max 20 words',  maxWords: 20, required: false },
    ],
  },
  'features-grid': {
    componentName: 'features-grid',
    section: 'features',
    props: [
      { name: 'badge',        type: 'string', description: 'Small badge label, 1-3 words',                    maxWords: 3,  required: false },
      { name: 'heading',      type: 'string', description: 'Section heading, max 6 words',                    maxWords: 6,  required: true  },
      { name: 'description',  type: 'string', description: 'Subtitle paragraph, max 15 words',               maxWords: 15, required: false },
      { name: 'featureItems', type: 'Array<{title:string,description:string}>', description: 'List of 2-4 feature cards. Each title max 5 words, each description max 15 words', required: false },
    ],
  },
  'features-Image-new': {
    componentName: 'features-Image-new',
    section: 'features',
    props: [
      { name: 'badge',        type: 'string', description: 'Badge label, 1-3 words',          maxWords: 3,  required: false },
      { name: 'title',        type: 'string', description: 'Section heading, max 8 words',    maxWords: 8,  required: true  },
      { name: 'description',  type: 'string', description: 'Paragraph text, max 25 words',   maxWords: 25, required: false },
    ],
  },

  // ── ABOUT ─────────────────────────────────────────────────────────
  'about-dynamic': {
    componentName: 'about-dynamic',
    section: 'about',
    props: [
      { name: 'title',       type: 'string', description: 'About section heading, max 6 words',                    maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'About paragraph summarised in max 40 words',            maxWords: 40, required: true  },
      { name: 'stats',       type: 'Array<{label:string,value:string}>', description: 'Key statistics like years, students, courses. Extract real numbers from content if available (e.g. "28+", "1000+")', required: false },
      { name: 'companies',   type: 'string[]', description: 'List of partner/client company names if mentioned in content', required: false },
      { name: 'image',       type: 'string', description: 'About section image URL — select most relevant image from Available Images list (e.g. team photo, office, campus)', required: false },
    ],
  },
  'about-two-column': {
    componentName: 'about-two-column',
    section: 'about',
    props: [
      { name: 'title',                  type: 'string',  description: 'About section heading, max 6 words',                    maxWords: 6,  required: true  },
      { name: 'description',            type: 'string',  description: 'About paragraph summarised in max 40 words',            maxWords: 40, required: true  },
      { name: 'achievementsTitle',      type: 'string',  description: 'Achievements section heading, max 5 words',             maxWords: 5,  required: false },
      { name: 'achievementsDescription',type: 'string',  description: 'Short achievements description, max 15 words',         maxWords: 15, required: false },
      { name: 'companiesTitle',         type: 'string',  description: 'Trusted by label, max 6 words',                        maxWords: 6,  required: false },
      { name: 'injectedCompanies',      type: 'string[]',description: 'List of partner/client company names if mentioned',    required: false },
      { name: 'injectedAchievements',   type: 'Array<{label:string,value:string}>', description: 'Stats like years experience, students enrolled etc. Extract real numbers from content if available', required: false },
    ],
  },

  // ── TESTIMONIALS ──────────────────────────────────────────────────
  'testimonials-dynamic': {
    componentName: 'testimonials-dynamic',
    section: 'testimonials',
    props: [
      { name: 'title',       type: 'string', description: 'Section title, max 6 words',       maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'Subtitle text, max 15 words',      maxWords: 15, required: false },
      { name: 'testimonials',type: 'Array<{text:string,name?:string,role?:string,image?:string}>', description: 'Real feedback content summarised from site. Each text max 25 words. If no real testimonials exist, generate realistic domain-specific feedback with contextual roles (e.g. "Accounting Student", "Course Graduate") - NOT generic names like John Doe. For each testimonial, optionally include a portrait image URL from Available Images if relevant.', required: true },
    ],
  },
  'testimonial-cards': {
    componentName: 'testimonial-cards',
    section: 'testimonials',
    props: [
      { name: 'title',       type: 'string', description: 'Section heading, max 6 words',       maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'Subtitle text, max 15 words',        maxWords: 15, required: false },
    ],
  },
  'testimonial-section5': {
    componentName: 'testimonial-section5',
    section: 'testimonials',
    props: [
      { name: 'title',       type: 'string', description: 'Section heading, max 6 words',  maxWords: 6,  required: true  },
      { name: 'description', type: 'string', description: 'Subtitle text, max 15 words',   maxWords: 15, required: false },
    ],
  },

  // ── NAVBAR ────────────────────────────────────────────────────────
  'navbar-minimal': {
    componentName: 'navbar-minimal',
    section: 'navbar',
    props: [
      { name: 'menuItems', type: 'Array<{to:string,text:string}>', description: 'Navigation links extracted from the website nav menu', required: true },
    ],
  },
  'navbar-modern': {
    componentName: 'navbar-modern',
    section: 'navbar',
    props: [
      { name: 'menu', type: 'Array<{title:string,url:string}>', description: 'Navigation links from the website', required: true },
    ],
  },

  // ── CONTACT ───────────────────────────────────────────────────────
  'contact-form': {
    componentName: 'contact-form',
    section: 'contact',
    props: [
      { name: 'title',       type: 'string', description: 'Contact section heading, max 5 words',  maxWords: 5,  required: true  },
      { name: 'description', type: 'string', description: 'Contact description, max 20 words',     maxWords: 20, required: false },
    ],
  },
  'contact-split-dynamic': {
    componentName: 'contact-split-dynamic',
    section: 'contact',
    props: [
      { name: 'title', type: 'string', description: 'Main heading for the contact section', maxWords: 8, required: true },
      { name: 'description', type: 'string', description: 'Subtext explaining the contact purpose', maxWords: 20 },
      { name: 'formTitle', type: 'string', description: 'Heading for the contact form', maxWords: 6 },
      { name: 'nameLabel', type: 'string', description: 'Label for the name input field', maxWords: 3 },
      { name: 'namePlaceholder', type: 'string', description: 'Placeholder for the name input field', maxWords: 5 },
      { name: 'emailLabel', type: 'string', description: 'Label for the email input field', maxWords: 3 },
      { name: 'emailPlaceholder', type: 'string', description: 'Placeholder for the email input field', maxWords: 5 },
      { name: 'phoneLabel', type: 'string', description: 'Label for the phone input field', maxWords: 3 },
      { name: 'phonePlaceholder', type: 'string', description: 'Placeholder for the phone input field', maxWords: 5 },
      { name: 'messageLabel', type: 'string', description: 'Label for the message textarea', maxWords: 3 },
      { name: 'messagePlaceholder', type: 'string', description: 'Placeholder for the message textarea', maxWords: 8 },
      { name: 'submitButtonText', type: 'string', description: 'Text for the form submission button', maxWords: 4 }
    ],
  },

  // ── FOOTER ────────────────────────────────────────────────────────
  'footer-simple': {
    componentName: 'footer-simple',
    section: 'footer',
    props: [
      { name: 'brandName',   type: 'string',   description: 'Brand or company name',                     maxWords: 4,  required: true  },
      { name: 'description', type: 'string',   description: 'Short brand description, max 20 words',     maxWords: 20, required: false },
      { name: 'copyright',   type: 'string',   description: 'Copyright text with year and brand name',   maxWords: 10, required: false },
    ],
  },

  // ── ADDITIONAL TESTIMONIALS ───────────────────────────────────────
  'testimonial-gradient': {
    componentName: 'testimonial-gradient',
    section: 'testimonials',
    props: [
      { name: 'testimonials', type: 'Array<{text:string,image:string,name:string,role:string}>', description: 'Write 3 realistic testimonials based on the type of business this website represents. Each text max 20 words, name should be a realistic person name, role should be relevant to the business.', required: true },
    ],
  },
  'testimonial-section4': {
    componentName: 'testimonial-section4',
    section: 'testimonials',
    props: [
      { name: 'testimonials', type: 'Array<{text:string,image:string,name:string,role:string}>', description: 'Write 3 realistic testimonials for this business type. Each text max 20 words.', required: true },
    ],
  },

  // ── ADDITIONAL FOOTER ─────────────────────────────────────────────
  'footer-corporate': {
    componentName: 'footer-corporate',
    section: 'footer',
    props: [
      { name: 'companyName',   type: 'string',   description: 'Brand name, max 4 words',              maxWords: 4,  required: true  },
      { name: 'description',   type: 'string',   description: 'Brand description, max 20 words',      maxWords: 20, required: false },
      { name: 'newsletterTitle', type: 'string', description: 'Newsletter CTA heading, max 5 words',  maxWords: 5,  required: false },
    ],
  },
};

/**
 * Build the AI prompt for a single component.
 */
function buildPropPrompt(
  schema: ComponentPropSchema,
  content: ExtractedWebsiteContent
): string {
  const propsDescription = schema.props
    .map(p => `  - "${p.name}" (${p.type}): ${p.description}${p.required ? ' [REQUIRED]' : ' [OPTIONAL]'}`)
    .join('\n');

  const rawImages = content.images || [];
  const availableImages = rawImages
    .slice(0, 20)
    .map(img => typeof img === 'string' ? img : img.src)
    .filter(Boolean)
    .join('\n') || 'No images available';

  return `You are an expert web content writer. Your job is to write content for a website component using extracted content from a real website.

## Website Content Extracted:
Headings: ${content.headings.slice(0, 10).join(' | ')}
Paragraphs: ${content.paragraphs.slice(0, 8).join(' | ')}
Navigation Links: ${content.navigationLinks.join(', ')}
Footer Text: ${content.footerText || 'N/A'}
Contact Info: ${JSON.stringify(content.contactInfo || {})}
AI-Processed Features: ${JSON.stringify(content.processed?.features || {})}
AI-Processed About: ${JSON.stringify(content.processed?.about || {})}
AI-Processed Footer: ${JSON.stringify(content.processed?.footer || {})}

## Available Images (select most relevant ones for this section):
${availableImages}

## Component: ${schema.componentName} (${schema.section} section)

## Props to fill:
${propsDescription}

## Rules:
1. Write FRESH content — do NOT copy-paste from the source. Rephrase and summarise.
2. Respect the maxWords limit for each prop strictly.
3. Content must be relevant to THIS specific website — not generic placeholders.
4. For injectedAchievements: extract real numbers/stats if present (e.g. "28+ years", "500+ students").
5. For injectedCompanies: only include if real company/partner names are mentioned.
6. For menuItems/menu: use the actual navigation links from the website.
7. All text must be professional, clean, and ready to display on a live website.
8. If a prop is OPTIONAL and there is no relevant content, set it to null.
9. **IMAGE SELECTION**: Select the MOST relevant image(s) for this section from the "Available Images" list above. Return the selected image URL(s) in the 'image' or 'items[].image' field if the component supports it. Do NOT use images not listed above.
10. If no relevant image exists for this section, leave image fields as null/undefined — do NOT force an image.

## Response Format:
Return ONLY a valid JSON object. No markdown, no explanations, no extra text.
The JSON must exactly match the prop names listed above.

Example for features-grid:
{
  "badge": "Courses",
  "heading": "Our Featured Programs",
  "description": "Explore our industry-recognised certifications",
  "featureItems": [
    { "title": "Tally Certification", "description": "Master accounting software used by thousands of businesses", "image": "https://example.com/image1.jpg" },
    { "title": "US CPA Program", "description": "Globally recognised accounting credential for professionals" }
  ]
}

Now generate the JSON for ${schema.componentName}:`;
}

/**
 * Call DeepSeek API.
 */
async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    return response.data.choices[0].message.content;
  } catch {
    // Fallback to OpenRouter
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
        },
        timeout: 30000,
      }
    );
    return response.data.choices[0].message.content;
  }
}

/**
 * Parse AI JSON response safely.
 */
function parseJSON(raw: string): Record<string, any> {
  try {
    const clean = raw
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    const match = clean.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  } catch {
    console.error('[AI Prop Injector] Failed to parse JSON:', raw);
    return {};
  }
}

/**
 * Generate AI props for a single component.
 * Returns the props object to spread into the component.
 */
export async function generatePropsForComponent(
  componentName: string,
  content: ExtractedWebsiteContent
): Promise<Record<string, any>> {
  const schema = COMPONENT_PROP_SCHEMAS[componentName];

  if (!schema) {
    console.log(`[AI Prop Injector] No schema for ${componentName}, skipping AI injection`);
    return {};
  }

  try {
    const prompt = buildPropPrompt(schema, content);
    console.log(`[AI Prop Injector] Generating props for ${componentName}...`);
    const raw = await callAI(prompt);
    const props = parseJSON(raw);
    console.log(`[AI Prop Injector] Props generated for ${componentName}:`, props);
    return props;
  } catch (error: any) {
    console.error(`[AI Prop Injector] Failed for ${componentName}:`, error.message);
    return {};
  }
}

/**
 * Generate AI props for ALL components in the layout in parallel.
 * Returns a map of componentName → props object.
 * 
 * This is called once when the layout is generated,
 * results are saved to generated-page/ai-props.json
 */
export async function generatePropsForLayout(
  layout: Array<{ section: string; component: string }>,
  content: ExtractedWebsiteContent
): Promise<Record<string, Record<string, any>>> {
  console.log('[AI Prop Injector] Starting AI prop generation for all components...');

  // Run all AI calls in parallel for speed
  const results = await Promise.allSettled(
    layout.map(async (item) => {
      const props = await generatePropsForComponent(item.component, content);
      return { component: item.component, section: item.section, props };
    })
  );

  const propMap: Record<string, Record<string, any>> = {};

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { component, props } = result.value;
      propMap[component] = props;
    }
  }

  console.log('[AI Prop Injector] AI prop generation complete for components:', Object.keys(propMap));
  return propMap;
}
