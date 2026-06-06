import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AboutCrewDynamicProps {
  label: string;
  title: string;
  description: string;
  values: string[];
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  imageNumber: string;
  imageLabel: string;
}

export const AboutCrewDynamic: React.FC<AboutCrewDynamicProps> = ({
  label,
  title,
  description,
  values,
  ctaText,
  ctaLink,
  backgroundImage,
  imageNumber,
  imageLabel,
}) => {
  return (
    <section 
      className="w-full py-12 px-4 md:px-8 bg-white"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Content & Values */}
        <div className="bg-[#051405] rounded-[40px] p-8 md:p-12 flex flex-col justify-between min-h-[600px]">
          <div>
            {label && (
              <span 
                className="text-[#b5e61d] text-xs tracking-widest uppercase mb-6 block"
                style={{ fontWeight: 300 }}
              >
                {label}
              </span>
            )}
            
            {title && (
              <h2 
                className="text-white text-4xl md:text-6xl mb-6 leading-tight"
                style={{ fontWeight: 500 }}
              >
                {title}
              </h2>
            )}
            
            {description && (
              <p 
                className="text-gray-400 text-sm md:text-base mb-12 max-w-md leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            )}
            
            {values && values.length > 0 && (
              <ul className="space-y-0 mb-12">
                {values.map((value, index) => (
                  <li 
                    key={index}
                    className="py-6 border-b border-white/10 last:border-0 text-white text-lg md:text-xl"
                    style={{ fontWeight: 300 }}
                  >
                    {value}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {ctaText && (
            <div>
              <a 
                href={ctaLink || '#'}
                className="inline-block bg-[#b5e61d] text-black px-8 py-4 rounded-full text-sm transition-transform hover:scale-105"
                style={{ fontWeight: 300 }}
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>

        {/* Right Card - Visual & Branding */}
        <div className="relative rounded-[40px] overflow-hidden min-h-[600px] group">
          {backgroundImage && (
            <img 
              src={backgroundImage} 
              alt={imageLabel || 'About section visual'} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          )}
          
          {/* Bottom-focused gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          <div className="absolute bottom-12 left-0 right-0 text-center px-8">
            {imageNumber && (
              <div 
                className="text-white text-6xl md:text-8xl mb-2"
                style={{ fontWeight: 500 }}
              >
                {imageNumber}
              </div>
            )}
            
            {imageLabel && (
              <span 
                className="text-white/80 text-xs tracking-[0.3em] uppercase"
                style={{ fontWeight: 300 }}
              >
                {imageLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCrewDynamic;
