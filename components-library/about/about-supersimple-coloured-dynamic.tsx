import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AboutSupersimpleColouredDynamicProps {
  title?: string;
  descriptionLeft?: string;
  descriptionRight?: string;
  imageSrc?: string;
  imageAlt?: string;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  subTitle?: string;
  subDescription?: string;
  highlightQuote?: string;
  playIcon?: React.ReactNode;
}

export const AboutSupersimpleColouredDynamic = ({
  title,
  descriptionLeft,
  descriptionRight,
  imageSrc,
  imageAlt,
  testimonialQuote,
  testimonialAuthor,
  subTitle,
  subDescription,
  highlightQuote,
  playIcon,
}: AboutSupersimpleColouredDynamicProps) => {
  if (!title && !descriptionLeft && !descriptionRight && !imageSrc && !subTitle) {
    return null;
  }

  return (
    <section className="bg-[#FDF9F3] py-16 md:py-24 px-6 md:px-12 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="mb-16 md:mb-24">
          {title && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] max-w-3xl leading-tight mb-12">
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {descriptionLeft && (
              <p className="text-[#4A4A4A] text-lg leading-relaxed">
                {descriptionLeft}
              </p>
            )}
            {descriptionRight && (
              <p className="text-[#4A4A4A] text-lg leading-relaxed">
                {descriptionRight}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className="relative">
            {imageSrc && (
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src={imageSrc}
                  alt={imageAlt || ''}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Play Button Overlay */}
                {playIcon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      {playIcon}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Testimonial Card Overlay */}
            {(testimonialQuote || testimonialAuthor) && (
              <div className="absolute -bottom-8 left-8 right-8 md:left-12 md:right-auto md:w-80 bg-white p-6 rounded-2xl shadow-2xl z-10 text-center">
                {testimonialQuote && (
                  <p className="text-[#1A1A1A] font-semibold text-lg mb-2">
                    &ldquo;{testimonialQuote}&rdquo;
                  </p>
                )}
                {testimonialAuthor && (
                  <p className="text-[#666666] text-sm uppercase tracking-wider">
                    {testimonialAuthor}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Text Column */}
          <div className="space-y-8">
            {subTitle && (
              <h3 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
                {subTitle}
              </h3>
            )}
            {subDescription && (
              <p className="text-[#4A4A4A] text-lg leading-relaxed">
                {subDescription}
              </p>
            )}
            {highlightQuote && (
              <div className="border-l-4 border-[#FFD700] pl-6 py-2">
                <p className="text-[#1A1A1A] text-xl font-medium italic leading-relaxed">
                  &ldquo;{highlightQuote}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSupersimpleColouredDynamic;
