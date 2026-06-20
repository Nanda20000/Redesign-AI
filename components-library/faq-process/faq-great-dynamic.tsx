import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

export interface FAQGreatDynamicProps {
  badgeText?: string;
  badgeDotClass?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  faqItems?: Array<{
    question?: string;
    answer?: string;
  }>;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
}

export function FAQGreatDynamic({
  badgeText,
  badgeDotClass,
  title,
  titleHighlight,
  description,
  faqItems,
  expandIcon,
  collapseIcon,
}: FAQGreatDynamicProps) {
  // Initialize with indices 0 and 1 expanded by default to mirror the screenshot
  const [expandedIndices, setExpandedIndices] = React.useState<Set<number>>(
    () => new Set([0, 1])
  );

  const toggleIndex = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Helper to highlight a specific word in the title with a pink swash underline
  const renderTitleWithHighlight = (titleText?: string, highlightText?: string) => {
    if (!titleText) return null;
    if (!highlightText || !titleText.includes(highlightText)) {
      return titleText;
    }

    const parts = titleText.split(highlightText);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="relative inline-block px-1">
                {highlightText}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 10"
                  className="absolute left-0 right-0 -bottom-1 w-full h-2 text-pink-300 opacity-90 fill-none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 5 Q 30 1, 50 5 T 99 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  // Filter out invalid items but keep original index mapping for column splitting
  const mappedItems = (faqItems || [])
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item && (item.question || item.answer));

  // If everything is completely empty, render absolutely nothing
  if (!badgeText && !title && !description && mappedItems.length === 0) {
    return null;
  }

  // Interleave split for 2 balanced columns (even mapped-item IDs left, odd right)
  const leftColItems = mappedItems.filter((_, idx) => idx % 2 === 0);
  const rightColItems = mappedItems.filter((_, idx) => idx % 2 !== 0);

  const renderFaqCard = (item: { question?: string; answer?: string }, originalIndex: number) => {
    const isExpanded = expandedIndices.has(originalIndex);

    return (
      <div
        key={originalIndex}
        className="bg-white rounded-3xl p-6 md:p-8 border border-white/50 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer text-left w-full select-none"
        onClick={() => toggleIndex(originalIndex)}
      >
        <div className="flex items-start justify-between gap-4">
          {item.question && (
            <h3
              className="text-lg md:text-xl text-slate-900 flex-1 leading-snug pr-2"
              style={{ fontWeight: 500 }}
            >
              {item.question}
            </h3>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleIndex(originalIndex);
            }}
            className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center flex-shrink-0 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            aria-expanded={isExpanded}
            style={{ fontWeight: 300 }}
          >
            {isExpanded ? (
              collapseIcon ? (
                collapseIcon
              ) : (
                <svg
                  width="14"
                  height="2"
                  viewBox="0 0 14 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M1 1H13"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              )
            ) : (
              expandIcon ? (
                expandIcon
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M7 1V13M1 7H13"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              )
            )}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && item.answer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.2, delay: 0.05 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.15 },
                },
              }}
              className="overflow-hidden"
            >
              <p
                className="mt-4 text-slate-500 text-sm md:text-base leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                {item.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      className="py-20 px-4 md:px-8 bg-slate-50/60 relative overflow-hidden"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-6xl mx-auto">
        {/* Badge Indicator */}
        {badgeText && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span
              className={badgeDotClass || "w-2.5 h-2.5 rounded-full bg-[#FF453A] animate-pulse"}
            />
            <span
              className="text-xs uppercase tracking-[0.2em] text-slate-500"
              style={{ fontWeight: 300 }}
            >
              {badgeText}
            </span>
          </div>
        )}

        {/* Dynamic Highlighted Heading */}
        {title && (
          <h2
            className="text-4xl md:text-5xl text-center text-slate-900 tracking-tight leading-tight mb-4 max-w-3xl mx-auto"
            style={{ fontWeight: 500 }}
          >
            {renderTitleWithHighlight(title, titleHighlight)}
          </h2>
        )}

        {/* Dynamic Description Paragraph */}
        {description && (
          <p
            className="max-w-2xl mx-auto text-center text-slate-500 text-sm md:text-base leading-relaxed mb-16"
            style={{ fontWeight: 300 }}
          >
            {description}
          </p>
        )}

        {/* Interleaved 2-Column Responsive Layout */}
        {mappedItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {leftColItems.map(({ item, originalIndex }) => renderFaqCard(item, originalIndex))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {rightColItems.map(({ item, originalIndex }) => renderFaqCard(item, originalIndex))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FAQGreatDynamic;
