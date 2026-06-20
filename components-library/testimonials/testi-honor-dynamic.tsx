import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TestimonialItem {
  id?: string | number;
  quote?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
}

export interface TestiHonorDynamicProps {
  items?: TestimonialItem[];
  quoteIconLeft?: React.ReactNode;
  quoteIconRight?: React.ReactNode;
}

export function TestiHonorDynamic({
  items,
  quoteIconLeft,
  quoteIconRight,
}: TestiHonorDynamicProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const safeIndex = activeIndex < items.length ? activeIndex : 0;
  const currentItem = items[safeIndex];

  if (!currentItem) {
    return null;
  }

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-4 py-12 flex flex-col justify-center bg-transparent"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {items.length > 1 && (
        <div className="w-full flex justify-end mb-6 pr-2">
          <div className="flex items-center space-x-2">
            {items.map((_, index) => {
              const isActive = index === safeIndex;
              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-10 bg-blue-500'
                      : 'w-2.5 bg-blue-200 hover:bg-blue-300'
                  }`}
                  style={{ fontWeight: 300 }}
                  aria-label={`Go to item ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="relative w-full bg-white rounded-3xl shadow-lg p-8 md:p-14 border border-slate-100/80 overflow-visible">
        {quoteIconLeft && (
          <div className="absolute -top-7 left-6 md:left-12 text-blue-500/90 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center pointer-events-none select-none">
            {quoteIconLeft}
          </div>
        )}

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col space-y-8"
            >
              {currentItem.quote && (
                <p
                  className="text-slate-800 text-lg md:text-xl lg:text-2xl leading-relaxed text-left tracking-wide"
                  style={{ fontWeight: 300 }}
                >
                  {currentItem.quote}
                </p>
              )}

              <div className="flex items-center space-x-5 pt-2">
                {currentItem.authorAvatar && (
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                      <img
                        src={currentItem.authorAvatar}
                        alt={currentItem.authorName || 'Author'}
                        className="w-full h-full object-cover rounded-full bg-slate-50"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col text-left">
                  {currentItem.authorName && (
                    <h4
                      className="text-slate-900 text-lg md:text-xl tracking-tight"
                      style={{ fontWeight: 500 }}
                    >
                      {currentItem.authorName}
                    </h4>
                  )}
                  {currentItem.authorRole && (
                    <span
                      className="text-slate-500 text-sm md:text-base tracking-wider"
                      style={{ fontWeight: 300 }}
                    >
                      {currentItem.authorRole}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {quoteIconRight && (
          <div className="absolute -bottom-8 right-6 md:right-12 text-blue-400/90 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center pointer-events-none select-none">
            {quoteIconRight}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestiHonorDynamic;
