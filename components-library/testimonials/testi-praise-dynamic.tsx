import React, { useState } from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TestimonialItem {
  id: string | number;
  quote?: string;
  ratingText?: string;
  authorName?: string;
  authorRole?: string;
  authorImage?: string;
}

export interface TestiPraiseDynamicProps {
  items?: TestimonialItem[];
  quoteIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  dividerText?: string;
}

export function TestiPraiseDynamic({
  items,
  quoteIcon,
  prevIcon,
  nextIcon,
  dividerText,
}: TestiPraiseDynamicProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const formatIndex = (index: number) => {
    const num = index + 1;
    return num < 10 ? `0${num}` : `${num}`;
  };

  const formatTotal = (total: number) => {
    return total < 10 ? `0${total}` : `${total}`;
  };

  return (
    <section
      id="testi-praise-dynamic-root"
      className="w-full flex flex-col items-center justify-center py-12 px-4 transition-all duration-300"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Main card */}
      <div
        id="testi-praise-card"
        className="relative bg-white rounded-[24px] overflow-visible w-full max-w-[860px] shadow-sm flex flex-col md:flex-row min-h-[250px] md:min-h-[290px]"
      >
        {/* Left side Image Container */}
        {currentItem?.authorImage && (
          <div
            id="testi-praise-img-container"
            className="w-full md:w-[40%] min-h-[220px] md:min-h-[290px] relative overflow-hidden rounded-t-[24px] md:rounded-tr-none md:rounded-l-[24px]"
          >
            <img
              id="testi-praise-avatar"
              src={currentItem.authorImage}
              alt={currentItem.authorName || ""}
              className="w-full h-full object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Floating Quote Badge overlapping the image and text section divider */}
        {quoteIcon && (
          <span
            id="testi-praise-quote-badge"
            className="absolute z-10 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md left-1/2 md:left-[40%] top-[220px] md:top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ fontWeight: 300 }}
          >
            {quoteIcon}
          </span>
        )}

        {/* Right side Text Container */}
        <div
          id="testi-praise-text-container"
          className="w-full md:w-[60%] flex flex-col justify-center gap-y-5 p-6 md:p-8 md:pl-12 min-h-[200px] md:min-h-full"
        >
          {/* Quote & Rating */}
          <div id="testi-praise-content-top" className="space-y-2">
            {currentItem?.quote && (
              <h2
                id="testi-praise-quote-heading"
                className="text-2xl md:text-[28px] text-black leading-snug tracking-tight"
                style={{ fontWeight: 500 }}
              >
                {currentItem.quote}
              </h2>
            )}

            {currentItem?.ratingText && (
              <p
                id="testi-praise-rating-text"
                className="text-xs tracking-wider text-gray-500"
                style={{ fontWeight: 300 }}
              >
                {currentItem.ratingText}
              </p>
            )}
          </div>

          {/* Footer of Card: Chef Details + Pagination Indicator */}
          <div
            id="testi-praise-footer-container"
            className="flex items-end justify-between mt-2 pt-3 border-t border-gray-100"
          >
            {/* Author */}
            <div id="testi-praise-author-info">
              {currentItem?.authorName && (
                <h4
                  id="testi-praise-author-name"
                  className="text-base text-gray-900"
                  style={{ fontWeight: 500 }}
                >
                  {currentItem.authorName}
                </h4>
              )}
              {currentItem?.authorRole && (
                <p
                  id="testi-praise-author-role"
                  className="text-xs text-gray-500 mt-0.5"
                  style={{ fontWeight: 300 }}
                >
                  {currentItem.authorRole}
                </p>
              )}
            </div>

            {/* Pagination numbers */}
            {items.length > 1 && (
              <div
                id="testi-praise-pagination"
                className="flex items-center space-x-2 text-xs md:text-sm text-gray-400 select-none"
              >
                <span
                  id="testi-praise-number-active"
                  className="text-gray-800"
                  style={{ fontWeight: 300 }}
                >
                  {formatIndex(currentIndex)}
                </span>
                {dividerText && (
                  <span
                    id="testi-praise-divider"
                    className="text-gray-300 tracking-widest px-1"
                    style={{ fontWeight: 300 }}
                  >
                    {dividerText}
                  </span>
                )}
                <span
                  id="testi-praise-number-total"
                  style={{ fontWeight: 300 }}
                >
                  {formatTotal(items.length)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Controls Below Card */}
      {items.length > 1 && (
        <div
          id="testi-praise-controls"
          className="flex items-center space-x-4 mt-8"
        >
          {/* Prev Button */}
          {prevIcon && (
            <button
              id="testi-praise-prev-btn"
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-[#ecf2e1]/80 hover:bg-[#ecf2e1] active:scale-95 transition-all flex items-center justify-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#cbdbaf]"
              style={{ fontWeight: 300 }}
            >
              {prevIcon}
            </button>
          )}

          {/* Next Button */}
          {nextIcon && (
            <button
              id="testi-praise-next-btn"
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
              style={{ fontWeight: 300 }}
            >
              {nextIcon}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default TestiPraiseDynamic;
