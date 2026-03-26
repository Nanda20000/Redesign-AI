import React from 'react';

/**
 * FeaturesSimpleDynamic component
 * 
 * A features section with a dashed line tagline, two-column header, and 
 * three feature cards in a horizontal layout separated by vertical dashed lines.
 * 
 * Props:
 * - tagline: string (e.g., "MEASURE TWICE. CUT ONCE.")
 * - heading: string (e.g., "Made for modern product teams")
 * - description: string (e.g., "Built on the habits that make the best product teams successful...")
 * - features: Array of objects { title: string, image: string, icon: React.ReactNode }
 */

interface FeatureItem {
  title?: string;
  image?: string;
  icon?: React.ReactNode;
}

export interface FeaturesSimpleDynamicProps {
  tagline?: string;
  heading?: string;
  description?: string;
  features?: FeatureItem[];
}

export const FeaturesSimpleDynamic: React.FC<FeaturesSimpleDynamicProps> = ({
  tagline,
  heading,
  description,
  features,
}) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tagline with dashed lines */}
        {tagline && (
          <div className="flex items-center justify-center mb-16">
            <div className="flex-grow border-t border-dashed border-gray-300"></div>
            <span className="px-4 text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase whitespace-nowrap">
              {tagline}
            </span>
            <div className="flex-grow border-t border-dashed border-gray-300"></div>
          </div>
        )}

        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 items-start">
          <div>
            {heading && (
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
                {heading}
              </h2>
            )}
          </div>
          <div className="flex items-end h-full">
            {description && (
              <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {features?.map((feature, index) => (
              <div
                key={index}
                className={`p-10 flex flex-col h-full relative ${
                  index !== (features?.length || 0) - 1
                    ? 'md:border-r md:border-dashed md:border-gray-200'
                    : ''
                } ${
                  index !== 0 ? 'border-t border-dashed border-gray-200 md:border-t-0' : ''
                }`}
              >
                {/* Image Placeholder */}
                <div className="aspect-square bg-gray-50 rounded-xl mb-8 overflow-hidden flex items-center justify-center">
                  {feature.image ? (
                    <img
                      src={feature.image}
                      alt={feature.title || ''}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg opacity-50"></div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-auto flex items-center justify-between gap-4">
                  {feature.title && (
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                      {feature.title}
                    </h3>
                  )}
                  {feature.icon && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
                      {feature.icon}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSimpleDynamic;
