/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface HeroAspectDynamicProps {
  badgeText: string;
  title: string;
  description: string;
  ctaText: string;
  ctaIcon: React.ReactNode;
  ratingValue: string;
  ratingLabel: string;
  ratingAvatars: string[];
  videoThumbnail: string;
  videoPlayIcon: React.ReactNode;
  features: FeatureItem[];
}

export const HeroAspectDynamic = ({
  badgeText,
  title,
  description,
  ctaText,
  ctaIcon,
  ratingValue,
  ratingLabel,
  ratingAvatars,
  videoThumbnail,
  videoPlayIcon,
  features,
}: HeroAspectDynamicProps) => {
  return (
    <section
      className="w-full bg-[#f5f5f5] py-12 md:py-20 px-4 md:px-8"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-left">
            {badgeText && (
              <span
                className="inline-block px-4 py-1.5 mb-6 bg-white rounded-full text-sm text-gray-800 shadow-sm"
                style={{ fontWeight: 300 }}
              >
                {badgeText}
              </span>
            )}
            
            {title && (
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight"
                style={{ fontWeight: 500 }}
              >
                {title}
              </h1>
            )}
            
            {description && (
              <p
                className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            )}
            
            {ctaText && (
              <button
                className="flex items-center gap-2 px-6 py-3 bg-[#1a5f3a] text-white rounded-full hover:bg-[#144a2d] transition-colors mb-10"
                style={{ fontWeight: 300 }}
              >
                {ctaText}
                {ctaIcon}
              </button>
            )}
            
            <div className="flex items-center gap-4">
              {ratingAvatars && ratingAvatars.length > 0 && (
                <div className="flex -space-x-3">
                  {ratingAvatars.map((avatar, i) => (
                    <img
                      key={i}
                      src={avatar}
                      alt=""
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#f9c851] flex items-center justify-center text-gray-800 text-sm" style={{ fontWeight: 500 }}>
                    +
                  </div>
                </div>
              )}
              
              <div className="flex flex-col">
                {ratingValue && (
                  <span className="text-lg text-gray-900" style={{ fontWeight: 500 }}>
                    {ratingValue}
                  </span>
                )}
                {ratingLabel && (
                  <span className="text-sm text-gray-500" style={{ fontWeight: 300 }}>
                    {ratingLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Media */}
          <div className="relative group cursor-pointer">
            {videoThumbnail && (
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src={videoThumbnail}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                    {videoPlayIcon || (
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Features */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-200">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#1a5f3a]">
                  {feature.icon}
                </div>
                <div>
                  {feature.title && (
                    <h3 className="text-xl text-gray-900 mb-1" style={{ fontWeight: 500 }}>
                      {feature.title}
                    </h3>
                  )}
                  {feature.description && (
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontWeight: 300 }}>
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroAspectDynamic;
