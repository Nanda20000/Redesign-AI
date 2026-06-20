import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface FAQItem {
  id: string;
  title?: string;
  answer?: string;
}

export interface FaqNewDynamicProps {
  // Left Column Content
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  headingPart1?: string;
  headingPart2?: string;
  headingHighlightDetail?: string;
  description?: string;

  // Left Column Card
  cardTitle?: string;
  cardDescription1?: string;
  cardDescription2?: string;
  cardCtaText?: string;
  cardCtaIcon?: React.ReactNode;
  cardCtaUrl?: string;

  // Right Column Content (FAQ Items)
  items?: FAQItem[];
  expandedIcon?: React.ReactNode;
  collapsedIcon?: React.ReactNode;
}

export const FaqNewDynamic: React.FC<FaqNewDynamicProps> = ({
  badgeText,
  badgeIcon,
  headingPart1,
  headingPart2,
  headingHighlightDetail,
  description,
  cardTitle,
  cardDescription1,
  cardDescription2,
  cardCtaText,
  cardCtaIcon,
  cardCtaUrl,
  items,
  expandedIcon,
  collapsedIcon,
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faq-new-dynamic-container"
      className="w-full bg-[#062c2d] text-white py-16 px-6 md:py-24 md:px-12 lg:px-24 flex justify-center items-center select-none"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div id="faq-content-wrapper" className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column */}
        <div id="faq-left-column" className="lg:col-span-5 flex flex-col items-start text-left">
          {badgeText ? (
            <div
              id="faq-badge"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm mb-6"
              style={{ fontWeight: 300 }}
            >
              {badgeIcon ? badgeIcon : null}
              <span style={{ fontWeight: 300 }}>{badgeText}</span>
            </div>
          ) : null}

          {headingPart1 || headingPart2 || headingHighlightDetail ? (
            <h2
              id="faq-heading"
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6 text-white"
              style={{ fontWeight: 500 }}
            >
              {headingPart1 ? (
                <span id="faq-heading-p1" className="block text-white mb-1" style={{ fontWeight: 500 }}>
                  {headingPart1}
                </span>
              ) : null}
              {headingPart2 || headingHighlightDetail ? (
                <span id="faq-heading-p2-container" className="block text-white" style={{ fontWeight: 500 }}>
                  {headingPart2 ? <span className="mr-3" style={{ fontWeight: 500 }}>{headingPart2}</span> : null}
                  {headingHighlightDetail ? (
                    <span className="text-[#c8c6ff]" style={{ fontWeight: 500 }}>
                      {headingHighlightDetail}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </h2>
          ) : null}

          {description ? (
            <p
              id="faq-description"
              className="text-emerald-100/70 text-lg max-w-xl mb-12 leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          ) : null}

          {cardTitle || cardDescription1 || cardDescription2 || cardCtaText ? (
            <div
              id="faq-questions-card"
              className="border border-emerald-500/20 bg-[#052324]/80 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-xl"
            >
              {cardTitle ? (
                <h3 id="faq-card-title" className="text-xl md:text-2xl text-white mb-4" style={{ fontWeight: 500 }}>
                  {cardTitle}
                </h3>
              ) : null}

              {cardDescription1 ? (
                <p id="faq-card-desc1" className="text-emerald-100/70 text-sm mb-4 leading-relaxed" style={{ fontWeight: 300 }}>
                  {cardDescription1}
                </p>
              ) : null}

              {cardDescription2 ? (
                <p id="faq-card-desc2" className="text-emerald-100/70 text-sm mb-6 leading-relaxed" style={{ fontWeight: 300 }}>
                  {cardDescription2}
                </p>
              ) : null}

              {cardCtaText ? (
                cardCtaUrl ? (
                  <a
                    id="faq-card-cta-link"
                    href={cardCtaUrl}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00df82] hover:bg-[#00f892] text-[#052627] rounded-full transition-all duration-200 cursor-pointer"
                    style={{ fontWeight: 300 }}
                  >
                    {cardCtaIcon ? cardCtaIcon : null}
                    <span style={{ fontWeight: 300 }}>{cardCtaText}</span>
                  </a>
                ) : (
                  <button
                    id="faq-card-cta-btn"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00df82] hover:bg-[#00f892] text-[#052627] rounded-full transition-all duration-200 cursor-pointer border-0"
                    style={{ fontWeight: 300 }}
                  >
                    {cardCtaIcon ? cardCtaIcon : null}
                    <span style={{ fontWeight: 300 }}>{cardCtaText}</span>
                  </button>
                )
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Right Column */}
        <div id="faq-right-column" className="lg:col-span-7 flex flex-col gap-4 w-full">
          {items && items.length > 0 ? (
            <div id="faq-accordion-group" className="flex flex-col gap-4 w-full">
              {items.map((item, index) => {
                if (!item.title) return null;
                const itemId = item.id || String(index);
                const isOpen = !!openItems[itemId];

                return (
                  <div
                    id={`faq-item-${itemId}`}
                    key={itemId}
                    className="border border-emerald-500/10 bg-[#052324]/50 hover:bg-[#052324]/80 rounded-2xl p-6 transition-all duration-300 w-full"
                  >
                    <div
                      id={`faq-item-trigger-${itemId}`}
                      className="flex justify-between items-center w-full gap-4 cursor-pointer select-none"
                      onClick={() => toggleItem(itemId)}
                    >
                      <h4 id={`faq-item-title-${itemId}`} className="text-lg md:text-xl text-white pr-2" style={{ fontWeight: 500 }}>
                        {item.title}
                      </h4>
                      <button
                        id={`faq-item-toggle-button-${itemId}`}
                        aria-label="Toggle answer"
                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer border-0"
                        style={{ fontWeight: 300 }}
                      >
                        {isOpen ? (
                          expandedIcon ? expandedIcon : <span style={{ fontWeight: 300 }}>&#9650;</span>
                        ) : (
                          collapsedIcon ? collapsedIcon : <span style={{ fontWeight: 300 }}>&#9660;</span>
                        )}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && item.answer ? (
                        <motion.div
                          id={`faq-item-body-${itemId}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p id={`faq-item-answer-${itemId}`} className="pt-4 text-emerald-100/70 text-sm md:text-base leading-relaxed" style={{ fontWeight: 300 }}>
                            {item.answer}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default FaqNewDynamic;
