/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CtaBannerDynamicProps {
  title?: string;
  description?: string;
  items?: string[];
  bottomLabel?: string;
  ctaText?: string;
  backgroundImage?: string;
  onCtaClick?: () => void;
}

export const CtaBannerDynamic: React.FC<CtaBannerDynamicProps> = ({
  title,
  description,
  items,
  bottomLabel,
  ctaText,
  backgroundImage,
  onCtaClick,
}) => {
  if (!title && !description && (!items || items.length === 0) && !bottomLabel && !ctaText && !backgroundImage) {
    return null;
  }

  return (
    <section 
      className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-[40px] aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] bg-neutral-900 font-['Open_Sans',sans-serif]"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onCtaClick?.();
        }
      }}
    >
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 lg:p-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Side: Heading and Description */}
          <div className="max-w-2xl">
            {title && (
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight mb-6">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm md:text-base text-neutral-300 max-w-md leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Right Side: Items List */}
          {items && items.length > 0 && (
            <ul className="hidden md:flex flex-col items-end gap-2 text-right">
              {items.map((item, index) => (
                <li 
                  key={index} 
                  className="text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em] opacity-80"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Yellow Bar */}
        {(bottomLabel || ctaText) && (
          <div className="bg-[#F2E205] rounded-2xl md:rounded-3xl p-2 md:p-3 flex items-center justify-between mt-8">
            <div className="px-4 md:px-6">
              {bottomLabel && (
                <p className="text-[10px] md:text-xs font-bold text-black uppercase tracking-wider leading-tight max-w-[150px] md:max-w-xs">
                  {bottomLabel}
                </p>
              )}
            </div>
            {ctaText && (
              <button
                onClick={onCtaClick}
                className="bg-[#0D0D0D] text-[#F2E205] px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {ctaText}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CtaBannerDynamic;
