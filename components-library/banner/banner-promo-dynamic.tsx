import React from 'react';

export interface BannerPromoDynamicProps {
  /**
   * Main title text (e.g. "YOUR NAME")
   */
  title?: string;
  /**
   * Role or subtitle text (e.g. "HR MANAGER")
   */
  role?: string;
  /**
   * Background image URL for the banner. If provided, overrides/overlays the default background.
   */
  bgImage?: string;
  /**
   * Tailwind class for default background color (e.g. "bg-gradient-to-r from-[#2f3136] to-[#46484e]")
   */
  bgColorClass?: string;
  /**
   * Tailwind class for the top boundary stripe (e.g. "bg-[#1a1c7b]")
   */
  topStripColor?: string;
  /**
   * Tailwind class for the bottom boundary stripe (e.g. "bg-[#1a1c7b]")
   */
  bottomStripColor?: string;
  /**
   * Tailwind class for the white border frame (e.g. "border-white/90")
   */
  frameBorderColor?: string;
  /**
   * Tailwind class for the vertical partition line (e.g. "bg-white/40")
   */
  dividerColor?: string;
  /**
   * Tailwind class for text colors (e.g. "text-white")
   */
  textColor?: string;
  /**
   * Button text for an optional call to action
   */
  ctaText?: string;
  /**
   * Click handler for the optional call to action button
   */
  onCtaClick?: () => void;
}

export function BannerPromoDynamic({
  title,
  role,
  bgImage,
  bgColorClass,
  topStripColor,
  bottomStripColor,
  frameBorderColor,
  dividerColor,
  textColor,
  ctaText,
  onCtaClick,
}: BannerPromoDynamicProps) {
  // Check if we should render the white outline box (requires at least a title or a role)
  const shouldRenderFrame = Boolean(title || role);

  const containerBgStyle: React.CSSProperties = {
    fontFamily: "'Roboto', sans-serif",
    backgroundImage: bgImage ? `url(${bgImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section
      id="banner-promo-dynamic-container"
      className={`relative w-full overflow-hidden flex flex-col justify-between ${
        bgColorClass || 'bg-gradient-to-r from-[#2c2e33] to-[#404349]'
      }`}
      style={containerBgStyle}
    >
      {/* ROBOTO FONT LOADING */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* TOP ACCENT STRIP */}
      {topStripColor && (
        <div
          id="banner-promo-dynamic-top-strip"
          className={`w-full h-3 md:h-4 ${topStripColor}`}
        />
      )}

      {/* METALLIC / ABSTRACT GEOMETRIC LINES (SVG) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          {/* Slanted lines mimicking metallic seams / panels */}
          <path d="M -50 0 L 150 300" stroke="#000000" strokeWidth="2" strokeOpacity="0.8" />
          <path d="M 450 0 L 380 300" stroke="#000000" strokeWidth="3" strokeOpacity="0.9" />
          <path d="M 450 120 L 480 300" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.8" />
          <path d="M 450 120 L 1050 300" stroke="#000000" strokeWidth="2" strokeOpacity="0.75" />
          <path d="M 1250 0 L 1050 300" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Screws/Rivets details */}
          <circle cx="108" cy="80" r="3" fill="#666" stroke="#111" strokeWidth="0.75" />
          <circle cx="125" cy="180" r="3" fill="#666" stroke="#111" strokeWidth="0.75" />
          <circle cx="458" cy="90" r="3" fill="#666" stroke="#111" strokeWidth="0.75" />
          <circle cx="485" cy="210" r="3" fill="#666" stroke="#111" strokeWidth="0.75" />
          <circle cx="1020" cy="270" r="3" fill="#666" stroke="#111" strokeWidth="0.75" />
        </svg>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
        {/* LEFT COLLATERAL (Optional CTA Button / Action space) */}
        <div className="flex-1 flex justify-start items-center">
          {ctaText && (
            <button
              id="banner-promo-dynamic-cta"
              onClick={onCtaClick}
              type="button"
              style={{ fontWeight: 300 }}
              className={`px-6 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/30 rounded backdrop-blur-sm transition-all duration-200 text-sm tracking-widest uppercase cursor-pointer ${
                textColor || 'text-white'
              }`}
            >
              {ctaText}
            </button>
          )}
        </div>

        {/* RIGHT PROMOTIONAL FRAME (YOUR NAME | HR MANAGER) */}
        {shouldRenderFrame && (
          <div
            id="banner-promo-dynamic-frame"
            className={`w-full md:w-auto min-w-[280px] md:min-w-[480px] border px-6 md:px-10 py-5 md:py-8 flex flex-row items-center justify-between gap-6 md:gap-8 backdrop-blur-md bg-black/10 rounded-sm ${
              frameBorderColor || 'border-white/80'
            }`}
          >
            {/* Title / Name */}
            {title && (
              <div className="flex-1 min-w-[120px] md:min-w-[160px]">
                <h2
                  style={{ fontWeight: 500 }}
                  className={`text-xl md:text-3xl uppercase tracking-wider leading-none whitespace-pre-line break-words ${
                    textColor || 'text-white'
                  }`}
                >
                  {title}
                </h2>
              </div>
            )}

            {/* Vertical Divider */}
            {title && role && (
              <div
                id="banner-promo-dynamic-divider"
                className={`w-[1px] h-10 md:h-14 self-center ${
                  dividerColor || 'bg-white/50'
                }`}
              />
            )}

            {/* Role / Subtitle */}
            {role && (
              <div className="flex-1 text-right md:text-left min-w-[100px] md:min-w-[140px]">
                <p
                  style={{ fontWeight: 300 }}
                  className={`text-xs md:text-sm uppercase tracking-widest break-words ${
                    textColor || 'text-white'
                  }`}
                >
                  {role}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM ACCENT STRIP */}
      {bottomStripColor && (
        <div
          id="banner-promo-dynamic-bottom-strip"
          className={`w-full h-3 md:h-4 ${bottomStripColor}`}
        />
      )}
    </section>
  );
}

export default BannerPromoDynamic;
