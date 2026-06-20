import * as React from 'react';

export interface TestiQuoteDynamicProps {
  quoteText?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatarUrl?: string;
  testimonialImageUrl?: string;
  leftArrowIcon?: React.ReactNode;
  rightArrowIcon?: React.ReactNode;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
}

export function TestiQuoteDynamic({
  quoteText,
  authorName,
  authorRole,
  authorAvatarUrl,
  testimonialImageUrl,
  leftArrowIcon,
  rightArrowIcon,
  onLeftArrowClick,
  onRightArrowClick,
}: TestiQuoteDynamicProps) {
  if (!quoteText && !authorName && !testimonialImageUrl) {
    return null;
  }

  return (
    <section
      id="testi-quote-dynamic-root"
      className="w-full bg-white py-12 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div id="testi-quote-dynamic-container" className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left Column: Testimonial content, author, nav */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-8 md:space-y-12">
          <div className="space-y-6 md:space-y-8">
            {quoteText && (
              <blockquote id="testi-quote-dynamic-text">
                <p
                  style={{ fontWeight: 300 }}
                  className="text-neutral-800 text-xl md:text-2xl lg:text-3xl leading-relaxed"
                >
                  {quoteText}
                </p>
              </blockquote>
            )}

            {/* Author Profile */}
            {(authorAvatarUrl || authorName || authorRole) && (
              <div id="testi-author-block" className="flex items-center gap-4">
                {authorAvatarUrl && (
                  <img
                    id="testi-author-avatar"
                    src={authorAvatarUrl}
                    alt={authorName || ""}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-neutral-100 shadow-sm"
                  />
                )}
                {(authorName || authorRole) && (
                  <div id="testi-author-details" className="flex flex-col">
                    {authorName && (
                      <h4
                        id="testi-author-name"
                        style={{ fontWeight: 500 }}
                        className="text-neutral-900 text-base md:text-lg mb-0.5"
                      >
                        {authorName}
                      </h4>
                    )}
                    {authorRole && (
                      <span
                        id="testi-author-role"
                        style={{ fontWeight: 300 }}
                        className="text-neutral-500 text-sm"
                      >
                        {authorRole}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {(leftArrowIcon || rightArrowIcon) && (
            <div id="testi-nav-buttons" className="flex items-center gap-3 pt-4">
              {leftArrowIcon && (
                <button
                  id="testi-nav-btn-left"
                  onClick={onLeftArrowClick}
                  style={{ fontWeight: 300 }}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-950 text-white hover:bg-zinc-850 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 active:scale-95"
                >
                  {leftArrowIcon}
                </button>
              )}
              {rightArrowIcon && (
                <button
                  id="testi-nav-btn-right"
                  onClick={onRightArrowClick}
                  style={{ fontWeight: 300 }}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-950 text-white hover:bg-zinc-850 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 active:scale-95"
                >
                  {rightArrowIcon}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Featured Image */}
        {testimonialImageUrl && (
          <div id="testi-image-container" className="lg:col-span-5 w-full h-[300px] sm:h-[400px] lg:h-[480px]">
            <img
              id="testi-featured-image"
              src={testimonialImageUrl}
              alt={authorName || ""}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-3xl shadow-md border border-neutral-100"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default TestiQuoteDynamic;
