import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { getUnlockedSlugs } from '../../../../lib/session-manager';

export interface PreviewPageMeta {
  slug: string;
  title: string;
  type: string;
  url?: string;
  sections: string[];
  components: string[];
  generatedAt?: string;
}

export async function GET() {
  const generatedPagesDir = path.join(process.cwd(), 'generated-pages');

  if (!fs.existsSync(generatedPagesDir)) {
    return NextResponse.json({ pages: [] });
  }

  // Get only unlocked slugs - pages that have been properly generated
  const unlockedSlugs = getUnlockedSlugs();
  
  const pages: PreviewPageMeta[] = [];

  for (const slug of unlockedSlugs) {
    const slugDir = path.join(generatedPagesDir, slug);
    const layoutPath = path.join(slugDir, 'layout.json');
    const metaPath = path.join(slugDir, 'meta.json');

    if (!fs.existsSync(layoutPath)) continue;

    let sections: string[] = [];
    let components: string[] = [];

    try {
      const layout = JSON.parse(fs.readFileSync(layoutPath, 'utf-8'));
      sections = (layout.layout || []).map((item: any) => item.section);
      components = (layout.layout || []).map((item: any) => item.component);
    } catch {}

    let meta: any = {};
    if (fs.existsSync(metaPath)) {
      try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')); } catch {}
    }

    // Infer title and type from slug if no meta
    const slugToTitle = (s: string) => s === 'index' ? 'Home' : s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const slugToType = (s: string) => {
      if (s === 'index') return 'home';
      if (/about/.test(s)) return 'about';
      if (/contact/.test(s)) return 'contact';
      if (/service/.test(s)) return 'services';
      if (/blog|news/.test(s)) return 'blog';
      if (/gallery|portfolio/.test(s)) return 'gallery';
      if (/pric/.test(s)) return 'pricing';
      return 'other';
    };

    pages.push({
      slug,
      title: meta.title || slugToTitle(slug),
      type: meta.type || slugToType(slug),
      url: meta.sourceUrl || undefined,
      sections,
      components,
      generatedAt: meta.generatedAt || undefined,
    });
  }

  // Sort: index first, then alphabetically
  pages.sort((a, b) => {
    if (a.slug === 'index') return -1;
    if (b.slug === 'index') return 1;
    return a.slug.localeCompare(b.slug);
  });

  return NextResponse.json({ pages });
}
