import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeroAtlasDynamicProps {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  primaryCta: string;
  secondaryCta: string;
  backgroundImage: string;
  floatingCardLabel: string;
  floatingCardTitle: string;
  floatingCardDescription: string;
  floatingCardImages: string[];
  primaryCtaIcon: React.ReactNode;
  secondaryCtaIcon: React.ReactNode;
  cardArrowIcon: React.ReactNode;
}

export const HeroAtlasDynamic: React.FC<HeroAtlasDynamicProps> = ({
  eyebrow,
  title,
  highlightedTitle,
  primaryCta,
  secondaryCta,
  backgroundImage,
  floatingCardLabel,
  floatingCardTitle,
  floatingCardDescription,
  floatingCardImages,
  primaryCtaIcon,
  secondaryCtaIcon,
  cardArrowIcon,
}) => {
  return (
    <section
      className="relative w-full px-4 py-8 md:px-8 md:py-12"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div
        className="relative min-h-[600px] w-full overflow-hidden rounded-[2.5rem] md:rounded-[4rem]"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex h-full min-h-[600px] flex-col justify-center px-8 py-12 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            {eyebrow && (
              <span
                className="mb-4 block text-xs tracking-[0.2em] text-white/90 uppercase md:text-sm"
                style={{ fontWeight: 300 }}
              >
                {eyebrow}
              </span>
            )}

            {(title || highlightedTitle) && (
              <h1
                className="mb-8 text-5xl leading-[1.1] text-white md:text-7xl lg:text-8xl"
                style={{ fontWeight: 500 }}
              >
                {title && <span>{title} </span>}
                {highlightedTitle && (
                  <span className="text-[#22C55E] italic">
                    {highlightedTitle}
                  </span>
                )}
              </h1>
            )}

            <div className="flex flex-wrap gap-8">
              {primaryCta && (
                <a
                  href="#"
                  className="group flex items-center gap-2 border-b border-white/30 pb-1 text-white transition-colors hover:border-white"
                  style={{ fontWeight: 300 }}
                >
                  <span className="text-sm md:text-base">{primaryCta}</span>
                  {primaryCtaIcon && (
                    <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      {primaryCtaIcon}
                    </span>
                  )}
                </a>
              )}

              {secondaryCta && (
                <a
                  href="#"
                  className="group flex items-center gap-2 border-b border-white/30 pb-1 text-white transition-colors hover:border-white"
                  style={{ fontWeight: 300 }}
                >
                  <span className="text-sm md:text-base">{secondaryCta}</span>
                  {secondaryCtaIcon && (
                    <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      {secondaryCtaIcon}
                    </span>
                  )}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Floating Card */}
        {(floatingCardLabel || floatingCardTitle || floatingCardDescription || (floatingCardImages && floatingCardImages.length > 0)) && (
          <div className="absolute right-4 bottom-4 z-20 w-full max-w-[320px] overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl md:right-12 md:bottom-12 md:max-w-[360px]">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              {floatingCardLabel && (
                <span
                  className="text-sm text-gray-900"
                  style={{ fontWeight: 300 }}
                >
                  {floatingCardLabel}
                </span>
              )}
              {cardArrowIcon && (
                <span className="text-gray-400">
                  {cardArrowIcon}
                </span>
              )}
            </div>

            <div className="flex items-start gap-4">
              {floatingCardImages && floatingCardImages.length > 0 && (
                <div className="flex -space-x-3 overflow-hidden">
                  {floatingCardImages.map((img, idx) => (
                    <img
                      key={idx}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              )}
              <div className="flex-1">
                {floatingCardTitle && (
                  <h4
                    className="text-sm text-gray-900"
                    style={{ fontWeight: 500 }}
                  >
                    {floatingCardTitle}
                  </h4>
                )}
                {floatingCardDescription && (
                  <p
                    className="mt-1 text-xs text-gray-500 leading-relaxed"
                    style={{ fontWeight: 300 }}
                  >
                    {floatingCardDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroAtlasDynamic;
