import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '../../../../lib/ai';

interface ClassifiedSection {
  type: string;
  text: string;
  sourceIndex?: number;
}

interface InputSection {
  textPreview?: string;
  text?: string;
  heading?: string;
  class?: string;
  id?: string;
  sourceIndex?: number;
  links?: string[];
  images?: Array<{ src: string; alt?: string; title?: string; width?: number; height?: number }>;
  detectedType?: string | null;  // Type detected during scraping
}

interface ClassifyRequest {
  headings: string[];
  sections: Array<string | InputSection>;
  hasNavbar?: boolean;
  hasFooter?: boolean;
  navbarLinks?: string[];
  pageType?: string;
  sourceUrl?: string;
}

interface ClassifyResponse {
  sections: ClassifiedSection[];
}

const VALID_SECTION_TYPES = [
  'navbar',
  'hero',
  'about',
  'features',
  'services',
  'testimonials',
  'contact',
  'footer',
  'gallery',
  'cta',
  'blog',
];

function normalizeSections(sections: Array<string | InputSection>): InputSection[] {
  return sections.map((section, index) => {
    if (typeof section === 'string') {
      return {
        textPreview: section,
        sourceIndex: index,
      };
    }

    return {
      ...section,
      sourceIndex: typeof section.sourceIndex === 'number' ? section.sourceIndex : index,
    };
  });
}

function normalizeSectionType(type: string): string {
  const lower = (type || '').toLowerCase();
  return VALID_SECTION_TYPES.includes(lower) ? lower : 'features';
}

function normalizeStructuralSections(sections: ClassifiedSection[]): ClassifiedSection[] {
  const firstNavbarIndex = sections.findIndex((section) => section.type === 'navbar');
  const lastFooterIndexFromEnd = [...sections].reverse().findIndex((section) => section.type === 'footer');
  const lastFooterIndex = lastFooterIndexFromEnd >= 0 ? sections.length - 1 - lastFooterIndexFromEnd : -1;

  return sections.filter((section, index) => {
    if (section.type === 'navbar') return index === firstNavbarIndex;
    if (section.type === 'footer') return index === lastFooterIndex;
    return true;
  });
}

