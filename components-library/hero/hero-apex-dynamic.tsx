/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface HeroApexDynamicProps {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaIcon?: React.ReactNode;
  backgroundImage?: string;
  ratingValue?: string;
  ratingStars?: React.ReactNode;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  featureIcon?: React.ReactNode;
  featureTitle?: string;
  featureDescription?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  sinceLabel?: string;
  sinceValue?: string;
}

export const HeroApexDynamic: React.FC<HeroApexDynamicProps> = ({
  heading,
  subheading,
  ctaText,
  ctaIcon,
  backgroundImage,
  ratingValue,
  ratingStars,
  testimonialQuote,
  testimonialAuthor,
  featureIcon,
  featureTitle,
  featureDescription,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
  sinceLabel,
  sinceValue,
}) => {
  return (
    <section
      className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col justify-between"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght @300;500&display=swap');`}</style>
      
      {/* Background Image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt={heading || 'Hero Background'}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        {heading && (
          <h1
            className="text-white text-5xl md:text-7xl mb-6"
            style={{ fontWeight: 500 }}
          >
            {heading}
          </h1>
        )}
        {subheading && (
          <p
            className="text-white/90 text-lg md:text-xl max-w-2xl mb-10"
            style={{ fontWeight: 300 }}
          >
            {subheading}
          </p>
        )}
        {ctaText && (
          <button
            className="bg-white/90 hover:bg-white text-black px-8 py-4 rounded-2xl flex items-center gap-2 transition-colors"
            style={{ fontWeight: 300 }}
          >
            {ctaText}
            {ctaIcon && <span className="inline-block">{ctaIcon}</span>}
          </button>
        )}
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12 flex flex-col md:flex-row gap-6 items-end">
        
        {/* Left Testimonial Card */}
        {(ratingValue || testimonialQuote) && (
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-full md:w-80">
            <div className="flex items-center gap-3 mb-4">
              {ratingValue && (
                <span className="text-white text-2xl" style={{ fontWeight: 500 }}>
                  {ratingValue}
                </span>
              )}
              {ratingStars && <div className="flex">{ratingStars}</div>}
            </div>
            {testimonialQuote && (
              <p className="text-white text-lg mb-2" style={{ fontWeight: 300 }}>
                "{testimonialQuote}"
              </p>
            )}
            {testimonialAuthor && (
              <span className="text-white/60 text-sm" style={{ fontWeight: 300 }}>
                {testimonialAuthor}
              </span>
            )}
          </div>
        )}

        {/* Right Stats/Features Bar */}
        {(featureTitle || stat1Value || sinceValue) && (
          <div className="bg-black/30 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex-1 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
            
            {/* Feature */}
            {(featureIcon || featureTitle) && (
              <div className="flex items-start gap-4 flex-1">
                {featureIcon && <div className="text-white mt-1">{featureIcon}</div>}
                <div>
                  {featureTitle && (
                    <h3 className="text-white text-lg" style={{ fontWeight: 500 }}>
                      {featureTitle}
                    </h3>
                  )}
                  {featureDescription && (
                    <p className="text-white/60 text-sm" style={{ fontWeight: 300 }}>
                      {featureDescription}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-12 bg-white/10" />

            {/* Stat 1 */}
            {(stat1Value || stat1Label) && (
              <div className="text-center md:text-left">
                {stat1Value && (
                  <div className="text-white text-4xl" style={{ fontWeight: 500 }}>
                    {stat1Value}
                  </div>
                )}
                {stat1Label && (
                  <div className="text-white/60 text-sm" style={{ fontWeight: 300 }}>
                    {stat1Label}
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-12 bg-white/10" />

            {/* Since */}
            {(sinceLabel || sinceValue) && (
              <div className="text-center md:text-left">
                {sinceLabel && (
                  <div className="text-white/60 text-sm uppercase tracking-widest" style={{ fontWeight: 300 }}>
                    {sinceLabel}
                  </div>
                )}
                {sinceValue && (
                  <div className="text-white text-4xl" style={{ fontWeight: 500 }}>
                    {sinceValue}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroApexDynamic;
