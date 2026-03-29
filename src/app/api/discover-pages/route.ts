import { NextRequest, NextResponse } from 'next/server';

interface DiscoveredPage {
  url: string;
  slug: string;
  type: 'home' | 'about' | 'contact' | 'services' | 'blog' | 'gallery' | 'pricing' | 'other';
  title: string;
  navbarLabel?: string; // Original text from source website navbar
}

export async function POST(request: NextRequest) {
  const { baseUrl, internalLinks, navbarLinks }: { 
    baseUrl: string; 
    internalLinks: string[];
    navbarLinks?: string[];
  } = await request.json();

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
    let title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    let navbarLabel: string | undefined;

    // Try to match this URL to a navbar link text
    if (navbarLinks && navbarLinks.length > 0) {
      const pathSegment = pathname.split('/').pop() || '';
      const matchedNavLink = navbarLinks.find(navLink => {
        const navSlug = navLink.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const pathSlug = pathSegment.toLowerCase().replace(/[^a-z0-9-]/g, '');
        return navSlug === pathSlug || 
               navSlug.includes(pathSlug) || 
               pathSlug.includes(navSlug) ||
               navLink.toLowerCase().includes(pathSegment.toLowerCase()) ||
               pathSegment.toLowerCase().includes(navLink.toLowerCase().replace(/\s+/g, ''));
      });
      if (matchedNavLink) {
        navbarLabel = matchedNavLink;
        title = matchedNavLink.split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      }
    }

    // Fallback type inference if no navbar label matched
    if (!navbarLabel) {
      if (/about|story|team|who-we-are/.test(lower)) { type = 'about'; title = 'About'; }
      else if (/contact|reach|touch|enquir/.test(lower)) { type = 'contact'; title = 'Contact'; }
      else if (/service|solution|offer|what-we-do/.test(lower)) { type = 'services'; title = 'Services'; }
      else if (/blog|news|article|post|insight/.test(lower)) { type = 'blog'; title = 'Blog'; }
      else if (/gallery|portfolio|work|project/.test(lower)) { type = 'gallery'; title = 'Gallery'; }
      else if (/pric|plan|package/.test(lower)) { type = 'pricing'; title = 'Pricing'; }
    }

    // Skip duplicate slugs
    if (pages.some(p => p.slug === slug)) continue;

    pages.push({ url: link, slug, type, title, navbarLabel });
  }

  return NextResponse.json({ pages });
}
