import { NextRequest, NextResponse } from 'next/server';

interface PageToRedesign {
  url: string;
  slug: string;
  title: string;
  type: string;
}

interface RedesignResult {
  slug: string;
  url: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  componentsSelected?: string[];
}

// Redesign a single page by calling the existing analyze + generate pipeline
async function redesignPage(
  pageUrl: string,
  pageSlug: string,
  appUrl: string
): Promise<RedesignResult> {
  console.log(`[redesign-all-pages] Starting redesign for: ${pageUrl} → ${pageSlug}`);

  try {
    // Step 1: Analyze the page (scrape + classify sections + generate layout)
    const analyzeRes = await fetch(`${appUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: pageUrl, pageSlug }),
    });

    if (!analyzeRes.ok) {
      const errorData = await analyzeRes.json();
      throw new Error(errorData.message || `Analyze failed with status ${analyzeRes.status}`);
    }

    const analyzeData = await analyzeRes.json();

    if (analyzeData.status !== 'success') {
      throw new Error(analyzeData.message || 'Analyze returned non-success status');
    }

    // The analyze route already calls generate-layout internally with pageSlug
    // So by this point the layout and ai-props are already saved for this slug

    console.log(`[redesign-all-pages] Completed redesign for: ${pageSlug}`);

    return {
      slug: pageSlug,
      url: pageUrl,
      status: 'success',
      componentsSelected: analyzeData.layout?.map((item: any) => item.component) || [],
    };

  } catch (error: any) {
    console.error(`[redesign-all-pages] Failed for ${pageSlug}:`, error.message);
    return {
      slug: pageSlug,
      url: pageUrl,
      status: 'failed',
      error: error.message,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pages, concurrency = 1 } = body as {
      pages: PageToRedesign[];
      concurrency?: number;
    };

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { error: 'pages array is required and must not be empty' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const results: RedesignResult[] = [];

    console.log(`[redesign-all-pages] Starting redesign of ${pages.length} pages`);
    console.log(`[redesign-all-pages] Concurrency: ${concurrency} (sequential recommended)`);

    // Process pages sequentially to avoid overwhelming the AI API
    // and to prevent Playwright browser conflicts
    for (const page of pages) {
      const result = await redesignPage(page.url, page.slug, appUrl);
      results.push(result);

      // Brief pause between pages to be respectful to both
      // the target website and the DeepSeek API rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const succeeded = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'failed').length;

    console.log(`[redesign-all-pages] Complete. Success: ${succeeded}, Failed: ${failed}`);

    return NextResponse.json({
      status: 'success',
      summary: {
        total: pages.length,
        succeeded,
        failed,
        skipped: results.filter(r => r.status === 'skipped').length,
      },
      results,
    });

  } catch (error: any) {
    console.error('[redesign-all-pages] Orchestrator error:', error);
    return NextResponse.json(
      { error: `Orchestrator failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET endpoint to check redesign status across all pages
export async function GET() {
  try {
    const { listGeneratedPages } = await import('@/../lib/ai-layout-generator');
    const pages = listGeneratedPages();

    return NextResponse.json({
      status: 'success',
      pages,
      total: pages.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
