import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TestimonialItem {
  id: string | number;
  quote?: string;
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
}

export interface TestiCritiqueDynamicProps {
  badgeText?: string;
  headingText?: string;
  testimonials?: TestimonialItem[];
  quoteIcon?: React.ReactNode;
}

export function TestiCritiqueDynamic({
  badgeText,
  headingText,
  testimonials,
  quoteIcon,
}: TestiCritiqueDynamicProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      id="testi-critique-dynamic-section"
      className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {badgeText && (
          <span
            id="testi-badge"
            className="text-[#8e9aa8] text-sm tracking-wider uppercase mb-3 block text-center"
            style={{ fontWeight: 300 }}
          >
            {badgeText}
          </span>
        )}

        {headingText && (
          <h2
            id="testi-heading"
            className="text-3xl sm:text-4xl text-[#1a1f26] text-center mb-12 sm:mb-16 max-w-2xl tracking-tight leading-tight"
            style={{ fontWeight: 500 }}
          >
            {headingText}
          </h2>
        )}

        <div className="hidden md:grid md:grid-cols-3 gap-8 w-full max-w-6xl">
          {testimonials.map((item, index) => (
            <div
              key={item.id || index}
              className="relative flex flex-col justify-between"
            >
              <div
                className="relative bg-[#f4f5f6] rounded-[32px] p-8 pb-16 h-full flex flex-col justify-between transition-transform duration-300 hover:scale-[1.01]"
              >
                <div>
                  {quoteIcon && (
                    <div className="text-gray-300 opacity-60 mb-6 w-10 h-10 flex items-center justify-start">
                      {quoteIcon}
                    </div>
                  )}

                  {item.quote && (
                    <p
                      className="text-[#2c323b] text-lg sm:text-xl leading-relaxed tracking-wide"
                      style={{ fontWeight: 300 }}
                    >
                      {item.quote}
                    </p>
                  )}
                </div>

                <div
                  className="absolute bottom-0 left-0 w-[190px] h-[76px] bg-white rounded-tr-[32px] flex items-end justify-start pointer-events-none"
                >
                  <div className="absolute right-0 top-0 w-8 h-8 -translate-y-8 bg-transparent pointer-events-none overflow-hidden">
                    <div className="w-16 h-16 rounded-full border-[16px] border-[#f4f5f6] -translate-x-[16px] translate-y-[16px]"></div>
                  </div>
                  <div className="absolute right-0 bottom-0 w-8 h-8 translate-x-8 bg-transparent pointer-events-none overflow-hidden">
                    <div className="w-16 h-16 rounded-full border-[16px] border-[#f4f5f6] -translate-x-[16px] -translate-y-[16px]"></div>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-[24px] w-[166px] h-[76px] flex items-center gap-3"
              >
                {item.authorAvatar && (
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName || 'Avatar'}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                )}
                <div className="flex flex-col justify-center min-w-0">
                  {item.authorName && (
                    <h4
                      className="text-sm text-[#1a1f26] truncate"
                      style={{ fontWeight: 500 }}
                    >
                      {item.authorName}
                    </h4>
                  )}
                  {item.authorHandle && (
                    <span
                      className="text-xs text-[#8e9aa8] truncate"
                      style={{ fontWeight: 300 }}
                    >
                      {item.authorHandle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="block md:hidden w-full max-w-sm px-2 relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {testimonials.map((item, index) => {
              if (index !== activeIndex) return null;
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col justify-between w-full"
                >
                  <div className="relative bg-[#f4f5f6] rounded-[32px] p-8 pb-20 min-h-[220px] flex flex-col justify-between">
                    <div>
                      {quoteIcon && (
                        <div className="text-gray-300 opacity-60 mb-4 w-8 h-8 flex items-center justify-start">
                          {quoteIcon}
                        </div>
                      )}

                      {item.quote && (
                        <p
                          className="text-[#2c323b] text-base leading-relaxed tracking-wide"
                          style={{ fontWeight: 300 }}
                        >
                          {item.quote}
                        </p>
                      )}
                    </div>

                    <div
                      className="absolute bottom-0 left-0 w-[170px] h-[64px] bg-white rounded-tr-[24px] flex items-end justify-start pointer-events-none"
                    >
                      <div className="absolute right-0 top-0 w-6 h-6 -translate-y-6 bg-transparent pointer-events-none overflow-hidden">
                        <div className="w-12 h-12 rounded-full border-[12px] border-[#f4f5f6] -translate-x-[12px] translate-y-[12px]"></div>
                      </div>
                      <div className="absolute right-0 bottom-0 w-6 h-6 translate-x-6 bg-transparent pointer-events-none overflow-hidden">
                        <div className="w-12 h-12 rounded-full border-[12px] border-[#f4f5f6] -translate-x-[12px] -translate-y-[12px]"></div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-[20px] w-[150px] h-[64px] flex items-center gap-2"
                  >
                    {item.authorAvatar && (
                      <img
                        src={item.authorAvatar}
                        alt={item.authorName || 'Avatar'}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                      />
                    )}
                    <div className="flex flex-col justify-center min-w-0">
                      {item.authorName && (
                        <h4
                          className="text-xs text-[#1a1f26] truncate"
                          style={{ fontWeight: 500 }}
                        >
                          {item.authorName}
                        </h4>
                      )}
                      {item.authorHandle && (
                        <span
                          className="text-[10px] text-[#8e9aa8] truncate"
                          style={{ fontWeight: 300 }}
                        >
                          {item.authorHandle}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div id="testi-dots" className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                aria-label={`Slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-6 bg-[#1a1f26]' : 'w-1.5 bg-[#d1d5db] hover:bg-gray-400'
                }`}
                style={{ fontWeight: 300 }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TestiCritiqueDynamic;
