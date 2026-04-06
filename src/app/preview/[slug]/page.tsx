"use client";

import { useEffect, useState } from "react";
import { getComponentByName } from "@/lib/component-registry";
import type { LayoutItem } from "@/../lib/ai-layout-generator";
import {
  mapContentToSections,
  getComponentContentProps,
  getDefaultMappedContent,
  type MappedContent,
  type ExtractedContent
} from "@/../lib/content-injector";
import { isComponentDynamic } from "@/../lib/component-content-map";

export interface LayoutData {
  layout: LayoutItem[];
  content?: ExtractedContent | null;
  aiProps?: Record<string, Record<string, any>> | null;
}

// Fallback components for each section type (only dynamic ones)
const FALLBACK_COMPONENTS: Record<string, string> = {
  hero: "hero-action-dynamic",
  footer: "footer-simple",
  about: "about-brand-dynamic",
  blog: "blog-feed-dynamic",
  "company-story": "company-story-dynamic",
  "faq-process": "faq-process-dynamic",
  contact: "contact-form-dynamic",
  cta: "cta-banner-dynamic",
  navbar: "nav-float-dynamic",
  testimonials: "testi-client-dynamic",
  gallery: "gallery-album-dynamic",
  feature: "feature-detail-dynamic",
  benefits: "benefits-advantage-dynamic",
  features: "feature-element-dynamic",
};

/**
 * Get a safe fallback component for a given section type
 */
function getFallbackComponent(section: string): string {
  // Try to find a fallback based on section type
  const fallback = FALLBACK_COMPONENTS[section];
  if (fallback) {
    return fallback;
  }

  // Default fallbacks in order of preference (only dynamic components)
  const defaultFallbacks = ["hero-action-dynamic", "about-bio-dynamic", "blog-article-dynamic", "footer-simple"];
  return defaultFallbacks[0];
}

/**
 * Merge base props with AI-generated props.
 * AI props win over base props for text fields.
 * Base props are kept for non-text fields (images, functions, JSX).
 */
