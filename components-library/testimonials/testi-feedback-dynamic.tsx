import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TestimonialItem {
  id: string | number;
  feedback?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatarUrl?: string;
}

export interface TestiFeedbackDynamicProps {
  title?: string;
  subtitle?: string;
  items?: TestimonialItem[];
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  quoteIcon?: React.ReactNode;
}

export function TestiFeedbackDynamic({
  title,
  subtitle,
  items,
  prevIcon,
  nextIcon,
  quoteIcon,
}: TestiFeedbackDynamicProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!items || items.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const visibleItems = React.useMemo(() => {
    if (items.length === 0) return [];
    if (items.length === 1) return [items[0]];
    const nextIdx = (currentIndex + 1) % items.length;
    return [items[currentIndex], items[nextIdx]];
  }, [items, currentIndex]);

  return (
    <section
      id="testi-feedback-dynamic"
      className="w-full py-16 px-6 md:px-12 bg-white text-neutral-900 overflow-hidden"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto flex flex-col">
        <div
          id="testi-header"
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-12 gap-6"
        >
          <div className="flex flex-col items-start">
            {title && (
              <h2
                id="testi-title"
                style={{ fontWeight: 500 }}
                className="text-3xl md:text-4xl text-neutral-900 tracking-tight"
              >
                {title}
              </h2>
            )}
            {title && (
              <div
                id="testi-underline"
                className="w-10 h-[2px] bg-neutral-800 mt-2"
              />
            )}
            {subtitle && (
              <p
                id="testi-subtitle"
                style={{ fontWeight: 300 }}
                className="text-sm md:text-base text-neutral-500 mt-3"
              >
                {subtitle}
              </p>
            )}
          </div>

          {(prevIcon || nextIcon) && (
            <div
              id="testi-nav"
              className="flex items-center gap-3 self-end md:self-auto"
            >
              {prevIcon && (
                <button
                  id="testi-prev-btn"
                  onClick={handlePrev}
                  style={{ fontWeight: 300 }}
                  className="p-2 md:p-3 border border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:bg-neutral-50 transition-colors rounded-md cursor-pointer flex items-center justify-center"
                  aria-label="Previous Testimonial"
                >
                  {prevIcon}
                </button>
              )}
              {nextIcon && (
                <button
                  id="testi-next-btn"
                  onClick={handleNext}
                  style={{ fontWeight: 300 }}
                  className="p-2 md:p-3 border border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:bg-neutral-50 transition-colors rounded-md cursor-pointer flex items-center justify-center"
                  aria-label="Next Testimonial"
                >
                  {nextIcon}
                </button>
              )}
            </div>
          )}
        </div>

        <div
          id="testi-cards-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 min-h-[340px]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleItems.map((item, idx) => {
              if (!item) return null;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  id={`testi-card-${item.id}`}
                  className={`w-full bg-[#f4efea] p-8 md:p-10 rounded-lg flex flex-col justify-between min-h-[280px] ${
                    idx === 1 ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div className="flex flex-col">
                    {quoteIcon && (
                      <div
                        id={`testi-quote-icon-${item.id}`}
                        className="mb-4 text-neutral-300 w-16 h-12 flex items-center justify-start"
                      >
                        {quoteIcon}
                      </div>
                    )}
                    {item.feedback && (
                      <p
                        id={`testi-feedback-${item.id}`}
                        style={{ fontWeight: 300 }}
                        className="text-base md:text-lg text-neutral-800 leading-relaxed italic"
                      >
                        {item.feedback}
                      </p>
                    )}
                  </div>

                  <div
                    id={`testi-author-info-${item.id}`}
                    className="flex items-center gap-4 mt-8"
                  >
                    {item.authorAvatarUrl && (
                      <img
                        id={`testi-avatar-${item.id}`}
                        src={item.authorAvatarUrl}
                        alt={item.authorName ?? ''}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      {item.authorName && (
                        <h4
                          id={`testi-name-${item.id}`}
                          style={{ fontWeight: 500 }}
                          className="text-base text-neutral-900 tracking-tight leading-snug"
                        >
                          {item.authorName}
                        </h4>
                      )}
                      {item.authorRole && (
                        <span
                          id={`testi-role-${item.id}`}
                          style={{ fontWeight: 300 }}
                          className="text-sm text-neutral-500 leading-snug"
                        >
                          {item.authorRole}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default TestiFeedbackDynamic;
