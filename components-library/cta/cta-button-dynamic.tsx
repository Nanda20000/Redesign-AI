/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface CtaButtonDynamicProps {
  heading?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function CtaButtonDynamic({
  heading,
  description,
  ctaText,
  onCtaClick,
  ctaHref,
  imageSrc,
  imageAlt,
}: CtaButtonDynamicProps) {
  const hasHeading = typeof heading === 'string' && heading.trim() !== '';
  const hasDescription = typeof description === 'string' && description.trim() !== '';
  const hasCta = typeof ctaText === 'string' && ctaText.trim() !== '';
  const hasImage = typeof imageSrc === 'string' && imageSrc.trim() !== '';

  if (!hasHeading && !hasDescription && !hasCta && !hasImage) {
    return null;
  }

  return (
    <div
      className="p-4 md:p-8 w-full max-w-7xl mx-auto"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="bg-[#1e61f2] rounded-[2.5rem] p-6 sm:p-10 md:p-12 lg:p-16 overflow-hidden shadow-xl">
        <div className={`grid grid-cols-1 ${hasImage ? 'md:grid-cols-2' : ''} gap-8 md:gap-12 items-center`}>
          {/* Left Column: Text Content and Button */}
          <div className="flex flex-col justify-center items-start text-left gap-6 w-full">
            {hasHeading && (
              <h2
                className="text-white text-3xl sm:text-4xl lg:text-5xl leading-tight"
                style={{ fontWeight: 500 }}
              >
                {heading}
              </h2>
            )}

            {hasDescription && (
              <p
                className="text-[#e2ebff] text-sm sm:text-base leading-relaxed opacity-90 max-w-xl"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            )}

            {hasCta && (
              ctaHref ? (
                <a
                  href={ctaHref}
                  className="inline-block bg-[#bef243] hover:bg-[#aee036] text-[#1e61f2] text-sm sm:text-base px-6 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-md"
                  style={{ fontWeight: 300 }}
                >
                  {ctaText}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="inline-block bg-[#bef243] hover:bg-[#aee036] text-[#1e61f2] text-sm sm:text-base px-6 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-md cursor-pointer"
                  style={{ fontWeight: 300 }}
                >
                  {ctaText}
                </button>
              )
            )}
          </div>

          {/* Right Column: Image Container */}
          {hasImage && (
            <div className="w-full flex justify-center items-center">
              <div className="w-full rounded-[2rem] overflow-hidden shadow-lg border-4 border-white/10 aspect-[4/3] md:aspect-[1.4]">
                <img
                  src={imageSrc}
                  alt={imageAlt || 'CTA visual detail'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CtaButtonDynamic;
