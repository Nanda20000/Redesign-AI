/**
 * Image Distributor
 * Single source of truth for distributing extracted website images
 * across all sections and components.
 *
 * Design principles:
 * - No module-level state (no global cursor)
 * - Random selection from the full pool so images don't repeat
 *   in a predictable pattern
 * - Falls back to Unsplash placeholders when pool is exhausted
 * - Adding a new component requires zero changes here
 */

export interface RawImage {
  src: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800',
  'https://images.unsplash.com/photo-1557682260-940c94d5340c?w=800',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
];

/**
 * Filter out images that are likely icons or tiny SVGs.
 * Keep only images that are large enough to be used as section images.
 */
function filterUsableImages(images: RawImage[]): RawImage[] {
  return images.filter(img => {
    const src = img.src.toLowerCase();
    // Skip SVG icons, tiny images, data URIs
    if (src.endsWith('.svg')) return false;
    if (src.startsWith('data:')) return false;
    // Skip images that are clearly logos/icons by size
    if (img.width && img.height) {
      if (img.width < 100 || img.height < 100) return false;
    }
    return true;
  });
}

/**
 * Shuffle an array using Fisher-Yates algorithm.
 * Returns a NEW array — does not mutate input.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick N images from the pool starting at cursor.
 * Wraps around if pool is smaller than needed.
 * Falls back to placeholders if pool is empty.
 */
function pickImages(
  pool: RawImage[],
  count: number,
  cursor: number
): { srcs: string[]; nextCursor: number } {
  if (count === 0) return { srcs: [], nextCursor: cursor };

  const srcs: string[] = [];
  let c = cursor;

  if (pool.length === 0) {
    for (let i = 0; i < count; i++) {
      srcs.push(FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]);
    }
    return { srcs, nextCursor: cursor };
  }

  for (let i = 0; i < count; i++) {
    srcs.push(pool[c % pool.length].src);
    c++;
  }

  return { srcs, nextCursor: c };
}

export interface SectionImageAllocation {
  componentName: string;
  section: string;
  images: string[];
}

/**
 * Main distribution function.
 * Takes the raw image pool and a list of layout items,
 * returns a map of section → images[].
 *
 * Usage:
 *   const allocation = distributeImages(rawImages, layout);
 *   const heroImages = allocation['hero'];     // string[]
 *   const featureImages = allocation['features']; // string[]
 */
export function distributeImages(
  rawImages: RawImage[],
  layout: Array<{ section: string; component: string }>
): Record<string, string[]> {
  const usableImages = filterUsableImages(rawImages);

  // Shuffle once so distribution is varied across page loads
  const pool = shuffle(usableImages);

  const result: Record<string, string[]> = {};
  let cursor = 0;

  for (const item of layout) {
    const { getComponentImageConfig } = require('./component-image-map');
    const config = getComponentImageConfig(item.component);

    if (config.imageMode === 'none' || config.imageCount === 0) {
      result[item.section] = [];
      continue;
    }

    const { srcs, nextCursor } = pickImages(pool, config.imageCount, cursor);
    result[item.section] = srcs;
    cursor = nextCursor;
  }

  return result;
}

/**
 * Get a single image for a section from the allocation map.
 * Returns empty string if not found.
 */
export function getSectionImage(
  allocation: Record<string, string[]>,
  section: string,
  index = 0
): string {
  return allocation[section]?.[index] ?? '';
}
