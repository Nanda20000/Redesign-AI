import { NextRequest, NextResponse } from 'next/server';

interface DiscoveredPage {
  url: string;
  slug: string;
  type: 'home' | 'about' | 'contact' | 'services' | 'blog' | 'gallery' | 'pricing' | 'other';
  title: string;
}

export async function POST(request: NextRequest) {
  const { baseUrl, internalLinks }: { baseUrl: string; internalLinks: string[] } = await request.json();
  
  if (!baseUrl || !internalLinks) {
    return NextResponse.json({ error: 'baseUrl and internalLinks are required' }, { status: 400 });
  }
  
  const pages: DiscoveredPage[] = [];
  
  // Always include homepage
  pages.push({
    url: baseUrl,
    slug: 'index',
    type: 'home',
    title: 'Home',
  });
  
  // Classify each internal link
  for (const link of internalLinks) {
    const pathname = new URL(link).pathname.replace(/\/$/, ''); // strip trailing slash
    if (!pathname || pathname === '/') continue; // skip homepage, already added
    
    // Generate a slug from the pathname
    const slug = pathname.replace(/^\//, '').replace(/\//g, '-') || 'page';
    
    // Classify by pathname keywords
    const lower = pathname.toLowerCase();
    let type: DiscoveredPage['type'] = 'other';
    let title = slug.replace(/-/g, ' ');
    
    if (/about|story|team|who-we-are/.test(lower)) { type = 'about'; title = 'About'; }
    else if (/contact|reach|touch|enquir/.test(lower)) { type = 'contact'; title = 'Contact'; }
    else if (/service|solution|offer|what-we-do/.test(lower)) { type = 'services'; title = 'Services'; }
    else if (/blog|news|article|post|insight/.test(lower)) { type = 'blog'; title = 'Blog'; }
    else if (/gallery|portfolio|work|project/.test(lower)) { type = 'gallery'; title = 'Gallery'; }
    else if (/pric|plan|package/.test(lower)) { type = 'pricing'; title = 'Pricing'; }
    
    // Skip duplicate slugs
    if (pages.some(p => p.slug === slug)) continue;
    
    pages.push({ url: link, slug, type, title });
  }
  
  return NextResponse.json({ pages });
}
