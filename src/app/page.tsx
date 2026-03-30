'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DiscoveredPage {
  url: string;
  slug: string;
  type: 'home' | 'about' | 'contact' | 'services' | 'blog' | 'gallery' | 'pricing' | 'other';
  title: string;
  navbarLabel?: string; // Original text from source website navbar
}

interface AnalyzeResult {
  status: string;
  classifiedSections?: Array<{ type: string; text: string }>;
  content?: any;
  internalLinks?: string[];
  screenshot?: string;
  message?: string;
  fallback?: boolean;
}

type Step = 'input' | 'discovering' | 'select' | 'generating' | 'done' | 'error';

const TYPE_ICONS: Record<string, string> = {
  home: '🏠', about: '👥', contact: '✉️',
  services: '⚙️', blog: '📝', gallery: '🖼️',
  pricing: '💰', other: '📄',
};

function normalizeStructuralSections(sectionTypes: string[]): string[] {
  const cleaned = sectionTypes.filter(Boolean);
  if (cleaned.length === 0) return [];

  const firstNavbarIndex = cleaned.findIndex((section) => section === 'navbar');
  const lastFooterIndex = [...cleaned].reverse().findIndex((section) => section === 'footer');
  const resolvedLastFooterIndex = lastFooterIndex >= 0 ? cleaned.length - 1 - lastFooterIndex : -1;

  return cleaned.filter((section, index) => {
    if (section === 'navbar') return index === firstNavbarIndex;
    if (section === 'footer') return index === resolvedLastFooterIndex;
    return true;
  });
}

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [discoveredPages, setDiscoveredPages] = useState<DiscoveredPage[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<{ current: number; total: number; currentPage: string }>({
    current: 0, total: 0, currentPage: '',
  });
  const [generatedSlugs, setGeneratedSlugs] = useState<string[]>([]);

  // ── Step 1: Analyze homepage + discover all pages ──
  const handleDiscover = async () => {
    if (!url.trim()) return;
    setStep('discovering');
    setErrorMessage('');

    try {
      // Analyze the main page first
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const analyzeData: AnalyzeResult = await analyzeRes.json();

      if (analyzeData.status !== 'success') {
        throw new Error(analyzeData.message || 'Failed to analyze website');
      }

      // Discover pages from internal links
      const discoverRes = await fetch('/api/discover-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: url,
          internalLinks: analyzeData.internalLinks || [],
          navbarLinks: analyzeData.content?.navigationLinks || [],
        }),
      });
      const discoverData = await discoverRes.json();
      const pages: DiscoveredPage[] = discoverData.pages || [];

      setDiscoveredPages(pages);
      // Pre-select all pages
      setSelectedSlugs(new Set(pages.map(p => p.slug)));
      setStep('select');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong');
      setStep('error');
    }
  };

  // ── Step 2: Toggle page selection ──
  const togglePage = (slug: string) => {
    setSelectedSlugs(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedSlugs.size === discoveredPages.length) {
      setSelectedSlugs(new Set());
    } else {
      setSelectedSlugs(new Set(discoveredPages.map(p => p.slug)));
    }
  };

  // ── Step 3: Generate redesigns for all selected pages ──
  const handleGenerateAll = async () => {
    const pagesToGenerate = discoveredPages.filter(p => selectedSlugs.has(p.slug));
    if (pagesToGenerate.length === 0) return;

    setStep('generating');
    setProgress({ current: 0, total: pagesToGenerate.length, currentPage: '' });
    const generated: string[] = [];

    for (let i = 0; i < pagesToGenerate.length; i++) {
      const page = pagesToGenerate[i];
      setProgress({ current: i + 1, total: pagesToGenerate.length, currentPage: page.title });

      try {
        // 1. Analyze the page
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: page.url,
            pageSlug: page.slug,
          }),
        });
        const analyzeData: AnalyzeResult = await analyzeRes.json();
        if (analyzeData.status !== 'success') continue;

        // 2. Generate layout with slug
        const sections = normalizeStructuralSections((analyzeData.classifiedSections || [])
          .map((s: any) => s.type)
          .filter(Boolean));
        const layoutRes = await fetch('/api/generate-layout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sections,
            content: analyzeData.content,
            regenerate: true,
            pageSlug: page.slug,
            allPageSlugs: pagesToGenerate.map(p => p.slug),
          }),
        });
        const layoutData = await layoutRes.json();
        if (layoutData.status === 'success') {
          generated.push(page.slug);
        }
      } catch (err) {
        console.error(`Failed to generate page: ${page.slug}`, err);
        // Continue to next page even if one fails
      }
    }

    // Second pass: refresh all navbars now that all pages are generated
    // so every page's navbar shows links to all other redesigned pages.
    if (generated.length > 1) {
      try {
        console.log('[Navbar refresh] Regenerating navbars for all pages...');
        await fetch('/api/generate-layout', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ allPageSlugs: generated }),
        });
        console.log('[Navbar refresh] Done');
      } catch (err) {
        console.warn('[Navbar refresh] Failed (non-critical):', err);
      }
    }

    setGeneratedSlugs(generated);
    setStep('done');
  };

  // ── Render ──

  if (step === 'input' || step === 'discovering') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <main className="flex w-full max-w-xl flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900">AI Website Redesign</h1>
            <p className="mt-2 text-zinc-500">Enter any website URL to discover and redesign all its pages</p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDiscover()}
              disabled={step === 'discovering'}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:opacity-50"
            />
            <button
              onClick={handleDiscover}
              disabled={step === 'discovering' || !url.trim()}
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 'discovering' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Discovering pages...
                </span>
              ) : 'Discover All Pages →'}
            </button>
          </div>

          {/* Link to existing previews */}
          <a
            href="/preview"
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            View previously redesigned pages →
          </a>
        </main>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md w-full rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-semibold text-red-600">Something went wrong</p>
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          <button
            onClick={() => setStep('input')}
            className="mt-4 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Pages Discovered</h1>
              <p className="text-sm text-zinc-500">{discoveredPages.length} pages found at {url}</p>
            </div>
            <button
              onClick={() => setStep('input')}
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              ← Start over
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-8">
          {/* Select all toggle */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={toggleAll}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 underline"
            >
              {selectedSlugs.size === discoveredPages.length ? 'Deselect all' : 'Select all'}
            </button>
            <span className="text-sm text-zinc-500">
              {selectedSlugs.size} of {discoveredPages.length} selected
            </span>
          </div>

          {/* Page selection grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {discoveredPages.map(page => {
              const selected = selectedSlugs.has(page.slug);
              return (
                <button
                  key={page.slug}
                  onClick={() => togglePage(page.slug)}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
                  }`}
                >
                  <span className="text-2xl">{TYPE_ICONS[page.type] || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{page.navbarLabel || page.title}</p>
                    <p className={`truncate text-xs mt-0.5 ${selected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      {page.navbarLabel ? page.title : page.url}
                    </p>
                  </div>
                  <div className={`h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                    selected ? 'border-white bg-white' : 'border-zinc-400'
                  }`}>
                    {selected && <span className="text-zinc-900 text-xs font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Generate button */}
          <div className="mt-8">
            <button
              onClick={handleGenerateAll}
              disabled={selectedSlugs.size === 0}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 font-semibold text-white text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ✨ Redesign {selectedSlugs.size} Page{selectedSlugs.size !== 1 ? 's' : ''} with AI
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'generating') {
    const percentage = progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-5xl">✨</div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900">Redesigning Pages</h2>
          <p className="mb-8 text-zinc-500">
            {progress.current} of {progress.total} pages complete
          </p>

          {/* Progress bar */}
          <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-sm text-zinc-500">
            {progress.currentPage && `Currently redesigning: ${progress.currentPage}`}
          </p>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900">
            {generatedSlugs.length} Page{generatedSlugs.length !== 1 ? 's' : ''} Redesigned
          </h2>
          <p className="mb-8 text-zinc-500">
            Your AI-generated redesigns are ready to preview.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="/preview"
              className="w-full rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Browse All Pages →
            </a>
            {generatedSlugs[0] && (
              <a
                href={`/preview/${generatedSlugs[0]}`}
                className="w-full rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                Preview Homepage First
              </a>
            )}
            <button
              onClick={() => { setStep('input'); setUrl(''); setDiscoveredPages([]); }}
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Redesign another website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
