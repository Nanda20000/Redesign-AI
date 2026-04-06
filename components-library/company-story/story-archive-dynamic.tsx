import React from 'react';

export interface StoryArchiveDynamicProps {
  topHeading?: string;
  topDescription?: string;
  mainImage?: string;
  bottomHeading?: string;
  bottomDescription?: string;
  ratingValue?: string;
  ratingLabel?: string;
  ratingIcon?: React.ReactNode;
  stats?: Array<{ value: string; label: string }>;
}

export const StoryArchiveDynamic: React.FC<StoryArchiveDynamicProps> = ({
  topHeading,
  topDescription,
  mainImage,
  bottomHeading,
  bottomDescription,
  ratingValue,
  ratingLabel,
  ratingIcon,
  stats,
}) => {
  return (
    <section className="font-open-sans w-full">
      {/* Top Section */}
      <div className="bg-[#f2f1ed] px-6 py-12 md:px-12 md:py-20 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          {topHeading && (
            <h2 className="text-3xl md:text-5xl font-medium text-[#1a1a1a] max-w-xl leading-tight">
              {topHeading}
            </h2>
          )}
          {topDescription && (
            <p className="text-sm md:text-base text-[#4a4a4a] max-w-sm md:mt-2">
              {topDescription}
            </p>
          )}
        </div>

        {/* Main Image */}
        {mainImage && (
          <div className="max-w-7xl mx-auto mt-12 md:mt-20">
            <img
              src={mainImage}
              alt={topHeading || 'Company journey'}
              className="w-full h-auto rounded-3xl object-cover shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="bg-white px-6 py-16 md:px-12 md:py-24 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="flex-1">
              {bottomHeading && (
                <h3 className="text-2xl md:text-4xl font-medium text-[#1a1a1a] leading-snug mb-8">
                  {bottomHeading}
                </h3>
              )}
              {bottomDescription && (
                <p className="text-sm md:text-base text-[#666666] max-w-2xl leading-relaxed">
                  {bottomDescription}
                </p>
              )}
            </div>

            {/* Rating Badge */}
            {(ratingValue || ratingLabel || ratingIcon) && (
              <div className="flex items-center gap-2 bg-[#f8f8f8] px-4 py-2 rounded-full border border-[#eeeeee]">
                {ratingIcon && <div className="flex text-yellow-400">{ratingIcon}</div>}
                <div className="flex items-center gap-1 text-xs md:text-sm font-medium text-[#1a1a1a]">
                  {ratingValue && <span>{ratingValue}</span>}
                  {ratingLabel && <span className="text-[#888888]">{ratingLabel}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 md:mt-24 border-t border-[#eeeeee] pt-12">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col gap-2">
                  {stat.value && (
                    <span className="text-3xl md:text-5xl font-medium text-[#1a1a1a]">
                      {stat.value}
                    </span>
                  )}
                  {stat.label && (
                    <span className="text-xs md:text-sm text-[#888888] leading-tight">
                      {stat.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoryArchiveDynamic;
