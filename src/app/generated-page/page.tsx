"use client";

import { useEffect, useState } from "react";
import { getComponentByName } from "@/lib/component-registry";
import {
  mapContentToSections,
  getComponentContentProps,
  getDefaultMappedContent,
  type LayoutItem,
  type MappedContent,
  type ExtractedContent
} from "@/../lib/content-injector";
import { summariseContent, type SectionTextContent } from "@/../lib/content-summariser";

export interface LayoutData {
  layout: LayoutItem[];
  content?: ExtractedContent | null;
}

// Fallback components for each section type
const FALLBACK_COMPONENTS: Record<string, string> = {
  hero: "hero-simple",
  navbar: "navbar-minimal",
  features: "features-grid",
  testimonials: "testimonial-cards",
  pricing: "pricing-cards",
  contact: "contact-form",
  footer: "footer-simple",
  about: "about-two-column",
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
  
  // Default fallbacks in order of preference
  const defaultFallbacks = ["features-grid", "hero-simple", "navbar-minimal", "footer-simple"];
  return defaultFallbacks[0];
}

export default function GeneratedPage() {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [mappedContent, setMappedContent] = useState<MappedContent | null>(null);
  const [summarisedContent, setSummarisedContent] = useState<SectionTextContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLayout() {
      try {
        console.log("[GeneratedPage] Loading layout and content...");
        const response = await fetch("/api/generate-layout", {
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load layout");
        }

        const data = await response.json();
        console.log("[GeneratedPage] Layout loaded:", data);
        console.log("[GeneratedPage] data.content exists:", !!data.content);
        console.log("[GeneratedPage] Raw content images:", data.content?.images?.length || 0);
        console.log("[GeneratedPage] Sections:", data.layout?.map((l: LayoutItem) => l.section));

        const seen = new Set<string>();
        const deduplicatedLayout = (data.layout || []).filter((item: LayoutItem) => {
          if (seen.has(item.section)) {
            console.warn(`[GeneratedPage] Duplicate section removed: ${item.section}`);
            return false;
          }
          seen.add(item.section);
          return true;
        });
        const layoutData = { ...data, layout: deduplicatedLayout };
        setLayout(layoutData);

        // Map extracted content to component props
        if (layoutData.layout) {
          const content = data.content || {};
          const sectionTypes = layoutData.layout.map((item: LayoutItem) => item.section);

          if (data.content) {
            console.log("[GeneratedPage] Using extracted content from website");
            console.log("[GeneratedPage] Content has images:", data.content.images?.length || 0);
            const mapped = mapContentToSections(content, sectionTypes, layoutData.layout);
            console.log("[GeneratedPage] Mapped hero image:", mapped.hero?.image);
            console.log("[GeneratedPage] Mapped features images:", mapped.features?.images?.length || 0);
            setMappedContent(mapped);

            // Compute summarised text content for dynamic prop injection
            const rawForSummarise = {
              headings: data.content?.headings || [],
              paragraphs: data.content?.paragraphs || [],
              navigationLinks: data.content?.navigationLinks || [],
              footerText: data.content?.footerText,
              contactInfo: data.content?.contactInfo,
              processed: data.content?.processed,
            };
            setSummarisedContent(summariseContent(rawForSummarise));
          } else {
            // Content not ready yet - retry after delay
            console.warn("[GeneratedPage] Content not ready yet, retrying...");

            setTimeout(async () => {
              try {
                const retryRes = await fetch("/api/generate-layout", { cache: "no-store" });
                const retryData = await retryRes.json();

                if (retryData.content) {
                  console.log("[GeneratedPage] Retry successful, content loaded");
                  console.log("[GeneratedPage] Retry content images:", retryData.content?.images?.length || 0);
                  const mapped = mapContentToSections(retryData.content, sectionTypes);
                  console.log("[GeneratedPage] Mapped hero image (retry):", mapped.hero?.image);
                  setMappedContent(mapped);

                  // Compute summarised text content for dynamic prop injection
                  const rawForSummarise = {
                    headings: retryData.content?.headings || [],
                    paragraphs: retryData.content?.paragraphs || [],
                    navigationLinks: retryData.content?.navigationLinks || [],
                    footerText: retryData.content?.footerText,
                    contactInfo: retryData.content?.contactInfo,
                    processed: retryData.content?.processed,
                  };
                  setSummarisedContent(summariseContent(rawForSummarise));
                } else {
                  console.warn("[GeneratedPage] Retry failed, using defaults");
                  setMappedContent(getDefaultMappedContent());
                }
              } catch (retryErr: any) {
                console.error("[GeneratedPage] Retry error:", retryErr.message);
                setMappedContent(getDefaultMappedContent());
              }
            }, 1000); // retry after 1 second

            // Use defaults temporarily
            console.log("[GeneratedPage] Using default content temporarily");
            setMappedContent(getDefaultMappedContent());
          }
        } else {
          console.log("[GeneratedPage] No layout found, using defaults");
          setMappedContent(getDefaultMappedContent());
        }

        // Log AI-selected components
        if (data.layout) {
          console.log("[GeneratedPage] === AI-Selected Components ===");
          data.layout.forEach((item: LayoutItem) => {
            console.log(`  Section: ${item.section} → Component: ${item.component}`);
          });
          console.log("[GeneratedPage] =========================================");
        }
      } catch (err: any) {
        console.error("[GeneratedPage] Error loading layout:", err);
        setError(err.message || "Failed to load generated page");
      } finally {
        setLoading(false);
      }
    }

    loadLayout();
  }, []);

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
            href="/"
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

  return (
    <div className="min-h-screen bg-background">
      {layout.layout.map((item, index) => {
        // Try to get the requested component
        let Component = getComponentByName(item.component);
        let usedFallback = false;
        let componentName = item.component;

        // If component not found, try fallback
        if (!Component) {
          console.warn(`[GeneratedPage] Component "${item.component}" not found, using fallback`);
          const fallbackComponent = getFallbackComponent(item.section);
          Component = getComponentByName(fallbackComponent);
          usedFallback = true;
          componentName = fallbackComponent;

          // If fallback also fails, try the first available default
          if (!Component) {
            const defaultFallback = getFallbackComponent("default");
            Component = getComponentByName(defaultFallback);
            componentName = defaultFallback;
            console.warn(`[GeneratedPage] Using default fallback: ${defaultFallback}`);
          }
        }

        // If still no component, render error placeholder
        if (!Component) {
          console.error(`[GeneratedPage] All fallbacks failed for "${item.component}"`);
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
          `[GeneratedPage] Rendering ${componentName}${usedFallback ? " (fallback)" : ""} for ${item.section}`
        );

        // Get content props for this component
        const contentProps = getComponentContentProps(
          componentName,
          item.section,
          contentToUse,
          summarisedContent || undefined
        );

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
