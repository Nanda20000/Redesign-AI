/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export interface StatItem {
  id?: string;
  value?: string;
  label?: string;
}

export interface StoryHeritageDynamicProps {
  headingStart?: string;
  headingAccent?: string;
  headingEnd?: string;
  imageSrc?: string;
  imageAlt?: string;
  rightHeading?: string;
  rightDescription?: string;
  stats?: StatItem[];
}

export function StoryHeritageDynamic({
  headingStart,
  headingAccent,
  headingEnd,
  imageSrc,
  imageAlt,
  rightHeading,
  rightDescription,
  stats,
}: StoryHeritageDynamicProps) {
  const hasHeading = headingStart || headingAccent || headingEnd;
  const hasStats = stats && stats.length > 0;
  if (!hasHeading && !imageSrc && !rightHeading && !rightDescription && !hasStats) {
    return null;
  }

  return (
    <section
      className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading and Highlight Image */}
        <div className="flex flex-col gap-8 w-full">
          {hasHeading && (
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl tracking-tight text-gray-900 leading-tight"
              style={{ fontWeight: 500 }}
            >
              {headingStart && `${headingStart} `}
              {headingAccent && (
                <span className="text-indigo-600 animate-pulse" style={{ fontWeight: 300 }}>
                  {headingAccent}
                </span>
              )}
              {headingEnd && ` ${headingEnd}`}
            </h2>
          )}

          {imageSrc && (
            <div className="w-full overflow-hidden rounded-2xl aspect-[16/10] bg-gray-50 shadow-sm">
              <img
                src={imageSrc}
                alt={imageAlt || "Story Heritage"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Right Column: Narrative and Stats Grid */}
        <div className="flex flex-col gap-6 lg:pt-2 w-full">
          {rightHeading && (
            <h3
              className="text-lg sm:text-xl lg:text-2xl text-gray-900 leading-snug"
              style={{ fontWeight: 500 }}
            >
              {rightHeading}
            </h3>
          )}

          {rightDescription && (
            <p
              className="text-gray-600 text-sm sm:text-base leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {rightDescription}
            </p>
          )}

          {hasStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {stats.map((item, index) => {
                const hasItemContent = item.value || item.label;
                if (!hasItemContent) return null;

                return (
                  <div
                    key={item.id || index}
                    className="bg-zinc-50 p-6 md:p-8 rounded-2xl flex flex-col justify-center min-h-[120px] transition-all hover:bg-zinc-100/80"
                  >
                    {item.value && (
                      <h4
                        className="text-3xl md:text-4xl text-indigo-600 mb-2"
                        style={{ fontWeight: 500 }}
                      >
                        {item.value}
                      </h4>
                    )}
                    {item.label && (
                      <p
                        className="text-gray-500 text-sm sm:text-base"
                        style={{ fontWeight: 300 }}
                      >
                        {item.label}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StoryHeritageDynamic;
