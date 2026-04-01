import { NextRequest, NextResponse } from 'next/server';
import { isSlugUnlocked, getUnlockedSlugs } from '../../../../lib/session-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const listAll = searchParams.get('list') === 'true';

    // List all unlocked slugs
    if (listAll) {
      const unlockedSlugs = getUnlockedSlugs();
      return NextResponse.json({ 
        unlocked: true, 
        slugs: unlockedSlugs 
      });
    }

    // Check specific slug
    if (!slug) {
      return NextResponse.json({ 
        unlocked: false, 
        error: 'Slug parameter is required' 
      }, { status: 400 });
    }

    const unlocked = isSlugUnlocked(slug);
    
    return NextResponse.json({ 
      unlocked,
      slug 
    });
  } catch (error: any) {
    console.error('[verify-unlock] Error:', error);
    return NextResponse.json({ 
      unlocked: false, 
      error: 'Failed to verify unlock status' 
    }, { status: 500 });
  }
}
