/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AboutBriefDynamicProps {
  title: string;
  description1: string;
  description2: string;
  ctaText: string;
  image: string;
}

export const AboutBriefDynamic: React.FC<AboutBriefDynamicProps> = ({
  title,
  description1,
  description2,
  ctaText,
  image,
}) => {
  return (
    <section 
      className="py-16 md:py-24 bg-white overflow-hidden"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght @300;500&display=swap');`}</style>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content Column */}
          <div className="w-full md:w-1/2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#c41e1e]" />
              {title && (
                <h2 
                  className="text-4xl md:text-5xl text-[#1a1a1a]"
                  style={{ fontWeight: 500 }}
                >
                  {title}
                </h2>
              )}
            </div>

            <div className="space-y-6">
              {description1 && (
                <p 
                  className="text-[#4a4a4a] text-lg leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  {description1}
                </p>
              )}
              {description2 && (
                <p 
                  className="text-[#4a4a4a] text-lg leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  {description2}
                </p>
              )}
            </div>

            {ctaText && (
              <button 
                className="bg-[#c41e1e] text-white px-8 py-4 uppercase tracking-wider transition-all hover:bg-[#a01818] active:scale-95"
                style={{ fontWeight: 300 }}
              >
                {ctaText}
              </button>
            )}
          </div>

          {/* Right Image Column */}
          <div className="w-full md:w-1/2 relative">
            {/* Red Decorative Background Block */}
            <div className="absolute -top-10 -right-4 md:-right-10 w-4/5 h-4/5 bg-[#c41e1e] z-0" />
            
            {/* Main Image */}
            {image && (
              <div className="relative z-10 shadow-2xl transform translate-x-4 translate-y-4 md:translate-x-0 md:translate-y-0">
                <img 
                  src={image} 
                  alt={title || "About us"} 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutBriefDynamic;
