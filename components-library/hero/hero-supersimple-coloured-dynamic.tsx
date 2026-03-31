import React from 'react';

export interface HeroFeature {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export interface HeroSupersimpleColouredDynamicProps {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaIcon?: React.ReactNode;
  secondaryCtaText?: string;
  secondaryCtaIcon?: React.ReactNode;
  heroImage?: string;
  features?: HeroFeature[];
  bottomRightIcon?: React.ReactNode;
}

export const HeroSupersimpleColouredDynamic: React.FC<HeroSupersimpleColouredDynamicProps> = ({
  title,
  description,
  primaryCtaText,
  primaryCtaIcon,
  secondaryCtaText,
  secondaryCtaIcon,
  heroImage,
  features,
  bottomRightIcon,
}) => {
  if (!title && !description && !heroImage && (!features || features.length === 0)) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-zinc-500 text-sm md:text-base max-w-lg leading-relaxed">
                {description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {primaryCtaText && (
                <button className="bg-zinc-900 text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-zinc-800 transition-colors text-sm font-medium">
                  {primaryCtaText}
                  {primaryCtaIcon && <span className="w-4 h-4">{primaryCtaIcon}</span>}
                </button>
              )}
              {secondaryCtaText && (
                <button className="text-zinc-900 flex items-center gap-2 hover:underline text-sm font-medium">
                  {secondaryCtaText}
                  {secondaryCtaIcon && <span className="w-4 h-4">{secondaryCtaIcon}</span>}
                </button>
              )}
            </div>
          </div>

          {/* Right Image */}
          {heroImage && (
            <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-[3rem]">
              <img
                src={heroImage}
                alt={title || 'Hero Image'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Features Grid */}
          <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {features?.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-50 p-6 rounded-[2rem] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {feature.icon && (
                    <div className="w-8 h-8 text-zinc-900">
                      {feature.icon}
                    </div>
                  )}
                  <div className="space-y-1">
                    {feature.title && (
                      <h3 className="font-bold text-zinc-900 text-sm">
                        {feature.title}
                      </h3>
                    )}
                    {feature.description && (
                      <p className="text-zinc-500 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Right Icon Button */}
          {bottomRightIcon && (
            <div className="lg:col-span-2 bg-zinc-900 rounded-[2rem] flex items-center justify-center aspect-square lg:aspect-auto min-h-[120px]">
              <div className="w-12 h-12 text-white">
                {bottomRightIcon}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSupersimpleColouredDynamic;
