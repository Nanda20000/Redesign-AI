/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FeatureItem {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export interface HeroSuperColouredDynamicProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  secondaryCtaIcon?: React.ReactNode;
  statTopRightValue?: string;
  statTopRightLabel?: string;
  mainImage?: string;
  smallCardIcon?: React.ReactNode;
  smallCardText?: string;
  accentIcon?: React.ReactNode;
  bottomLeftStatValue?: string;
  bottomLeftStatLabel?: string;
  features?: FeatureItem[];
  decorativeIcon?: React.ReactNode;
}

export const HeroSuperColouredDynamic: React.FC<HeroSuperColouredDynamicProps> = ({
  badgeText,
  badgeIcon,
  title,
  primaryCtaText,
  secondaryCtaText,
  secondaryCtaIcon,
  statTopRightValue,
  statTopRightLabel,
  mainImage,
  smallCardIcon,
  smallCardText,
  accentIcon,
  bottomLeftStatValue,
  bottomLeftStatLabel,
  features,
  decorativeIcon,
}) => {
  return (
    <section className="relative w-full bg-[#EBE7E2] py-12 px-6 md:px-12 lg:px-20 overflow-hidden font-sans text-[#1A1A1A]">
      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Title and CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-start space-y-8">
          {/* Badge */}
          {badgeText && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-black/20">
                {badgeIcon}
              </div>
              <span className="text-sm font-medium opacity-70">{badgeText}</span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
              {title}
            </h1>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            {primaryCtaText && (
              <button className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-black/80 transition-colors">
                {primaryCtaText}
              </button>
            )}
            {secondaryCtaText && (
              <button className="flex items-center space-x-2 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-black/20 group-hover:bg-black/5 transition-colors">
                  {secondaryCtaIcon}
                </div>
                <span className="font-semibold underline underline-offset-4">{secondaryCtaText}</span>
              </button>
            )}
          </div>

          {/* Bottom Left Card */}
          {(bottomLeftStatValue || bottomLeftStatLabel) && (
            <div className="mt-12 max-w-sm">
              <div className="bg-[#C5BEB5] p-8 rounded-[40px] relative overflow-hidden">
                {bottomLeftStatValue && (
                  <h3 className="text-3xl font-bold mb-2">{bottomLeftStatValue}</h3>
                )}
                {bottomLeftStatLabel && (
                  <p className="text-sm opacity-60 leading-relaxed">{bottomLeftStatLabel}</p>
                )}
                
                {/* Decorative element inside card */}
                <div className="mt-6 bg-white rounded-full p-4 flex items-center justify-between">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4 h-[1px] bg-black/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <svg width="100%" height="10" viewBox="0 0 100 10" preserveAspectRatio="none">
                         <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="black" strokeWidth="0.5" />
                       </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Image and Stats */}
        <div className="lg:col-span-6 relative">
          {/* Top Right Stat */}
          {(statTopRightValue || statTopRightLabel) && (
            <div className="absolute top-0 right-0 text-right z-10">
              {statTopRightValue && (
                <div className="text-4xl font-bold flex items-baseline justify-end">
                  {statTopRightValue}
                </div>
              )}
              {statTopRightLabel && (
                <div className="text-xs uppercase tracking-widest opacity-50 font-semibold">
                  {statTopRightLabel}
                </div>
              )}
              <div className="mt-2 w-12 h-12 border-l border-b border-black/20 ml-auto"></div>
            </div>
          )}

          {/* Main Image Container */}
          <div className="relative mt-16 lg:mt-0">
            {/* Small Floating Card */}
            {(smallCardText || smallCardIcon) && (
              <div className="absolute -top-12 left-0 z-20 bg-[#B8B0A5] p-6 rounded-[32px] w-40">
                <div className="mb-4 opacity-80">
                  {smallCardIcon}
                </div>
                {smallCardText && (
                  <p className="text-xs font-medium leading-tight opacity-70">
                    {smallCardText}
                  </p>
                )}
              </div>
            )}

            {/* Accent Icon (Orange Arrow) */}
            {accentIcon && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 bg-[#FF5722] rounded-full flex items-center justify-center text-white shadow-xl">
                {accentIcon}
              </div>
            )}

            {/* The Image */}
            {mainImage && (
              <div className="rounded-[60px] overflow-hidden aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto shadow-2xl">
                <img 
                  src={mainImage} 
                  alt={title || "Hero image"} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Decorative Starburst */}
            {decorativeIcon && (
              <div className="absolute bottom-1/4 -left-12 w-24 h-24 opacity-80">
                {decorativeIcon}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Features Row */}
      {features && features.length > 0 && (
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Empty first col to align with layout if needed, or just map all */}
          <div className="hidden lg:block"></div>
          {features.map((feature, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-black/20">
                  {feature.icon}
                </div>
                {feature.title && (
                  <h4 className="text-xl font-bold">{feature.title}</h4>
                )}
              </div>
              {feature.description && (
                <p className="text-sm opacity-60 leading-relaxed max-w-xs">
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 200 H 300 V 400" stroke="black" strokeWidth="0.5" />
          <path d="M700 100 V 300 H 900" stroke="black" strokeWidth="0.5" />
          <path d="M500 600 V 800 H 700" stroke="black" strokeWidth="0.5" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSuperColouredDynamic;
