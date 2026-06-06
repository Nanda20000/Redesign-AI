import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AboutCardDynamicProps {
  heading?: string;
  description?: string;
  featureIcon?: React.ReactNode;
  featureTitle?: string;
  featureDescription?: string;
  ctaText?: string;
  ctaIcon?: React.ReactNode;
  image1?: string;
  image2?: string;
}

export const AboutCardDynamic: React.FC<AboutCardDynamicProps> = ({
  heading,
  description,
  featureIcon,
  featureTitle,
  featureDescription,
  ctaText,
  ctaIcon,
  image1,
  image2,
}) => {
  return (
    <section 
      className="py-16 md:py-24 bg-[#F8F9FF]"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-8">
            {heading && (
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight"
                style={{ fontWeight: 500 }}
              >
                {heading}
              </h2>
            )}
            
            {description && (
              <p 
                className="text-[#666666] text-lg leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            )}
            
            {/* Feature Block */}
            {(featureIcon || featureTitle) && (
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
                {featureIcon && (
                  <div className="p-3 bg-[#F0F4FF] rounded-lg text-[#2563EB]">
                    {featureIcon}
                  </div>
                )}
                {featureTitle && (
                  <h4 
                    className="text-xl text-[#1A1A1A] mt-1"
                    style={{ fontWeight: 500 }}
                  >
                    {featureTitle}
                  </h4>
                )}
              </div>
            )}
            
            {featureDescription && (
              <p 
                className="text-[#666666] leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                {featureDescription}
              </p>
            )}
            
            {ctaText && (
              <button 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1D4ED8] text-white rounded-md hover:bg-[#1E40AF] transition-colors shadow-lg shadow-blue-200"
                style={{ fontWeight: 300 }}
              >
                <span style={{ fontWeight: 300 }}>{ctaText}</span>
                {ctaIcon && <span className="w-4 h-4">{ctaIcon}</span>}
              </button>
            )}
          </div>

          {/* Right Column: Images */}
          <div className="relative flex gap-4 h-[400px] md:h-[500px] lg:h-[600px]">
            {/* First Image with Rating Card */}
            {image1 && (
              <div className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={image1} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            
            {/* Second Image */}
            {image2 && (
              <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl mt-12 mb-[-12px]">
                <img 
                  src={image2} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Decorative Dots Pattern */}
            <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 opacity-20 pointer-events-none">
              <div className="grid grid-cols-6 gap-2">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-[#1D4ED8] rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCardDynamic;
