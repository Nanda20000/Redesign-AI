import { NextRequest, NextResponse } from 'next/server';
import { generateLayoutWithAI, loadLayout, loadContent, saveContent, type PageStructure, type ExtractedContent } from '@/../lib/ai-layout-generator';
import { generatePropsForLayout, type ExtractedWebsiteContent } from '@/../lib/ai-prop-injector';
import { capturePreviewScreenshot } from '@/../lib/screenshot-capture';
import { unlockSlug } from '../../../../lib/session-manager';
import * as fs from 'fs';
import * as path from 'path';

const AI_PROPS_DIR = path.join(process.cwd(), 'generated-pages');

function getAiPropsPath(pageSlug: string): string {
  const safe = pageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') || 'index';
  return path.join(AI_PROPS_DIR, safe, 'ai-props.json');
}

function getGeneratedPageSlugsFromDisk(): string[] {
  const generatedPagesDir = path.join(process.cwd(), 'generated-pages');
  if (!fs.existsSync(generatedPagesDir)) return [];

  return fs.readdirSync(generatedPagesDir)
    .filter(name => {
      const fullPath = path.join(generatedPagesDir, name);
      return fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, 'layout.json'));
    })
    .sort((a, b) => {
      if (a === 'index') return -1;
      if (b === 'index') return 1;
      return a.localeCompare(b);
    });
}

/**
 * Get shared footer props from the index (homepage) ai-props
 * This ensures all pages share the same footer
 * Note: Only footer-simple is shared (no navbar in kept components)
 */
function getSharedNavbarFooterProps(indexSlug: string = 'index'): { 'footer-simple'?: any } {
  const indexPath = getAiPropsPath(indexSlug);

  if (!fs.existsSync(indexPath)) {
    return {};
  }

  try {
    const indexProps = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const shared: { 'footer-simple'?: any } = {};

    // Extract footer-simple props
    if (indexProps['footer-simple']) {
      shared['footer-simple'] = indexProps['footer-simple'];
    }

    return shared;
  } catch (err) {
    console.error('[generate-layout] Failed to load shared footer props:', err);
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sections, 
      content, 
      regenerate, 
      pageSlug = 'index',
      allPageSlugs,
    } = body;

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

      // Diagnostic: warn if hero is missing from generated layout
      const heroInLayout = layout.layout.find(item => item.section === 'hero');
      if (!heroInLayout) {
        console.warn('[generate-layout] WARN: Hero section missing from generated layout for page:', pageSlug);
        console.warn('[generate-layout] Input sections were:', sections);
        console.warn('[generate-layout] Final layout sections:', layout.layout.map(i => i.section));
      }

      // Generate AI props for all components in parallel
      if (content) {
        try {
          console.log('[generate-layout] Starting AI prop injection...');
          
          // Collect list of all generated page slugs for navbar filtering
          let availablePages: string[] = [];
          if (allPageSlugs && Array.isArray(allPageSlugs) && allPageSlugs.length > 0) {
            // Use the full list passed by the caller — includes pages not yet 
            // written to disk, so the navbar will have all tabs from the start.
            availablePages = allPageSlugs;
            console.log('[generate-layout] availablePages from caller:', availablePages);
          } else {
            // Fallback: scan disk
            const generatedPagesDir = path.join(process.cwd(), 'generated-pages');
            if (fs.existsSync(generatedPagesDir)) {
              availablePages = fs.readdirSync(generatedPagesDir)
                .filter(name => 
                  fs.statSync(path.join(generatedPagesDir, name)).isDirectory()
                )
                .filter(slug => 
                  fs.existsSync(path.join(generatedPagesDir, slug, 'layout.json'))
                );
            }
            console.log('[generate-layout] availablePages from disk:', availablePages);
          }
          
          const aiContent: ExtractedWebsiteContent = {
            headings: content.headings || [],
            paragraphs: content.paragraphs || [],
            navigationLinks: content.navigationLinks || [],
            footerText: content.footerText,
            contactInfo: content.contactInfo,
            processed: content.processed as any,
            images: content.images || [],
            sectionSequence: content.sectionSequence || [],
            sectionBuckets: content.sectionBuckets || {},
            availablePages, // Pass available pages for navbar filtering
          };
          const aiProps = await generatePropsForLayout(layout.layout, aiContent);

          // Save AI props to file for the page renderer to use
          fs.writeFileSync(
            getAiPropsPath(pageSlug),
            JSON.stringify(aiProps, null, 2),
            'utf-8'
          );
          console.log('[generate-layout] AI props saved to:', getAiPropsPath(pageSlug));

          // Capture screenshot with delay and retry mechanism for pages 3+
          const screenshotDelay = 8000; // 8 seconds for page to be ready
          setTimeout(async () => {
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
              attempts++;
              try {
                const screenshotPath = await capturePreviewScreenshot({ 
                  pageSlug,
                  timeout: 45000 
                });
                if (screenshotPath) {
                  console.log(`[generate-layout] Screenshot captured on attempt ${attempts}:`, screenshotPath);
                  break;
                }
              } catch (err: any) {
                console.error(`[generate-layout] Screenshot attempt ${attempts} failed:`, err.message);
                if (attempts < maxAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 5000 * attempts));
                }
              }
            }
          }, screenshotDelay);
        } catch (err: any) {
          console.error('[generate-layout] AI prop injection failed:', err.message);
          // Continue without AI props — page will use fallback content
        }
      }

      // Save meta.json for the preview sitemap
      const pageDir = path.join(process.cwd(), 'generated-pages', pageSlug);
      const metaPath = path.join(pageDir, 'meta.json');
      const meta = {
        slug: pageSlug,
        title: pageSlug === 'index' ? 'Home' : pageSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        type: pageSlug === 'index' ? 'home' : 'other',
        sourceUrl: (content as any)?.sourceUrl || null,
        generatedAt: new Date().toISOString(),
      };
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
      }
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
      console.log('[generate-layout] Meta saved to:', metaPath);

      // Unlock this slug for viewing - marks page as ready for preview access
      unlockSlug(pageSlug);
      console.log('[generate-layout] Page unlocked for preview:', pageSlug);

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

    // For non-index pages, merge shared footer from index page
    if (slug !== 'index' && aiProps) {
      const sharedProps = getSharedNavbarFooterProps('index');
      if (Object.keys(sharedProps).length > 0) {
        aiProps = {
          ...aiProps,
          ...sharedProps,
        };
        console.log('[generate-layout] Merged shared footer props for page:', slug);
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
