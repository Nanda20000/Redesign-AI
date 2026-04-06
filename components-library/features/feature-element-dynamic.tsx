import React from 'react';

interface FeatureItem {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export interface FeatureElementDynamicProps {
  label?: string;
  heading?: string;
  description?: string;
  features?: FeatureItem[];
  primaryCtaText?: string;
  secondaryCtaText?: string;
}

export const FeatureElementDynamic: React.FC<FeatureElementDynamicProps> = ({
  label,
  heading,
  description,
  features,
  primaryCtaText,
  secondaryCtaText,
}) => {
  // If no props are provided, render nothing
  if (!label && !heading && !description && (!features || features.length === 0) && !primaryCtaText && !secondaryCtaText) {
    return null;
  }

  return (
    <section id="feature-element-dynamic" className="bg-white py-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 border-b border-gray-100 pb-16">
          <div className="md:w-1/2">
            {label && (
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-[1px] bg-black" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{label}</span>
              </div>
            )}
            {heading && (
              <h2 className="text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight max-w-md">
                {heading}
              </h2>
            )}
          </div>
          {description && (
            <div className="md:w-1/3 mt-8 md:mt-auto">
              <p className="text-sm text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-20 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="group cursor-pointer">
                {feature.icon && (
                  <div className="mb-6 text-black">
                    {feature.icon}
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4 group-hover:border-black transition-colors duration-300">
                  {feature.title && (
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  )}
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-gray-400 group-hover:text-black transition-colors duration-300"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                {feature.description && (
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Buttons */}
        {(primaryCtaText || secondaryCtaText) && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 border-t border-gray-100 pt-16">
            {primaryCtaText && (
              <button className="bg-black text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2">
                <span>{primaryCtaText}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </button>
            )}
            {secondaryCtaText && (
              <button className="bg-white text-black border border-gray-200 px-8 py-4 rounded-full text-sm font-medium hover:border-black transition-colors">
                {secondaryCtaText}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureElementDynamic;
