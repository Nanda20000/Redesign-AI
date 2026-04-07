import React from 'react';

/**
 * HeroAnchorDynamic Component
 * 
 * A polished hero section featuring a background image, a content overlay with 
 * a decorative accent line, a prominent heading, description, and dual call-to-action buttons.
 * 
 * @param {string} label - Small uppercase label text above the heading.
 * @param {string} title - The main large heading text.
 * @param {string} description - Supporting paragraph text.
 * @param {string} primaryCtaText - Text for the primary solid button.
 * @param {string} primaryCtaUrl - URL for the primary button.
 * @param {string} secondaryCtaText - Text for the secondary icon button.
 * @param {string} secondaryCtaUrl - URL for the secondary button.
 * @param {React.ReactNode} secondaryCtaIcon - Icon for the secondary button (e.g., a play icon).
 * @param {string} image - Background image URL.
 */

export interface HeroAnchorDynamicProps {
  label?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaIcon?: React.ReactNode;
  image?: string;
}

export const HeroAnchorDynamic: React.FC<HeroAnchorDynamicProps> = ({
  label,
  title,
  description,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaIcon,
  image,
}) => {
  return (
    <section 
      className="relative w-full min-h-[600px] flex items-center overflow-hidden bg-black"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght @300;500&display=swap');`}</style>
      
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt={title || "Hero Background"} 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60" />
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side Spacer or Foreground Image could go here, but based on screenshot we just need the layout */}
        <div className="hidden lg:block" />

        {/* Content Side */}
        <div className="flex flex-col items-start max-w-xl">
          {/* Label with Accent Line */}
          {label && (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-red-600" />
              <span 
                className="text-white text-sm tracking-[0.2em] uppercase"
                style={{ fontWeight: 300 }}
              >
                {label}
              </span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-[1.1]"
              style={{ fontWeight: 500 }}
            >
              {title}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p 
              className="text-gray-300 text-lg mb-10 leading-relaxed max-w-md"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-8">
            {primaryCtaText && (
              <a
                href={primaryCtaUrl || '#'}
                className="bg-red-700 hover:bg-red-800 text-white px-10 py-4 transition-colors inline-block text-sm tracking-wider uppercase"
                style={{ fontWeight: 300 }}
              >
                {primaryCtaText}
              </a>
            )}

            {secondaryCtaText && (
              <a
                href={secondaryCtaUrl || '#'}
                className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors group"
                style={{ fontWeight: 300 }}
              >
                {secondaryCtaIcon && (
                  <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center group-hover:border-white transition-colors">
                    {secondaryCtaIcon}
                  </div>
                )}
                <span className="text-sm tracking-wider uppercase">
                  {secondaryCtaText}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAnchorDynamic;
