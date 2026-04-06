import React from 'react';

export interface FeatureAspectDynamicProps {
  title?: string;
  subtitle?: string;
  centerImage?: string;
  feature1Icon?: React.ReactNode;
  feature1Title?: string;
  feature1Description?: string;
  feature2Icon?: React.ReactNode;
  feature2Title?: string;
  feature2Description?: string;
  feature3Icon?: React.ReactNode;
  feature3Title?: string;
  feature3Description?: string;
  feature4Icon?: React.ReactNode;
  feature4Title?: string;
  feature4Description?: string;
}

export const FeatureAspectDynamic: React.FC<FeatureAspectDynamicProps> = ({
  title,
  subtitle,
  centerImage,
  feature1Icon,
  feature1Title,
  feature1Description,
  feature2Icon,
  feature2Title,
  feature2Description,
  feature3Icon,
  feature3Title,
  feature3Description,
  feature4Icon,
  feature4Title,
  feature4Description,
}) => {
  if (!title && !subtitle && !centerImage && !feature1Title && !feature2Title && !feature3Title && !feature4Title) {
    return null;
  }

  const FeatureCard = ({ 
    icon, 
    title: fTitle, 
    description: fDesc 
  }: { 
    icon?: React.ReactNode; 
    title?: string; 
    description?: string 
  }) => {
    if (!fTitle && !fDesc && !icon) return null;
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
        {icon && (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#f05a28]">
            {icon}
          </div>
        )}
        <div>
          {fTitle && (
            <span className="text-white font-bold text-lg mr-2">
              {fTitle}
            </span>
          )}
          {fDesc && (
            <span className="text-white/70 text-sm leading-relaxed">
              {fDesc}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#0a2a24] py-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {title && (
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-white/60 text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-3 flex flex-col gap-8 order-2 lg:order-1">
            <FeatureCard 
              icon={feature1Icon} 
              title={feature1Title} 
              description={feature1Description} 
            />
            <FeatureCard 
              icon={feature2Icon} 
              title={feature2Title} 
              description={feature2Description} 
            />
          </div>

          {/* Center Image */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            {centerImage && (
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={centerImage} 
                  alt={title || "Feature visual"} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 flex flex-col gap-8 order-3">
            <FeatureCard 
              icon={feature3Icon} 
              title={feature3Title} 
              description={feature3Description} 
            />
            <FeatureCard 
              icon={feature4Icon} 
              title={feature4Title} 
              description={feature4Description} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAspectDynamic;
