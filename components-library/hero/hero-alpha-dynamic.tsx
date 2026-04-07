/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeroAlphaDynamicProps {
  badge?: string;
  titleStart?: string;
  titleAccent?: string;
  titleEnd?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  imageAlt?: string;
}

export const HeroAlphaDynamic: React.FC<HeroAlphaDynamicProps> = ({
  badge,
  titleStart,
  titleAccent,
  titleEnd,
  description,
  ctaText,
  image,
  imageAlt,
}) => {
  return (
    <section
      className="relative w-full min-h-[600px] flex flex-col md:flex-row items-center overflow-hidden bg-[#FFF5F5]"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght @300;500&display=swap');`}</style>

      {/* Left Side: Image Container */}
      <div className="relative w-full md:w-1/2 h-[400px] md:h-full min-h-[600px]">
        {image && (
          <img
            src={image}
            alt={imageAlt || ''}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        {/* Decorative Overlay on Image */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        
        {/* Pagination Dots (Visual only as per screenshot) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-white/50" />
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>

      {/* Right Side: Content Container */}
      <div className="relative w-full md:w-1/2 px-8 md:px-16 py-12 md:py-24 z-10">
        <div className="max-w-xl">
          {badge && (
            <span
              className="inline-block text-[#E31E24] text-xs tracking-widest mb-4"
              style={{ fontWeight: 300 }}
            >
              {badge}
            </span>
          )}

          <h1
            className="text-4xl md:text-6xl text-[#1A1A1A] leading-tight mb-6"
            style={{ fontWeight: 500 }}
          >
            {titleStart && <span>{titleStart}</span>}
            {titleAccent && <span className="text-[#E31E24]">{titleAccent}</span>}
            {titleEnd && <span>{titleEnd}</span>}
          </h1>

          {description && (
            <p
              className="text-[#666666] text-lg mb-8 max-w-md leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          )}

          {ctaText && (
            <button
              className="bg-[#E31E24] text-white px-8 py-4 rounded-md shadow-lg hover:bg-[#C4191F] transition-colors"
              style={{ fontWeight: 300 }}
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute right-0 top-0 w-1/3 h-full pointer-events-none overflow-hidden">
        {/* Red Diagonal Shape */}
        <div 
          className="absolute right-0 top-0 w-full h-full bg-[#E31E24]" 
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        />
        
        {/* Decorative Circles */}
        <div className="absolute right-10 top-20 w-32 h-32 rounded-full border-4 border-white/20" />
        <div className="absolute right-[-20px] bottom-20 w-24 h-24 rounded-full border-4 border-white/20" />
        
        {/* Dotted Pattern (Simplified) */}
        <div className="absolute right-20 bottom-40 grid grid-cols-4 gap-2 opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroAlphaDynamic;
