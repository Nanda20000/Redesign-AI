/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion } from 'motion/react';

export interface OverlayItem {
  label?: string;
  value?: string;
  percentage?: number;
}

export interface FeatureItem {
  text?: string;
  icon?: React.ReactNode;
}

export interface StatItem {
  value?: string;
  label?: string;
}

export interface StoryJourneyDynamicProps {
  className?: string;
  
  // Section Headings
  heading?: string;
  description?: string;
  
  // Image Setup
  imageSrc?: string;
  imageAlt?: string;

  // Floating Progress Card
  overlayTitle?: string;
  overlayItems?: OverlayItem[];

  // Features
  features?: FeatureItem[];

  // Statistics
  stats?: StatItem[];
}

export function StoryJourneyDynamic({
  className = '',
  heading,
  description,
  imageSrc,
  imageAlt,
  overlayTitle,
  overlayItems,
  features,
  stats,
}: StoryJourneyDynamicProps) {
  // Check if we have anything to render at all
  if (
    !heading &&
    !description &&
    !imageSrc &&
    !overlayTitle &&
    (!overlayItems || overlayItems.length === 0) &&
    (!features || features.length === 0) &&
    (!stats || stats.length === 0)
  ) {
    return null;
  }

  const showImageCol = !!imageSrc;
  const showContentCol = !!(heading || description || (features && features.length > 0) || (stats && stats.length > 0));

  return (
    <section 
      className={`w-full py-16 md:py-24 bg-white text-neutral-900 overflow-hidden ${className}`}
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Image & Overlay) */}
          {showImageCol && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square max-w-xl mx-auto lg:mx-0"
            >
              <img
                src={imageSrc}
                alt={imageAlt || ''}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-3xl shadow-sm"
              />
              
              {/* Overlapping Performance Card */}
              {overlayItems && overlayItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 bg-white/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 shadow-lg w-[240px] sm:w-[280px] border border-neutral-100"
                >
                  {overlayTitle && (
                    <h4
                      style={{ fontWeight: 500 }}
                      className="text-xs sm:text-sm text-neutral-800 tracking-wide mb-3 sm:mb-4"
                    >
                      {overlayTitle}
                    </h4>
                  )}
                  
                  <div className="space-y-3">
                    {overlayItems.map((item, index) => {
                      if (!item.label && !item.value) return null;
                      const pct = typeof item.percentage === 'number' ? item.percentage : 0;
                      return (
                        <div key={index} className="flex items-center justify-between gap-3">
                          {item.label && (
                            <span
                              style={{ fontWeight: 300 }}
                              className="text-[10px] sm:text-xs text-neutral-600 truncate w-14 sm:w-16"
                            >
                              {item.label}
                            </span>
                          )}
                          
                          <div className="flex-1 bg-neutral-100 h-1.5 rounded-full overflow-hidden relative">
                            <div
                              className="bg-[#0f523c] h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                            />
                          </div>
                          
                          {item.value && (
                            <span
                              style={{ fontWeight: 300 }}
                              className="text-[10px] sm:text-xs text-neutral-800 text-right w-10 shrink-0"
                            >
                              {item.value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Right Column (Headings, Features, Stats) */}
          {showContentCol && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              {heading && (
                <h2
                  style={{ fontWeight: 500 }}
                  className="text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight leading-tight"
                >
                  {heading}
                </h2>
              )}
              
              {description && (
                <p
                  style={{ fontWeight: 300 }}
                  className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed"
                >
                  {description}
                </p>
              )}
              
              {/* Features List */}
              {features && features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {features.map((item, index) => {
                    if (!item.text && !item.icon) return null;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        {item.icon && (
                          <div className="flex-shrink-0 flex items-center justify-center">
                            {item.icon}
                          </div>
                        )}
                        {item.text && (
                          <span
                            style={{ fontWeight: 300 }}
                            className="text-sm sm:text-base text-neutral-800"
                          >
                            {item.text}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Stats Row */}
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-neutral-100">
                  {stats.map((item, index) => {
                    if (!item.value && !item.label) return null;
                    return (
                      <div key={index} className="flex flex-col">
                        {item.value && (
                          <span
                            style={{ fontWeight: 300 }}
                            className="text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight"
                          >
                            {item.value}
                          </span>
                        )}
                        {item.label && (
                          <span
                            style={{ fontWeight: 300 }}
                            className="text-[11px] sm:text-xs text-neutral-500 mt-2 leading-snug"
                          >
                            {item.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
          
        </div>
      </div>
    </section>
  );
}

export default StoryJourneyDynamic;