function mergeProps(
  base: Record<string, any>,
  aiGenerated: Record<string, any>,
  componentName: string
): Record<string, any> {
  const merged = { ...base };

  for (const [key, value] of Object.entries(aiGenerated)) {
    // Skip null/undefined AI values
    if (value === null || value === undefined) continue;

    // Handle nested content object (hero components use content.title etc.)
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      if (merged[parent] && typeof merged[parent] === 'object') {
        merged[parent] = { ...merged[parent], [child]: value };
      }
      continue;
    }

    // Only override with AI value if it's a non-empty string or array
    if (typeof value === 'string' && value.trim().length > 0) {
      merged[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      // Allow AI to inject all arrays including images and testimonials
      merged[key] = value;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      merged[key] = { ...(merged[key] || {}), ...value };
    }
  }

  console.log(`[mergeProps] ${componentName} — AI overrode:`,
    Object.keys(aiGenerated).filter(k => aiGenerated[k] !== null)
  );

  return merged;
}

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const [slug, setSlug] = useState<string>('index');
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [mappedContent, setMappedContent] = useState<MappedContent | null>(null);
  const [aiProps, setAiProps] = useState<Record<string, Record<string, any>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug || 'index');
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    // First verify the page is unlocked for viewing
    async function verifyUnlock() {
      try {
        const response = await fetch(`/api/verify-unlock?slug=${slug}`);
        const data = await response.json();
        
        if (!data.unlocked) {
          setError('This page has not been generated yet. Please analyze a website first.');
          setIsUnlocked(false);
          setLoading(false);
          return;
        }
        
        setIsUnlocked(true);
      } catch (err: any) {
        console.error('[PreviewPage] Unlock verification failed:', err);
        setError('Failed to verify page access');
        setIsUnlocked(false);
        setLoading(false);
      }
    }

    verifyUnlock();
  }, [slug]);

  useEffect(() => {
    if (!slug || isUnlocked === false) return;
    if (isUnlocked !== true) return; // Wait for unlock verification

    async function loadLayout() {
      try {
        console.log("[PreviewPage] Loading layout and content for page:", slug);
        const response = await fetch(`/api/generate-layout?slug=${slug}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load layout");
        }

        const data = await response.json();
        console.log("[PreviewPage] Layout loaded:", data);
        console.log("[PreviewPage] data.content exists:", !!data.content);
        console.log("[PreviewPage] Raw content images:", data.content?.images?.length || 0);
        console.log("[PreviewPage] Sections:", data.layout?.map((l: LayoutItem) => l.section));

        const layoutData = { ...data, layout: data.layout || [] };
        setLayout(layoutData);

        // Set AI props if available
        if (data.aiProps) {
          console.log('[PreviewPage] AI props loaded for components:', Object.keys(data.aiProps));
          setAiProps(data.aiProps);
        }

        // Map extracted content to component props
        if (layoutData.layout) {
          const content = data.content || {};
          const sectionTypes = layoutData.layout.map((item: LayoutItem) => item.section);

          if (data.content) {
            console.log("[PreviewPage] Using extracted content from website");
            console.log("[PreviewPage] Content has images:", data.content.images?.length || 0);
            const mapped = mapContentToSections(content, sectionTypes, layoutData.layout);
            console.log("[PreviewPage] Mapped hero image:", mapped.hero?.image);
            setMappedContent(mapped);
          } else {
            // Content not ready yet - retry after delay
            console.warn("[PreviewPage] Content not ready yet, retrying...");

            setTimeout(async () => {
              try {
                const retryRes = await fetch(`/api/generate-layout?slug=${slug}`, { cache: "no-store" });
                const retryData = await retryRes.json();

                if (retryData.content) {
                  console.log("[PreviewPage] Retry successful, content loaded");
                  console.log("[PreviewPage] Retry content images:", retryData.content?.images?.length || 0);
                  const mapped = mapContentToSections(retryData.content, sectionTypes);
                  console.log("[PreviewPage] Mapped hero image (retry):", mapped.hero?.image);
                  setMappedContent(mapped);
                } else {
                  console.warn("[PreviewPage] Retry failed, using defaults");
                  setMappedContent(getDefaultMappedContent());
                }
              } catch (retryErr: any) {
                console.error("[PreviewPage] Retry error:", retryErr.message);
                setMappedContent(getDefaultMappedContent());
              }
            }, 1000); // retry after 1 second

            // Use defaults temporarily
            console.log("[PreviewPage] Using default content temporarily");
            setMappedContent(getDefaultMappedContent());
          }
        } else {
          console.log("[PreviewPage] No layout found, using defaults");
          setMappedContent(getDefaultMappedContent());
        }

        // Log AI-selected components
        if (data.layout) {
          console.log("[PreviewPage] === AI-Selected Components ===");
          data.layout.forEach((item: LayoutItem) => {
            console.log(`  Section: ${item.section} → Component: ${item.component}`);
          });
          console.log("[PreviewPage] =========================================");
        }
      } catch (err: any) {
        console.error("[PreviewPage] Error loading layout:", err);
        setError(err.message || "Failed to load generated page");
      } finally {
        setLoading(false);
      }
    }

    loadLayout();
  }, [slug, isUnlocked]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading your AI-generated page...</p>
        </div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">
            No Layout Found
          </h2>
          <p className="text-muted-foreground">
            {error || "Please analyze a website first to generate a layout."}
          </p>
          <a
            href="/preview"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  // Use default content if not available
  const contentToUse = mappedContent || getDefaultMappedContent();

  // Filter out non-dynamic components (components that don't accept props)
  const filteredLayout = layout.layout.filter((item) => {
    const isDynamic = isComponentDynamic(item.component);
    if (!isDynamic) {
      console.warn(`[PreviewPage] Skipping non-dynamic component: ${item.component} for section ${item.section}`);
    }
    return isDynamic;
  });

  if (filteredLayout.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-800 dark:bg-yellow-900/20">
          <h2 className="mb-2 text-xl font-semibold text-yellow-600 dark:text-yellow-400">
            No Dynamic Components
          </h2>
          <p className="text-muted-foreground">
            The generated layout contains only static components. Please try analyzing a different website.
          </p>
          <a
            href="/preview"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {filteredLayout.map((item, index) => {
        // Try to get the requested component
        let Component = getComponentByName(item.component);
        let usedFallback = false;
        let componentName = item.component;

        // If component not found, try fallback
        if (!Component) {
          console.warn(`[PreviewPage] Component "${item.component}" not found, using fallback`);
          const fallbackComponent = getFallbackComponent(item.section);
          Component = getComponentByName(fallbackComponent);
          usedFallback = true;
          componentName = fallbackComponent;

          // If fallback also fails, try the first available default
          if (!Component) {
            const defaultFallback = getFallbackComponent("default");
            Component = getComponentByName(defaultFallback);
            componentName = defaultFallback;
            console.warn(`[PreviewPage] Using default fallback: ${defaultFallback}`);
          }
        }

        // If still no component, render error placeholder
        if (!Component) {
          console.error(`[PreviewPage] All fallbacks failed for "${item.component}"`);
          return (
            <div
              key={`${item.section}-${index}`}
              className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-muted p-8 text-muted-foreground"
            >
              <div className="text-center">
                <p className="font-medium">Unable to load component</p>
                <p className="text-sm">Requested: {item.component}</p>
              </div>
            </div>
          );
        }

        console.log(
          `[PreviewPage] Rendering ${componentName}${usedFallback ? " (fallback)" : ""} for ${item.section}`
        );

        // Merge: AI props take priority over rule-based props
        const baseProps = getComponentContentProps(
          componentName,
          item.section,
          contentToUse
        );
        // Try original component name first (from layout), then the possibly-fallback componentName
        const componentAiProps = aiProps?.[item.component] || aiProps?.[componentName] || {};

        // Deep merge: AI props override base props
        const contentProps = mergeProps(baseProps, componentAiProps, componentName);

        // Debug log before rendering each component
        console.log("[FINAL DEBUG]", {
          section: item.section,
          component: componentName,
          images: contentProps.images?.length,
          items: contentProps.items?.length
        });

        // Render component with injected content props
        return (
          <div key={`${item.section}-${index}`}>
            <Component {...contentProps} />
          </div>
        );
      })}
    </div>
  );
}
