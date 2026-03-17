import { NextRequest, NextResponse } from 'next/server';
import { generateLayoutWithAI, loadLayout, loadContent, saveContent, type PageStructure, type ExtractedContent } from '@/../lib/ai-layout-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections, content, regenerate } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid request. "sections" array is required.' },
        { status: 400 }
      );
    }

    console.log('[API /generate-layout] Received sections:', sections);
    console.log('[API /generate-layout] Received content:', content ? 'yes' : 'no');

    const pageStructure: PageStructure = { sections };

    // Save content if provided
    if (content) {
      console.log('[API /generate-layout] Saving extracted content...');
      saveContent(content as ExtractedContent);
    }

    // If regenerate is true, generate new layout. Otherwise, try to load existing.
    if (regenerate === true) {
      console.log('[API /generate-layout] Generating new layout with AI...');
      const layout = await generateLayoutWithAI(pageStructure);

      return NextResponse.json({
        status: 'success',
        layout: layout.layout,
        message: 'Layout generated successfully by AI',
      });
    } else {
      // Try to load existing layout first
      try {
        const existingLayout = await loadLayout();
        console.log('[API /generate-layout] Using existing layout');

        return NextResponse.json({
          status: 'success',
          layout: existingLayout.layout,
          message: 'Using existing layout',
        });
      } catch (loadError: any) {
        // If no existing layout, generate new one
        console.log('[API /generate-layout] No existing layout found, generating new one...');
        const layout = await generateLayoutWithAI(pageStructure);

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

export async function GET() {
  try {
    const layout = await loadLayout();
    const content = await loadContent();

    return NextResponse.json({
      status: 'success',
      layout: layout.layout,
      content: content || null,
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
