import React from 'react';
import { motion } from 'motion/react';

export interface BannerHeaderDynamicProps {
  /** Main title text (e.g., "YOUR NAME") */
  title?: string;
  /** Subtitle/role text (e.g., "HR MANAGER") */
  subtitle?: string;
  /** Text inside the dark URL/action badge at the bottom (e.g., "www.reallygreatsite.com") */
  badgeText?: string;
  /** Optional redirect URL for the badge click */
  badgeUrl?: string;
  /** Optional background image URL. If not provided, a sleek architectural corridor mockup is drawn via CSS gradients. */
  backgroundImageUrl?: string;
  /** Optional hex code or Tailwind color string for the left-side vertical accent bar (e.g., "#3f42b5" or "rgb(79, 70, 229)") */
  leftAccentColor?: string;
  /** Optional custom decorative React node or icon dynamically passed down as a prop */
  rightIcon?: React.ReactNode;
}

export function BannerHeaderDynamic({
  title,
  subtitle,
  badgeText,
  badgeUrl,
  backgroundImageUrl,
  leftAccentColor,
  rightIcon,
}: BannerHeaderDynamicProps) {
  return (
    <div
      className="relative w-full overflow-hidden h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-end select-none"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Import Roboto strictly from Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Decorative vertical accent border on left (if accent color is provided) */}
      {leftAccentColor && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 z-20"
          style={{ backgroundColor: leftAccentColor }}
        />
      )}

      {/* Background Image/Graphics Layer */}
      {backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImageUrl}
            alt=""
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111215] via-[#16171a]/80 to-[#16171a]/95" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1c1d21] to-[#111214]">
          {/* Architectural corridor depth lines simulating the 3D studio background */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute left-[12%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#475569] to-transparent" />
            <div className="absolute right-[28%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#475569] to-transparent" />
            <div className="absolute left-0 right-0 top-[42%] h-[1px] bg-gradient-to-r from-transparent via-[#475569] to-transparent transform -skew-y-3" />
            <div className="absolute left-0 right-0 bottom-[18%] h-[1px] bg-gradient-to-r from-transparent via-[#475569] to-transparent transform skew-y-2" />
          </div>
          {/* Studio spotlight gradient reflection */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 75% 35%, rgba(255,255,255,0.07) 0%, transparent 62%)',
            }}
          />
        </div>
      )}

      {/* Right-aligned text contents */}
      <div className="relative z-10 flex flex-col items-end text-right px-6 sm:px-12 md:px-16 lg:px-24 max-w-full">
        {/* Optional Right/Top Icon/Graphic Slot */}
        {rightIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            {rightIcon}
          </motion.div>
        )}

        {/* Title / Name Header */}
        {title && (
          <motion.h1
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.14em] text-[#e2e8f0] uppercase breakdown-all"
            style={{ fontWeight: 500 }}
          >
            {title}
          </motion.h1>
        )}

        {/* Subtitle / Role Designation */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
            className="text-xs sm:text-sm md:text-base tracking-[0.24em] text-[#94a3b8] uppercase mt-2.5"
            style={{ fontWeight: 300 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Badge Capsule Button / URL */}
        {badgeText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: 'easeOut' }}
            className="mt-6"
          >
            {badgeUrl ? (
              <a
                href={badgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#090a0c] border border-[#1d1e22] px-6 py-2.5 shadow-lg transition-all hover:bg-[#121316] hover:border-[#2e3037]"
                style={{ fontWeight: 300 }}
              >
                <span
                  className="text-[10px] sm:text-xs tracking-[0.2em] text-[#cbd5e1]"
                  style={{ fontWeight: 300 }}
                >
                  {badgeText}
                </span>
              </a>
            ) : (
              <div className="bg-[#090a0c] border border-[#1d1e22] px-6 py-2.5 shadow-lg">
                <span
                  className="text-[10px] sm:text-xs tracking-[0.2em] text-[#cbd5e1]"
                  style={{ fontWeight: 300 }}
                >
                  {badgeText}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BannerHeaderDynamic;
