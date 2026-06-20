import React from 'react';

export interface CtaClickDynamicProps {
  heading?: string;
  ctaIcon?: React.ReactNode;
  onClick?: () => void;
}

export function CtaClickDynamic({ heading, ctaIcon, onClick }: CtaClickDynamicProps) {
  // If we don't have heading and don't have ctaIcon, render nothing
  if (!heading && !ctaIcon) {
    return null;
  }

  return (
    <section
      id="cta-section"
      className="w-full max-w-5xl mx-auto px-4 py-8"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div
        id="cta-card"
        className="relative overflow-hidden bg-[#1a56db] rounded-[1.75rem] p-8 sm:p-12 md:p-16 flex flex-col justify-end min-h-[220px] sm:min-h-[240px] shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] group"
      >
        <div className="flex flex-row items-end justify-between gap-6 w-full">
          <div className="flex-1">
            {heading && (
              <h2
                id="cta-heading"
                style={{ fontWeight: 500 }}
                className="text-white text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight break-words whitespace-pre-line"
              >
                {heading}
              </h2>
            )}
          </div>

          {ctaIcon && (
            <button
              id="cta-button"
              onClick={onClick}
              style={{ fontWeight: 300 }}
              className="flex items-center justify-center bg-white text-[#1a56db] hover:bg-opacity-95 active:scale-95 transition-all duration-200 w-16 h-12 sm:w-20 sm:h-14 rounded-2xl shrink-0 shadow-sm cursor-pointer self-end mb-1"
              aria-label="Call to action"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {ctaIcon}
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default CtaClickDynamic;
