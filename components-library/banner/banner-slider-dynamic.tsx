import React from 'react';

export interface BannerSliderDynamicProps {
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkUrl?: string;
}

export function BannerSliderDynamic(props: BannerSliderDynamicProps) {
  const { title, subtitle, linkText, linkUrl } = props;

  // Render nothing if all core dynamic content props are missing or empty
  if (!title && !subtitle && !linkText) {
    return null;
  }

  return (
    <section
      id="banner-slider-dynamic-container"
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="relative w-full overflow-hidden bg-[#0b0b0b] min-h-[300px] flex items-center py-12 px-6 sm:px-12 md:px-24"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Background Graphic Left Pattern */}
      <svg
        id="bg-graphic-left-dots"
        className="absolute -bottom-48 -left-48 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] text-white opacity-25 pointer-events-none"
        viewBox="0 0 600 600"
      >
        <circle cx="0" cy="600" r="150" stroke="currentColor" strokeWidth="4" strokeDasharray="1 12" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="600" r="200" stroke="currentColor" strokeWidth="4" strokeDasharray="1 14" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="600" r="250" stroke="currentColor" strokeWidth="4" strokeDasharray="1 16" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="600" r="300" stroke="currentColor" strokeWidth="4" strokeDasharray="1 18" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="600" r="350" stroke="currentColor" strokeWidth="4" strokeDasharray="1 20" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="600" r="400" stroke="currentColor" strokeWidth="4" strokeDasharray="1 22" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="600" r="450" stroke="currentColor" strokeWidth="4" strokeDasharray="1 24" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="600" r="500" stroke="currentColor" strokeWidth="4" strokeDasharray="1 26" strokeLinecap="round" fill="none" />
      </svg>

      {/* Background Graphic Right Pattern */}
      <svg
        id="bg-graphic-right-dots"
        className="absolute -top-32 -right-32 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] text-white opacity-20 pointer-events-none"
        viewBox="0 0 450 450"
      >
        <circle cx="450" cy="0" r="140" stroke="currentColor" strokeWidth="3" strokeDasharray="1 12" strokeLinecap="round" fill="none" />
        <circle cx="450" cy="0" r="180" stroke="currentColor" strokeWidth="3" strokeDasharray="1 14" strokeLinecap="round" fill="none" />
        <circle cx="450" cy="0" r="220" stroke="currentColor" strokeWidth="3" strokeDasharray="1 16" strokeLinecap="round" fill="none" />
        <circle cx="450" cy="0" r="260" stroke="currentColor" strokeWidth="3" strokeDasharray="1 18" strokeLinecap="round" fill="none" />
        <circle cx="450" cy="0" r="300" stroke="currentColor" strokeWidth="3" strokeDasharray="1 20" strokeLinecap="round" fill="none" />
        <circle cx="450" cy="0" r="340" stroke="currentColor" strokeWidth="3" strokeDasharray="1 22" strokeLinecap="round" fill="none" />
        <circle cx="450" cy="0" r="380" stroke="currentColor" strokeWidth="3" strokeDasharray="1 24" strokeLinecap="round" fill="none" />
      </svg>

      {/* Static Content Wrapper */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-center min-h-[160px]">
        <div className="flex flex-col space-y-4 md:space-y-6">
          {/* Title Render */}
          {title && (
            <h2
              id="banner-title"
              style={{ fontWeight: 500 }}
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight max-w-3xl"
            >
              {title}
            </h2>
          )}

          {/* Subtitle Render */}
          {subtitle && (
            <p
              id="banner-subtitle"
              style={{ fontWeight: 300 }}
              className="text-gray-300 text-lg sm:text-xl md:text-2xl"
            >
              {subtitle}
            </p>
          )}

          {/* Link Render */}
          {linkText && (
            <div id="banner-link-container" className="pt-2">
              <a
                id="banner-link"
                href={linkUrl || '#'}
                style={{ fontWeight: 300 }}
                className="inline-block text-gray-400 hover:text-white text-sm sm:text-base tracking-wider transition-colors border-b border-transparent hover:border-white pb-1"
              >
                {linkText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BannerSliderDynamic;