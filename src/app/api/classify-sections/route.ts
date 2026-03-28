import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '../../../../lib/ai';

interface ClassifiedSection {
  type: string;
  text: string;
}

interface ClassifyRequest {
  headings: string[];
  sections: string[];
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

function createPrompt(headings: string[], sections: string[], hasNavbar?: boolean, hasFooter?: boolean, navbarLinks?: string[], pageType?: string, sourceUrl?: string): string {
  const headingsText = headings.length > 0 ? headings.join('\n') : 'None';
  const sectionsText = sections.length > 0 ? sections.join('\n') : 'None';
  const navbarText = navbarLinks && navbarLinks.length > 0 ? navbarLinks.join(', ') : 'None detected';

  // Determine expected sections based on page type
  const pageTypeInstructions = pageType ? `
IMPORTANT: This is a ${pageType.toUpperCase()} page${sourceUrl ? ` at ${sourceUrl}` : ''}.
Only include sections that would appear on this specific page type:
- A contact page should have: navbar, hero (with contact title), contact form, footer
- An about page should have: navbar, hero, about, team/gallery, testimonials (if mentioned), footer
- A services page should have: navbar, hero, features/services, testimonials (if mentioned), cta, footer
- A homepage can have: navbar, hero, features, about, testimonials, gallery, cta, blog, footer
- A blog page should have: navbar, hero (with blog title), blog posts, footer
- A gallery/portfolio page should have: navbar, hero, gallery, footer

DO NOT include irrelevant sections. A contact page should NOT have a features section unless services are explicitly mentioned. An about page should NOT have a testimonials section unless content explicitly mentions client feedback.` : '';

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
- sourceUrl: ${sourceUrl || 'unknown'}`;
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
    const prompt = createPrompt(headings, sections, hasNavbar, hasFooter, navbarLinks, pageType, sourceUrl);

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
      
      // Add sections based on headings
      headings.forEach((heading) => {
        fallbackSections.push({
          type: inferSectionType(heading),
          text: heading,
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

      return NextResponse.json({ sections: fallbackSections });
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
      
      // Fallback to basic classification
      const fallbackSections: ClassifiedSection[] = headings.map((heading) => ({
        type: inferSectionType(heading),
        text: heading,
      }));
      
      return NextResponse.json({ sections: fallbackSections });
    }

    // Validate and normalize the response
    let validatedSections: ClassifiedSection[] = result.sections
      .filter((s) => s && typeof s.type === 'string' && typeof s.text === 'string')
      .map((s) => ({
        type: VALID_SECTION_TYPES.includes(s.type.toLowerCase())
          ? s.type.toLowerCase()
          : 'features',
        text: s.text,
      }));

    // Ensure navbar is first if detected but not in response
    const hasNavbarInResponse = validatedSections.some(s => s.type === 'navbar');
    const hasFooterInResponse = validatedSections.some(s => s.type === 'footer');
    
    if (hasNavbar && !hasNavbarInResponse) {
      validatedSections.unshift({ type: 'navbar', text: 'Navigation menu' });
    }
    
    if (hasFooter && !hasFooterInResponse) {
      validatedSections.push({ type: 'footer', text: 'Footer content' });
    }

    return NextResponse.json({ sections: validatedSections });
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
