import React from 'react';

export interface HeroDynamicProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  image?: string;
}

export function HeroDynamic({
  title,
  subtitle,
  description,
  buttonText,
  secondaryButtonText,
  image,
}: HeroDynamicProps) {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT COLUMN: Text Content */}
          <div className="text-center lg:text-left">
            {/* Subtitle - small label above title */}
            {subtitle && (
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                {subtitle}
              </p>
            )}

            {/* Title - large bold heading */}
            {title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {title}
              </h1>
            )}

            {/* Description - short paragraph */}
            {description && (
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {description}
              </p>
            )}

            {/* Buttons */}
            {(buttonText || secondaryButtonText) && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {buttonText && (
                  <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                    {buttonText}
                  </button>
                )}
                {secondaryButtonText && (
                  <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                    {secondaryButtonText}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Image */}
          {image && (
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="w-full h-auto rounded-lg shadow-2xl"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroDynamic;
