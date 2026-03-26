import React from 'react';

interface HeroSimpleDynamicProps {
  badge?: string;
  titlePart1?: string;
  titlePart2?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaIcon?: React.ReactNode;
  secondaryCtaText?: string;
  secondaryCtaIcon?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  logos?: { src: string; alt: string }[];
}

export const HeroSimpleDynamic: React.FC<HeroSimpleDynamicProps> = ({
  badge,
  titlePart1,
  titlePart2,
  description,
  primaryCtaText,
  primaryCtaIcon,
  secondaryCtaIcon,
  secondaryCtaText,
  image,
  imageAlt,
  logos,
}) => {
  return (
    <section className="relative w-full bg-white py-12 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-left">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  {badge}
                </span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
              {titlePart1 && (
                <span className="block text-gray-400">
                  {titlePart1}
                </span>
              )}
              {titlePart2 && (
                <span className="block text-black">
                  {titlePart2}
                </span>
              )}
            </h1>

            {description && (
              <p className="text-lg text-gray-600 max-w-lg mb-12 leading-relaxed">
                {description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {secondaryCtaText && (
                <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gray-50 text-black font-semibold text-sm hover:bg-gray-100 transition-colors">
                  {secondaryCtaText}
                  {secondaryCtaIcon && <span>{secondaryCtaIcon}</span>}
                </button>
              )}
              {primaryCtaText && (
                <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#141414] text-white font-semibold text-sm hover:bg-black transition-colors">
                  {primaryCtaText}
                  {primaryCtaIcon && <span>{primaryCtaIcon}</span>}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative w-full aspect-square lg:aspect-[4/3]">
            {image && (
              <div className="w-full h-full bg-gray-50 rounded-[40px] flex items-center justify-center overflow-hidden">
                <img
                  src={image}
                  alt={imageAlt || ''}
                  className="w-3/4 h-3/4 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Logo Carousel Slot */}
        {logos && logos.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center lg:justify-between gap-8 lg:gap-12 opacity-40 grayscale">
              {logos.map((logo, index) => (
                <img
                  key={index}
                  src={logo.src}
                  alt={logo.alt || ''}
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSimpleDynamic;
