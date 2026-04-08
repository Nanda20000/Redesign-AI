import React from 'react';

/**
 * FeatureFacetDynamic Component
 * A two-column feature section with a prominent heading and image on the left,
 * and a list of detailed features with icons and descriptions on the right.
 */

interface FeatureItem {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  linkIcon?: React.ReactNode;
}

export interface FeatureFacetDynamicProps {
  heading?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaText?: string;
  items?: FeatureItem[];
}

export const FeatureFacetDynamic: React.FC<FeatureFacetDynamicProps> = ({
  heading,
  imageSrc,
  imageAlt,
  ctaText,
  items,
}) => {
  return (
    <section
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full bg-white overflow-hidden"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
          {/* Left Column */}
          <div className="lg:pr-16 flex flex-col">
            {heading && (
              <h2
                style={{ fontWeight: 500 }}
                className="text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-12 leading-tight"
              >
                {heading}
              </h2>
            )}
            {imageSrc && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                <img
                  src={imageSrc}
                  alt={imageAlt || ''}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:pl-16 lg:bg-gray-50/50 flex flex-col">
            <div className="flex justify-end mb-12 pt-4 lg:pt-0">
              {ctaText && (
                <button
                  style={{ fontWeight: 300 }}
                  className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {ctaText}
                </button>
              )}
            </div>

            <div className="flex flex-col">
              {items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 py-10 border-b border-gray-200 last:border-0"
                >
                  {item.icon && (
                    <div className="flex-shrink-0 text-gray-700 mt-1">
                      {item.icon}
                    </div>
                  )}
                  <div className="flex-grow">
                    {item.title && (
                      <h3
                        style={{ fontWeight: 500 }}
                        className="text-xl text-gray-900 mb-3"
                      >
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p
                        style={{ fontWeight: 300 }}
                        className="text-gray-600 leading-relaxed text-base"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.linkIcon && (
                    <div className="flex-shrink-0 text-gray-400 mt-1">
                      {item.linkIcon}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureFacetDynamic;
