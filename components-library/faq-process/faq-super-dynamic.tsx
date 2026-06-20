/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface FaqItem {
  id: string;
  question?: string;
  answer?: string;
}

export interface FaqSuperDynamicProps {
  badgeText?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  faqItems?: FaqItem[];
  onButtonClick?: () => void;
}

export function FaqSuperDynamic({
  badgeText,
  heading,
  description,
  buttonText,
  buttonLink,
  faqItems,
  onButtonClick,
}: FaqSuperDynamicProps) {
  // If no props are valid or there is nothing to render, return null safely
  if (!badgeText && !heading && !description && !buttonText && (!faqItems || faqItems.length === 0)) {
    return null;
  }

  // Set the first item expanded by default to mimic the screenshot
  const [expandedIds, setExpandedIds] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (faqItems && faqItems.length > 0 && faqItems[0]?.id) {
      initial[faqItems[0].id] = true;
    }
    return initial;
  });

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const validItems = faqItems?.filter((item) => item && (item.question || item.answer)) || [];

  // Divide items into two columns evenly to match the screenshot side-by-side layout
  const half = Math.ceil(validItems.length / 2);
  const leftColumnItems = validItems.slice(0, half);
  const rightColumnItems = validItems.slice(half);

  const handleButtonClick = (e: React.MouseEvent) => {
    if (onButtonClick) {
      e.preventDefault();
      onButtonClick();
    }
  };

  return (
    <section
      id="faq-super-dynamic-root"
      className="w-full bg-white py-16 px-4 md:px-8 max-w-7xl mx-auto"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Header Container */}
      <div id="faq-super-dynamic-header" className="w-full mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1 max-w-2xl">
          {badgeText && (
            <div
              id="faq-super-dynamic-badge"
              className="inline-block border border-blue-300 text-blue-500 bg-blue-50/40 rounded-full px-4 py-1 mb-4 text-xs tracking-wider"
              style={{ fontWeight: 300, textTransform: 'uppercase' }}
            >
              / {badgeText}
            </div>
          )}

          {heading && (
            <h2
              id="faq-super-dynamic-heading"
              className="text-3xl md:text-4xl text-slate-900 tracking-tight"
              style={{ fontWeight: 500, lineHeight: 1.25 }}
            >
              {heading}
            </h2>
          )}

          {description && (
            <p
              id="faq-super-dynamic-description"
              className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          )}
        </div>

        {buttonText && (
          <div id="faq-super-dynamic-cta-container" className="flex-shrink-0 self-start md:self-end">
            {buttonLink ? (
              <a
                id="faq-super-dynamic-cta-link"
                href={buttonLink}
                onClick={handleButtonClick}
                className="inline-block bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full px-8 py-3 text-sm shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                style={{ fontWeight: 300 }}
              >
                {buttonText}
              </a>
            ) : (
              <button
                id="faq-super-dynamic-cta-btn"
                onClick={onButtonClick}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full px-8 py-3 text-sm shadow-md shadow-blue-500/10 transition-all cursor-pointer border-0"
                style={{ fontWeight: 300 }}
              >
                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid Container */}
      {validItems.length > 0 && (
        <div id="faq-super-dynamic-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Left Column */}
          <div id="faq-super-dynamic-col-left" className="space-y-4">
            {leftColumnItems.map((item) => {
              const isExpanded = !!expandedIds[item.id];
              return (
                <div
                  key={item.id}
                  id={`faq-item-container-${item.id}`}
                  className="bg-[#f8f9fa] border border-slate-100 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-sm"
                >
                  <button
                    id={`faq-toggle-${item.id}`}
                    aria-expanded={isExpanded}
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left p-6 flex justify-between items-start gap-4 cursor-pointer focus:outline-none"
                  >
                    {item.question && (
                      <h3
                        id={`faq-question-${item.id}`}
                        className="text-base md:text-lg text-slate-800 flex-1 leading-snug"
                        style={{ fontWeight: 500 }}
                      >
                        {item.question}
                      </h3>
                    )}
                    <span
                      id={`faq-icon-${item.id}`}
                      className="text-xl text-slate-500 select-none flex-shrink-0 leading-none h-6 flex items-center"
                      style={{ fontWeight: 300 }}
                    >
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && item.answer && (
                      <motion.div
                        id={`faq-answer-wrapper-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div id={`faq-answer-content-${item.id}`} className="px-6 pb-6 pt-0">
                          <p
                            id={`faq-answer-${item.id}`}
                            className="text-slate-500 text-sm md:text-base leading-relaxed"
                            style={{ fontWeight: 300 }}
                          >
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div id="faq-super-dynamic-col-right" className="space-y-4">
            {rightColumnItems.map((item) => {
              const isExpanded = !!expandedIds[item.id];
              return (
                <div
                  key={item.id}
                  id={`faq-item-container-${item.id}`}
                  className="bg-[#f8f9fa] border border-slate-100 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-sm"
                >
                  <button
                    id={`faq-toggle-${item.id}`}
                    aria-expanded={isExpanded}
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left p-6 flex justify-between items-start gap-4 cursor-pointer focus:outline-none"
                  >
                    {item.question && (
                      <h3
                        id={`faq-question-${item.id}`}
                        className="text-base md:text-lg text-slate-800 flex-1 leading-snug"
                        style={{ fontWeight: 500 }}
                      >
                        {item.question}
                      </h3>
                    )}
                    <span
                      id={`faq-icon-${item.id}`}
                      className="text-xl text-slate-500 select-none flex-shrink-0 leading-none h-6 flex items-center"
                      style={{ fontWeight: 300 }}
                    >
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && item.answer && (
                      <motion.div
                        id={`faq-answer-wrapper-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div id={`faq-answer-content-${item.id}`} className="px-6 pb-6 pt-0">
                          <p
                            id={`faq-answer-${item.id}`}
                            className="text-slate-500 text-sm md:text-base leading-relaxed"
                            style={{ fontWeight: 300 }}
                          >
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </section>
  );
}

export default FaqSuperDynamic;
