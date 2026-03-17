"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExtractedContent } from "@/../lib/content-injector";

interface PageStructure {
  headings: string[];
  navigation: string[];
  sections: Array<{
    index: number;
    class?: string;
    id?: string;
    textPreview: string;
  }>;
}

interface ClassifiedSection {
  type: string;
  text: string;
}

interface LayoutItem {
  section: string;
  component: string;
}

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState<{
    status: string;
    message?: string;
    screenshot?: string;
    classifiedSections?: ClassifiedSection[];
    content?: ExtractedContent;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingLayout, setGeneratingLayout] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ status: "error", message: "Failed to analyze URL" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLayout = async () => {
    if (!response?.classifiedSections?.length) return;

    setGeneratingLayout(true);
    try {
      // Extract unique section types from classified sections
      const sections = Array.from(
        new Set(response.classifiedSections.map((s) => s.type))
      );

      console.log("[Home] Generating layout for sections:", sections);
      console.log("[Home] Content to inject:", response.content ? "yes" : "no");

      const res = await fetch("/api/generate-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sections, 
          content: response.content,
          regenerate: true 
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        console.log("[Home] Layout generated successfully!");
        console.log("[Home] AI-selected components:");
        data.layout.forEach((item: LayoutItem) => {
          console.log(`  - ${item.section}: ${item.component}`);
        });

        // Navigate to the generated page
        router.push("/generated-page");
      } else {
        setResponse({
          status: "error",
          message: data.error || "Failed to generate layout",
        });
      }
    } catch (error: any) {
      console.error("[Home] Error generating layout:", error);
      setResponse({
        status: "error",
        message: error.message || "Failed to generate layout",
      });
    } finally {
      setGeneratingLayout(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 py-16 px-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          AI Website Redesign Tool
        </h1>

        <div className="flex w-full max-w-md flex-col gap-4">
          <input
            type="url"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Analyzing..." : "Analyze Website"}
          </button>
        </div>

        {response && response.status === "success" && (
          <div className="mt-4 w-full space-y-6">
            {response.screenshot ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Screenshot captured:</p>
                <img
                  src={response.screenshot}
                  alt="Website screenshot"
                  className="mt-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            ) : response.fallback ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  ⚠️ Screenshot unavailable
                </p>
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                  {response.message || "Website blocked screenshot capture. Extracted structure from HTML instead."}
                </p>
              </div>
            ) : null}

            {response.classifiedSections && (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Detected Website Sections:</p>
                <div className="mt-2 space-y-2">
                  {response.classifiedSections.map((section, index) => (
                    <div
                      key={index}
                      className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">
                        {index + 1}. <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">{section.type}</span>
                      </p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {section.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {response && response.status === "error" && (
          <div className="mt-4 w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Error:</p>
            <p className="mt-1 text-sm text-red-500 dark:text-red-300">{response.message}</p>
          </div>
        )}

        {response && response.status === "success" && response.classifiedSections && (
          <div className="w-full max-w-md">
            <button
              onClick={handleGenerateLayout}
              disabled={generatingLayout}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingLayout ? "Generating Layout with AI..." : "✨ Generate AI Layout"}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              AI will select the best components for your website
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
