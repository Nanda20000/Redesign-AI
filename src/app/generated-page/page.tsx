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

export interface LayoutData {
  layout: LayoutItem[];
  content?: ExtractedContent | null;
}

export default function GeneratedPage() {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [mappedContent, setMappedContent] = useState<MappedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLayout() {
      try {
        console.log("[GeneratedPage] Loading layout and content...");
        const response = await fetch("/api/generate-layout");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load layout");
        }

        const data = await response.json();
        console.log("[GeneratedPage] Layout loaded:", data);
        setLayout(data);

        // Map extracted content to component props
        if (data.content) {
          console.log("[GeneratedPage] Using extracted content from website");
          const sectionTypes = data.layout.map((item: LayoutItem) => item.section);
          const mapped = mapContentToSections(data.content, sectionTypes);
          setMappedContent(mapped);
        } else {
          console.log("[GeneratedPage] No extracted content, using defaults");
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
        const Component = getComponentByName(item.component);

        if (!Component) {
          console.warn(`[GeneratedPage] Component "${item.component}" not found`);
          return (
            <div
              key={`${item.section}-${index}`}
              className="flex items-center justify-center p-8 text-muted-foreground"
            >
              Component &quot;{item.component}&quot; not found
            </div>
          );
        }

        console.log(`[GeneratedPage] Rendering ${item.component} for ${item.section} with injected content`);

        // Get content props for this component
        const contentProps = getComponentContentProps(
          item.component,
          item.section,
          contentToUse
        );

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
