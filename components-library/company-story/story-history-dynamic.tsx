import React from 'react';
import { motion } from 'motion/react';

interface StatItem {
  id?: string | number;
  value?: string;
  label?: string;
}

export interface StoryHistoryDynamicProps {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  stats?: StatItem[];
  onButtonClick?: () => void;
}

export function StoryHistoryDynamic({
  badge,
  title,
  description,
  buttonText,
  buttonIcon,
  imageUrl,
  imageAlt,
  stats,
  onButtonClick,
}: StoryHistoryDynamicProps) {
  const hasContent = badge || title || description || buttonText || imageUrl || (stats && stats.length > 0);
  if (!hasContent) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full flex justify-center items-center py-12 px-4 md:px-8 bg-zinc-50"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="w-full max-w-6xl bg-[#132B20] text-white p-6 md:p-12 rounded-[2rem] shadow-xl flex flex-col gap-8 md:gap-12">
        {/* Top Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
          {/* Left Column: Badge & Title */}
          <div className="flex flex-col gap-4 items-start">
            {badge && (
              <span
                style={{ fontWeight: 300 }}
                className="bg-[#C2EF84] text-[#132B20] px-4 py-1.5 rounded-full text-xs uppercase tracking-wider"
              >
                {badge}
              </span>
            )}
            {title && (
              <h2
                style={{ fontWeight: 500 }}
                className="text-3xl md:text-5xl leading-tight text-white m-0"
              >
                {title}
              </h2>
            )}
          </div>

          {/* Right Column: Description & CTA */}
          <div className="flex flex-col gap-6 items-start md:pt-4">
            {description && (
              <p
                style={{ fontWeight: 300 }}
                className="text-sm md:text-base text-stone-200 leading-relaxed max-w-xl m-0"
              >
                {description}
              </p>
            )}
            {buttonText && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onButtonClick}
                className="flex items-center gap-3 bg-[#1C3A2E] text-white pl-5 pr-2 py-2 rounded-full border border-emerald-800/30 hover:bg-[#254C3D] transition-colors group cursor-pointer"
              >
                <span style={{ fontWeight: 300 }} className="text-sm">
                  {buttonText}
                </span>
                {buttonIcon && (
                  <span
                    style={{ fontWeight: 300 }}
                    className="flex items-center justify-center bg-[#C2EF84] text-[#132B20] w-8 h-8 rounded-full"
                  >
                    {buttonIcon}
                  </span>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Bottom Media & Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {/* Left: Main Image */}
          <div className="md:col-span-2 rounded-[1.5rem] overflow-hidden min-h-[300px] md:min-h-[400px] flex">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={imageAlt || "Company Story Image"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Right: Stats Column Grid */}
          <div className="md:col-span-1">
            {stats && stats.length > 0 && (
              <div className="border-2 border-[#C2EF84] bg-[#132B20] rounded-[1.5rem] p-4 flex flex-col gap-4 h-full justify-between">
                {stats.map((stat, idx) => {
                  if (!stat.value && !stat.label) return null;
                  return (
                    <div
                      key={stat.id || idx}
                      className="bg-white text-[#132B20] p-6 rounded-[1.2rem] flex flex-col items-center justify-center text-center shadow-md flex-1"
                    >
                      {stat.value && (
                        <h3
                          style={{ fontWeight: 500 }}
                          className="text-3xl md:text-4xl m-0"
                        >
                          {stat.value}
                        </h3>
                      )}
                      {stat.label && (
                        <span
                          style={{ fontWeight: 300 }}
                          className="text-xs md:text-sm text-gray-500 mt-1"
                        >
                          {stat.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryHistoryDynamic;