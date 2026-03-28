'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PreviewPageMeta {
  slug: string;
  title: string;
  type: string;
  url?: string;
  sections: string[];
  components: string[];
  generatedAt?: string;
}

const TYPE_COLORS: Record<string, string> = {
  home: 'bg-blue-100 text-blue-700',
  about: 'bg-purple-100 text-purple-700',
  contact: 'bg-green-100 text-green-700',
  services: 'bg-orange-100 text-orange-700',
  blog: 'bg-yellow-100 text-yellow-700',
  gallery: 'bg-pink-100 text-pink-700',
  pricing: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-700',
};

const TYPE_ICONS: Record<string, string> = {
  home: '🏠',
  about: '👥',
  contact: '✉️',
  services: '⚙️',
  blog: '📝',
  gallery: '🖼️',
  pricing: '💰',
  other: '📄',
};

export default function PreviewSitemap() {
  const [pages, setPages] = useState<PreviewPageMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/preview-pages')
      .then(r => r.json())
      .then(data => setPages(data.pages || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent mx-auto" />
          <p className="text-zinc-500">Loading redesigned pages...</p>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-5xl">🗂️</div>
          <h1 className="text-2xl font-bold text-zinc-900">No redesigned pages yet</h1>
          <p className="mt-2 text-zinc-500">
            Go back to the homepage and analyze a website to get started.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Redesigned Pages</h1>
            <p className="text-sm text-zinc-500">{pages.length} page{pages.length !== 1 ? 's' : ''} generated</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            ← New Redesign
          </Link>
        </div>
      </header>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map(page => (
            <Link
              key={page.slug}
              href={`/preview/${page.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-zinc-300"
            >
              {/* Screenshot Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                <img
                  src={`/screenshots/preview-${page.slug}.png`}
                  alt={`${page.title} preview`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback placeholder if screenshot doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-placeholder')) {
                      parent.innerHTML = `
                        <div class="fallback-placeholder flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400">
                          <span class="text-4xl">📄</span>
                          <span class="mt-2 text-sm font-medium">No screenshot yet</span>
                        </div>
                      `;
                    }
                  }}
                />
              </div>

              {/* Bottom strip with title and link */}
              <div className="flex items-center justify-between border-t border-zinc-100 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[page.type] || TYPE_COLORS.other}`}>
                    {TYPE_ICONS[page.type] || '📄'}
                  </span>
                  <h2 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {page.title}
                  </h2>
                </div>
                <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  Preview →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
