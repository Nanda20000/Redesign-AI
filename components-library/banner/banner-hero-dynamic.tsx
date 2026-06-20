import React from 'react';

export interface BannerHeroDynamicProps {
  /** The main title or name string, e.g. "YOUR NAME" */
  title?: string;
  /** The subtitle or role string, e.g. "HR MANAGER" */
  subtitle?: string;
  /** The description or tagline string, e.g. "Focused on talent development and growth" */
  description?: string;
  /** Optional background color for the banner (Tailwind class or inline style color, defaults to bg-[#212841]) */
  backgroundColor?: string;
  /** Optional text color (Tailwind class or inline style color, defaults to text-white) */
  textColor?: string;
  /** Optional top bar accent stripe color in hex or solid color format (e.g., "#4f46e5") */
  topBarColor?: string;
  /** Optional halftone pattern dots color in hex or rgb format (defaults to "#cbd5e1" for light slate) */
  dotsColor?: string;
  /** Optional size multiplier for the dynamic halftone dots */
  dotMultiplier?: number;
}

export function BannerHeroDynamic({
  title,
  subtitle,
  description,
  backgroundColor,
  textColor,
  topBarColor,
  dotsColor,
  dotMultiplier,
}: BannerHeroDynamicProps) {
  // SVG Halftone dot pattern dynamic calculation
  const cx = 80;
  const cy = 100;
  const dots: Array<{ x: number; y: number; r: number; opacity: number }> = [];
  const multiplier = dotMultiplier ?? 1.0;

  for (let r = 15; r <= 220; r += 16) {
    const circum = 2 * Math.PI * r;
    const numDots = Math.floor(circum / 16);
    for (let i = 0; i < numDots; i++) {
      const angle = (i * 2 * Math.PI) / numDots;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      if (x >= -20 && x <= 420 && y >= -20 && y <= 220) {
        const baseSize = 1.2 + r / 25;
        const fadeX = Math.max(0, 1 - (x - 40) / 320);
        const dotRadius = baseSize * fadeX * multiplier;

        if (dotRadius > 0.5) {
          dots.push({ x, y, r: dotRadius, opacity: fadeX * 0.75 });
        }
      }
    }
  }

  return (
    <section
      id="banner-hero-dynamic-root"
      className={`relative w-full overflow-hidden flex flex-col min-h-[180px] md:min-h-[220px] ${backgroundColor ?? 'bg-[#212841]'}`}
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Dynamic Top Stripe Accent */}
      {topBarColor && (
        <div
          id="banner-hero-dynamic-topbar"
          className="w-full h-1.5 shrink-0"
          style={{ backgroundColor: topBarColor }}
        />
      )}

      <div
        id="banner-hero-dynamic-container"
        className="relative w-full flex-1 flex flex-col md:flex-row items-center justify-between px-6 py-8 md:py-10 max-w-7xl mx-auto"
      >
        {/* Dynamic Halftone Dot Pattern SVG Graphic */}
        <div
          id="banner-hero-dynamic-pattern"
          className="absolute inset-y-0 left-0 w-full md:w-1/2 pointer-events-none"
        >
          <svg
            className="w-full h-full opacity-70"
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid slice"
          >
            {dots.map((dot, index) => (
              <circle
                key={index}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fill={dotsColor ?? '#cbd5e1'}
                opacity={dot.opacity}
              />
            ))}
          </svg>
        </div>

        {/* Text/Content Container */}
        <div
          id="banner-hero-dynamic-text-container"
          className={`relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center text-center md:ml-auto md:mr-12 space-y-2 md:space-y-3 ${textColor ?? 'text-white'}`}
        >
          {title && (
            <h1
              id="banner-hero-dynamic-title"
              className="text-3xl md:text-4xl uppercase tracking-[0.1em]"
              style={{ fontWeight: 500 }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <h2
              id="banner-hero-dynamic-subtitle"
              className="text-lg md:text-xl uppercase tracking-[0.2em] opacity-90"
              style={{ fontWeight: 500 }}
            >
              {subtitle}
            </h2>
          )}

          {description && (
            <p
              id="banner-hero-dynamic-description"
              className="text-xs md:text-sm tracking-wider opacity-60 max-w-md"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default BannerHeroDynamic;