function createPrompt(headings: string[], sections: InputSection[], hasNavbar?: boolean, hasFooter?: boolean, navbarLinks?: string[], pageType?: string, sourceUrl?: string): string {
  const headingsText = headings.length > 0 ? headings.join('\n') : 'None';
  const sectionsText = sections.length > 0
    ? sections.map((section, index) => {
        const heading = section.heading ? ` heading="${section.heading}"` : '';
        const className = section.class ? ` class="${section.class}"` : '';
        const id = section.id ? ` id="${section.id}"` : '';
        const text = section.textPreview || section.text || 'No text';
        const linkCount = (section.links || []).length;
        const imageCount = (section.images || []).length;
        return `[${typeof section.sourceIndex === 'number' ? section.sourceIndex : index}]${heading}${className}${id} links=${linkCount} images=${imageCount} text="${text}"`;
      }).join('\n')
    : 'None';
  const navbarText = navbarLinks && navbarLinks.length > 0 ? navbarLinks.join(', ') : 'None detected';

  const pageTypeInstructions = `
CRITICAL INSTRUCTION: You MUST classify EVERY section provided. Do not skip or merge sections.
Each [N] in the Sections list below is a distinct detected section and must produce exactly one entry in your output array.
If a section's purpose is unclear, classify it as "features" — never omit it.

Page type detected: ${pageType?.toUpperCase() || 'UNKNOWN'}${sourceUrl ? ` (${sourceUrl})` : ''}

Section classification rules:
- navbar: top navigation with links (check hasNavbar flag — if true, ALWAYS add navbar as first item)
- hero: large introductory banner, slideshow, or welcome section at the top of the page
- about: company info, history, mission, team description, "who we are" content  
- features: services, courses, programs, products, capabilities, what-we-offer sections
- services: same as features — use this if the word "service" appears in the section
- testimonials: student/customer reviews, quotes, feedback, "what they say" sections
- gallery: photo grids, image collections, campus/event photos, portfolio items
- cta: call-to-action banners, "register now", "get started", enrollment prompts
- blog: news articles, blog posts, announcements, latest updates
- contact: contact forms, address/phone/email info, "reach us" sections
- footer: bottom of page with copyright, links, social media (check hasFooter flag)

IMPORTANT: A homepage for an education/academy site should typically have:
navbar → hero → features (courses) → about → testimonials → gallery → cta → footer
Do not omit sections that clearly exist in the input.`;

  return `You are an expert web designer.

Your job is to classify website content into common landing page sections.

Possible section types:
${VALID_SECTION_TYPES.join('\n')}
${pageTypeInstructions}

IMPORTANT RULES:
1. If navigation links are detected (hasNavbar=true), ALWAYS include "navbar" as the FIRST section
2. If footer is detected (hasFooter=true), ALWAYS include "footer" as the LAST section
3. Classify remaining sections based on their content and the page type
4. Match sections to what users expect on this type of page

Navigation links detected: ${navbarText}

Based on the headings and structure provided, classify the page into these sections.

Return ONLY JSON in this format:
{
  "sections": [
    {"type": "navbar", "text": "Navigation menu"},
    {"type": "hero", "text": "Example text"},
    {"type": "features", "text": "Example text"},
    {"type": "footer", "text": "Footer content"}
  ]
}

Here is the extracted structure:

Headings:
${headingsText}

Sections:
${sectionsText}

Detection flags:
- hasNavbar: ${hasNavbar || false}
- hasFooter: ${hasFooter || false}
- pageType: ${pageType || 'unknown'}
- sourceUrl: ${sourceUrl || 'unknown'}

RESPONSE RULES:
1. Output array length MUST equal the number of [N] sections listed above PLUS navbar (if hasNavbar=true) PLUS footer (if hasFooter=true)
2. Never output fewer sections than detected
3. Use "sourceIndex" field to match each output to its input [N] index
4. If hasNavbar is true and no navbar section is detected, prepend {"type":"navbar","text":"Navigation","sourceIndex":-1}
5. If hasFooter is true and no footer section is detected, append {"type":"footer","text":"Footer","sourceIndex":-2}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { headings, sections, hasNavbar, hasFooter, navbarLinks, pageType, sourceUrl }: ClassifyRequest = body;

    if (!headings || !Array.isArray(headings)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected "headings" array.' },
        { status: 400 }
      );
    }

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected "sections" array.' },
        { status: 400 }
      );
    }

    // Create prompt for AI with navbar/footer detection info and page type context
    const normalizedSections = normalizeSections(sections);
    const prompt = createPrompt(headings, normalizedSections, hasNavbar, hasFooter, navbarLinks, pageType, sourceUrl);

    // Send to DeepSeek AI
    let aiResponse: string;
    try {
      aiResponse = await generateAIResponse(prompt);
    } catch (apiError) {
      console.error('DeepSeek API error:', apiError);

      // Fallback: create basic classification with navbar and footer
      const fallbackSections: ClassifiedSection[] = [];

      // Always add navbar if detected
      if (hasNavbar) {
        fallbackSections.push({ type: 'navbar', text: 'Navigation menu' });
      }

      // Inject hero if missing — all pages should have a hero
      if (!fallbackSections.some(s => s.type === 'hero')) {
        fallbackSections.push({
          type: 'hero',
          text: headings[0] || 'Welcome',
          sourceIndex: -3
        });
      }

      // Add sections based on scraped detectedType (preferred) or fallback to inferSectionType
      normalizedSections.forEach((section, index) => {
        // Use detectedType from scraping if available (more accurate than text-based inference)
        const detectedType = section.detectedType;
        const sectionType = detectedType || inferSectionType(section.heading || section.textPreview || section.text || headings[index] || '');

        fallbackSections.push({
          type: sectionType,
          text: section.textPreview || section.text || section.heading || 'Content section',
          sourceIndex: section.sourceIndex,
        });
      });

      // Always add footer if detected
      if (hasFooter) {
        fallbackSections.push({ type: 'footer', text: 'Footer content' });
      }

      if (fallbackSections.length === 0) {
        if (hasNavbar) fallbackSections.push({ type: 'navbar', text: 'Navigation' });
        fallbackSections.push({ type: 'features', text: 'Content section' });
        if (hasFooter) fallbackSections.push({ type: 'footer', text: 'Footer' });
      }

      return NextResponse.json({ sections: normalizeStructuralSections(fallbackSections) });
    }

    // Parse AI response as JSON
    let result: ClassifyResponse;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);

      // Fallback to basic classification using detectedType from scraping
      const fallbackSections: ClassifiedSection[] = normalizedSections.map((section, index) => {
        // Use detectedType from scraping if available (more accurate than text-based inference)
        const detectedType = section.detectedType;
        const sectionType = detectedType || inferSectionType(section.heading || section.textPreview || section.text || headings[index] || '');

        return {
          type: sectionType,
          text: section.textPreview || section.text || section.heading || 'Content section',
          sourceIndex: section.sourceIndex,
        };
      });

      if (hasNavbar) {
        fallbackSections.unshift({ type: 'navbar', text: 'Navigation menu', sourceIndex: -1 });
      }
      if (!fallbackSections.some(s => s.type === 'hero')) {
        const insertAt = hasNavbar ? 1 : 0;
        fallbackSections.splice(insertAt, 0, { type: 'hero', text: headings[0] || 'Welcome', sourceIndex: -3 });
      }
      if (hasFooter) {
        fallbackSections.push({ type: 'footer', text: 'Footer content', sourceIndex: -2 });
      }

      return NextResponse.json({ sections: normalizeStructuralSections(fallbackSections) });
    }

    // Validate and normalize the response
    const validatedSections: ClassifiedSection[] = result.sections
      .filter((s) => s && typeof s.type === 'string' && typeof s.text === 'string')
      .map((s) => ({
        type: normalizeSectionType(s.type),
        text: s.text,
        sourceIndex: typeof s.sourceIndex === 'number' ? s.sourceIndex : undefined,
      }));

    // Diagnostic: log AI classification coverage
    console.log('[classify-sections] AI response sections:', validatedSections.map(s => s.type));
    console.log('[classify-sections] Scraped sections count:', normalizedSections.length);
    console.log('[classify-sections] AI classified count:', validatedSections.length);

    const bySourceIndex = new Map<number, ClassifiedSection>();
    for (const section of validatedSections) {
      if (typeof section.sourceIndex === 'number' && section.sourceIndex >= 0) {
        if (!bySourceIndex.has(section.sourceIndex)) {
          bySourceIndex.set(section.sourceIndex, section);
        }
      }
    }

    // Guarantee one classified output per scraped section index.
    let fallbackCount = 0;
    const sourceAlignedSections: ClassifiedSection[] = normalizedSections.map((section, index) => {
      const sourceIndex = typeof section.sourceIndex === 'number' ? section.sourceIndex : index;
      const existing = bySourceIndex.get(sourceIndex);
      if (existing) return existing;

      // Fallback to inferSectionType when AI didn't classify this section
      const fallbackText = section.textPreview || section.text || section.heading || 'Content section';
      const inferred = inferSectionType([section.heading, section.class, section.id, section.textPreview].filter(Boolean).join(' '));
      fallbackCount++;
      return {
        type: normalizeSectionType(inferred),
        text: fallbackText,
        sourceIndex,
      };
    });

    // Diagnostic: log fallback usage
    console.log('[classify-sections] Sections falling back to inferSectionType:', fallbackCount);

    const finalSections: ClassifiedSection[] = [];

    if (hasNavbar) {
      finalSections.push({ type: 'navbar', text: 'Navigation menu', sourceIndex: -1 });
    }

    finalSections.push(...sourceAlignedSections);

    // All pages should generally have a hero slot near the top.
    if (!sourceAlignedSections.some(s => s.type === 'hero')) {
      const insertAt = hasNavbar ? 1 : 0;
      finalSections.splice(insertAt, 0, { type: 'hero', text: headings[0] || 'Welcome', sourceIndex: -3 });
    }

    if (hasFooter) {
      finalSections.push({ type: 'footer', text: 'Footer content', sourceIndex: -2 });
    }

    // Diagnostic: log final classified sections
    console.log('[classify-sections] Final classified sections:', finalSections.map(s => s.type));

    return NextResponse.json({ sections: normalizeStructuralSections(finalSections) });
  } catch (error) {
    console.error('Error classifying sections:', error);
    return NextResponse.json(
      { error: 'Failed to classify sections' },
      { status: 500 }
    );
  }
}

// Fallback function to infer section type from heading text
function inferSectionType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('nav') || lower.includes('menu') || lower.includes('home')) return 'navbar';
  if (lower.includes('hero') || lower.includes('welcome')) return 'hero';
  if (lower.includes('about')) return 'about';
  if (lower.includes('feature') || lower.includes('service') || lower.includes('depart')) return 'features';
  if (lower.includes('testimon') || lower.includes('review')) return 'testimonials';
  if (lower.includes('contact')) return 'contact';
  if (lower.includes('footer')) return 'footer';
  if (lower.includes('gallery') || lower.includes('photo') || lower.includes('image')) return 'gallery';
  if (lower.includes('cta') || lower.includes('get started') || lower.includes('sign up') || lower.includes('join')) return 'cta';
  if (lower.includes('blog') || lower.includes('article') || lower.includes('news') || lower.includes('post')) return 'blog';
  return 'features';
}
