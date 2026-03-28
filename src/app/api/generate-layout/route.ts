import { NextRequest, NextResponse } from 'next/server';
import { generateLayoutWithAI, loadLayout, loadContent, saveContent, type PageStructure, type ExtractedContent } from '@/../lib/ai-layout-generator';
import { generatePropsForLayout, type ExtractedWebsiteContent } from '@/../lib/ai-prop-injector';
import * as fs from 'fs';
import * as path from 'path';

const AI_PROPS_DIR = path.join(process.cwd(), 'generated-pages');

function getAiPropsPath(pageSlug: string): string {
  const safe = pageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') || 'index';
  return path.join(AI_PROPS_DIR, safe, 'ai-props.json');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections, content, regenerate, pageSlug = 'index' } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid request. "sections" array is required.' },
        { status: 400 }
      );
    }

    console.log('[API /generate-layout] Received sections:', sections);
    console.log('[API /generate-layout] Received content:', content ? 'yes' : 'no');
    console.log('[API /generate-layout] Page slug:', pageSlug);

    const pageStructure: PageStructure = { sections };

    // Save content if provided
    if (content) {
      console.log('[API /generate-layout] Saving extracted content...');
      console.log('[API /generate-layout] Content images count:', content.images?.length || 0);
      saveContent(content as ExtractedContent, pageSlug);
      console.log('[API /generate-layout] Content saved successfully');
    }

    // If regenerate is true, generate new layout. Otherwise, try to load existing.
    if (regenerate === true) {
      console.log('[API /generate-layout] Generating new layout with AI...');
      console.log('[API /generate-layout] Passing content to generateLayoutWithAI:', {
        hasImages: content?.images?.length > 0,
        imageCount: content?.images?.length || 0
      });
      const layout = await generateLayoutWithAI(pageStructure, content as ExtractedContent, pageSlug);

      // Generate AI props for all components in parallel
      if (content) {
        try {
          console.log('[generate-layout] Starting AI prop injection...');
          const aiContent: ExtractedWebsiteContent = {
            headings: content.headings || [],
            paragraphs: content.paragraphs || [],
            navigationLinks: content.navigationLinks || [],
            footerText: content.footerText,
            contactInfo: content.contactInfo,
            processed: content.processed as any,
            images: content.images || [],  // ADD THIS LINE
          };
          const aiProps = await generatePropsForLayout(layout.layout, aiContent);

          // Save AI props to file for the page renderer to use
          fs.writeFileSync(
            getAiPropsPath(pageSlug),
            JSON.stringify(aiProps, null, 2),
            'utf-8'
          );
          console.log('[generate-layout] AI props saved to:', getAiPropsPath(pageSlug));
        } catch (err: any) {
          console.error('[generate-layout] AI prop injection failed:', err.message);
          // Continue without AI props — page will use fallback content
        }
      }

      return NextResponse.json({
        status: 'success',
        layout: layout.layout,
        message: 'Layout generated successfully by AI',
      });
    } else {
      // Try to load existing layout first
      try {
        const existingLayout = await loadLayout(pageSlug);
        console.log('[API /generate-layout] Using existing layout for page:', pageSlug);

        return NextResponse.json({
          status: 'success',
          layout: existingLayout.layout,
          message: 'Using existing layout',
        });
      } catch (loadError: any) {
        // If no existing layout, generate new one
        console.log('[API /generate-layout] No existing layout found, generating new one...');
        const layout = await generateLayoutWithAI(pageStructure, undefined, pageSlug);

        return NextResponse.json({
          status: 'success',
          layout: layout.layout,
          message: 'Layout generated successfully by AI',
        });
      }
    }
  } catch (error: any) {
    console.error('[API /generate-layout] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate layout',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Accept both 'slug' (for preview route) and 'pageSlug' (legacy) query params
    const slug = searchParams.get('slug') || searchParams.get('pageSlug') || 'index';
    const listPages = searchParams.get('list') === 'true';

    // Handle list pages request
    if (listPages) {
      const { listGeneratedPages } = await import('@/../lib/ai-layout-generator');
      const pages = listGeneratedPages();
      return NextResponse.json({ status: 'success', pages });
    }

    const layout = await loadLayout(slug);
    const content = await loadContent(slug);

    // Load AI-generated props if available
    let aiProps = null;
    const aiPropsPath = getAiPropsPath(slug);
    if (fs.existsSync(aiPropsPath)) {
      try {
        aiProps = JSON.parse(fs.readFileSync(aiPropsPath, 'utf-8'));
      } catch {
        console.warn('[generate-layout] Could not load ai-props.json for page:', slug);
      }
    }

    console.log("[API /generate-layout] Returning images:", content?.images?.length || 0);
    console.log("[API /generate-layout] Page slug:", slug);

    return NextResponse.json({
      status: 'success',
      layout: layout.layout,
      content: content || null,
      aiProps: aiProps || null,
    });
  } catch (error: any) {
    console.error('[API /generate-layout] Error loading layout:', error);

    return NextResponse.json(
      {
        error: 'Layout not found',
        message: 'No layout has been generated yet. Call POST first.',
      },
      { status: 404 }
    );
  }
}
