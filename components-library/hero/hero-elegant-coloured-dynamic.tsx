import React from 'react';
import { motion } from 'motion/react';

/**
 * HeroElegantColouredDynamic Component
 * A sophisticated hero section with a centered heading, CTA buttons, 
 * and a dynamic grid of mission statements, statistics, and imagery.
 */

interface HeroElegantColouredDynamicProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  missionText?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  centerImageSrc?: string;
  centerImageLabel?: string;
  rightImageSrc?: string;
  plusIcon?: React.ReactNode;
  arrowIcon?: React.ReactNode;
  mailIcon?: React.ReactNode;
  chartIcon?: React.ReactNode;
  trendIcon?: React.ReactNode;
  gridIcon?: React.ReactNode;
}

export const HeroElegantColouredDynamic: React.FC<HeroElegantColouredDynamicProps> = ({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  missionText,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
  centerImageSrc,
  centerImageLabel,
  rightImageSrc,
  plusIcon,
  arrowIcon,
  mailIcon,
  chartIcon,
  trendIcon,
  gridIcon,
}) => {
  return (
    <section className="relative w-full py-16 px-4 md:py-24 bg-white overflow-hidden">
      {/* Background Decorative Icons */}
      <div className="absolute top-20 left-10 opacity-40 hidden lg:block">
        {plusIcon && <div className="p-2 bg-lime-100 rounded-full text-lime-600">{plusIcon}</div>}
      </div>
      <div className="absolute top-40 left-20 opacity-40 hidden lg:block">
        {arrowIcon && <div className="p-2 border border-gray-200 rounded-full text-gray-400 rotate-45">{arrowIcon}</div>}
      </div>
      <div className="absolute top-24 right-20 opacity-40 hidden lg:block">
        {gridIcon && <div className="p-2 bg-gray-800 text-white rounded-md">{gridIcon}</div>}
      </div>
      <div className="absolute top-48 right-40 opacity-40 hidden lg:block">
        {mailIcon && <div className="p-2 bg-lime-400 text-white rounded-full">{mailIcon}</div>}
      </div>
      <div className="absolute top-32 right-10 opacity-40 hidden lg:block">
        {chartIcon && <div className="p-2 bg-gray-100 rounded-full text-gray-600">{chartIcon}</div>}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="text-center mb-12 md:mb-16">
          {title && (
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {subtitle}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryButtonText && (
              <button className="px-12 py-4 bg-[#D9F99D] hover:bg-lime-300 text-gray-900 font-medium rounded-full transition-all duration-300 shadow-sm">
                {primaryButtonText}
              </button>
            )}
            {secondaryButtonText && (
              <button className="px-12 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-full transition-all duration-300">
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          {/* Mission Card */}
          <div className="md:col-span-1 h-full min-h-[400px] bg-[#C1D8C3] rounded-[40px] p-8 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 20 Q 25 10 50 20 T 100 20 V 100 H 0 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M0 30 Q 25 20 50 30 T 100 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M0 40 Q 25 30 50 40 T 100 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-6 text-emerald-900">
                {arrowIcon && <div className="w-12 h-12 flex items-center justify-center border-b border-emerald-900/30 pb-2">{arrowIcon}</div>}
              </div>
              {missionText && (
                <p className="text-emerald-900 text-xl font-medium leading-snug">
                  {missionText}
                </p>
              )}
            </div>
          </div>

          {/* Stat 1 Card */}
          <div className="md:col-span-1 bg-gray-50 rounded-[40px] p-8 flex flex-col justify-center min-h-[280px]">
            {stat1Value && (
              <span className="text-4xl font-bold text-gray-900 mb-2">{stat1Value}</span>
            )}
            {stat1Label && (
              <p className="text-gray-400 text-sm leading-tight uppercase tracking-wider">
                {stat1Label}
              </p>
            )}
          </div>

          {/* Center Image Card */}
          <div className="md:col-span-1 h-full min-h-[320px] relative rounded-[40px] overflow-hidden group">
            {centerImageSrc && (
              <img 
                src={centerImageSrc} 
                alt={centerImageLabel || "Center feature"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            )}
            {centerImageLabel && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <span className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-lg">
                  {centerImageLabel}
                </span>
              </div>
            )}
          </div>

          {/* Stat 2 Card */}
          <div className="md:col-span-1 bg-[#D9E4D1] rounded-[40px] p-8 flex flex-col justify-center min-h-[280px] relative">
            <div className="absolute top-4 right-4 opacity-30">
              {trendIcon}
            </div>
            {stat2Value && (
              <span className="text-4xl font-bold text-gray-900 mb-2">{stat2Value}</span>
            )}
            {stat2Label && (
              <p className="text-gray-500 text-sm leading-tight uppercase tracking-wider">
                {stat2Label}
              </p>
            )}
          </div>

          {/* Large Right Image Card */}
          <div className="md:col-span-1 h-full min-h-[400px] relative rounded-[40px] overflow-hidden group">
            {rightImageSrc && (
              <img 
                src={rightImageSrc} 
                alt="Main feature" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroElegantColouredDynamic;
