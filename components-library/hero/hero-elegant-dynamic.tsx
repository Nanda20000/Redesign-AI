import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface HeroElegantDynamicProps {
  label?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryIcon?: React.ReactNode;
  secondaryCtaText?: string;
  secondaryIcon?: React.ReactNode;
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
  posterUrl?: string;
}

export const HeroElegantDynamic: React.FC<HeroElegantDynamicProps> = ({
  label,
  title,
  description,
  primaryCtaText,
  primaryIcon,
  secondaryCtaText,
  secondaryIcon,
  mediaUrl,
  mediaType = 'video',
  posterUrl,
}) => {
  return (
    <section id="hero-elegant-dynamic" className="relative w-full bg-white overflow-hidden py-12 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            {label && (
              <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 lg:mb-8 leading-relaxed max-w-md">
                {label}
              </p>
            )}
            
            {title && (
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-8 lg:mb-10">
                {title}
              </h1>
            )}
            
            {description && (
              <p className="text-base lg:text-lg text-zinc-600 leading-relaxed max-w-lg mb-10 lg:mb-12">
                {description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {primaryCtaText && (
                <button 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all duration-300 group"
                >
                  {primaryCtaText}
                  {primaryIcon && <span className="transition-transform group-hover:translate-x-1">{primaryIcon}</span>}
                </button>
              )}
              
              {secondaryCtaText && (
                <button 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-100 text-zinc-900 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all duration-300"
                >
                  {secondaryCtaText}
                  {secondaryIcon && <span>{secondaryIcon}</span>}
                </button>
              )}
            </div>
          </div>

          {/* Media Content */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full aspect-square max-w-[500px] lg:max-w-none lg:w-[120%] lg:-mr-[20%]">
              <div className="w-full h-full rounded-full overflow-hidden bg-zinc-50 shadow-2xl">
                {mediaUrl && (
                  mediaType === 'video' ? (
                    <video
                      src={mediaUrl}
                      poster={posterUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={title || ""}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroElegantDynamic;
