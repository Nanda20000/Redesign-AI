import React from 'react';

export interface CtaSimpleDynamicProps {
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  stats?: Array<{
    value?: string;
    label?: string;
  }>;
}

export const CtaSimpleDynamic: React.FC<CtaSimpleDynamicProps> = ({
  heading,
  description,
  primaryCtaText,
  secondaryCtaText,
  stats,
}) => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: CTA Card */}
          <div className="relative p-8 md:p-12 rounded-2xl border border-black overflow-hidden bg-white">
            {/* Grid Background Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ 
                backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />
            
            <div className="relative z-10 space-y-6">
              {heading && (
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-lg text-gray-500 max-w-[500px] leading-relaxed">
                  {description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-4">
                {primaryCtaText && (
                  <button className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    {primaryCtaText}
                  </button>
                )}
                {secondaryCtaText && (
                  <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    {secondaryCtaText}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-0">
            {stats?.map((stat, index) => (
              <div 
                key={index} 
                className={`py-8 ${index !== 0 ? 'border-t border-dotted border-gray-300' : ''}`}
              >
                {stat.value && (
                  <div className="text-4xl font-bold text-black mb-1">
                    {stat.value}
                  </div>
                )}
                {stat.label && (
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSimpleDynamic;
