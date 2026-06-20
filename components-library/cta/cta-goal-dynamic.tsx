import * as React from 'react';

export interface CtaGoalDynamicProps {
  badgeCategory?: string;
  badgeText?: string;
  heading?: string;
  description?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  onSubscribe?: (email: string) => void;
}

export function CtaGoalDynamic({
  badgeCategory,
  badgeText,
  heading,
  description,
  inputPlaceholder,
  buttonText,
  onSubscribe,
}: CtaGoalDynamicProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    if (onSubscribe && email.trim()) {
      onSubscribe(email);
    }
  };

  const hasBadge = badgeCategory || badgeText;
  const hasForm = inputPlaceholder || buttonText;

  return (
    <section
      id="cta-goal-dynamic-root"
      className="w-full px-4 py-8 sm:py-12 md:py-16 flex justify-center items-center"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Styled Card Container based on screenshot */}
      <div
        id="cta-goal-card"
        className="w-full max-w-5xl bg-[#e6f5eb] rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Badge Pill representing a premium subtle highlighted border */}
        {hasBadge && (
          <div
            id="cta-pill-badge"
            className="inline-flex items-center gap-2.5 border border-[#00875a]/30 bg-white/80 backdrop-blur-sm rounded-full p-1 pr-3.5 mb-6 md:mb-8 transition-colors select-none"
          >
            {badgeCategory && (
              <span
                id="cta-badge-category"
                className="bg-[#00875a] text-white rounded-full px-3 py-1 text-xs tracking-wide"
                style={{ fontWeight: 300 }}
              >
                {badgeCategory}
              </span>
            )}
            {badgeText && (
              <span
                id="cta-badge-text"
                className="text-[#00875a] text-xs sm:text-sm tracking-wide"
                style={{ fontWeight: 300 }}
              >
                {badgeText}
              </span>
            )}
          </div>
        )}

        {/* Primary Heading with Medium Weight (500) */}
        {heading && (
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl text-gray-900 tracking-tight leading-[1.15] max-w-3xl mx-auto mb-5 md:mb-6"
            style={{ fontWeight: 500 }}
          >
            {heading}
          </h2>
        )}

        {/* Paragraph text with Light Weight (300) */}
        {description && (
          <p
            id="cta-description"
            className="text-gray-600/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10"
            style={{ fontWeight: 300 }}
          >
            {description}
          </p>
        )}

        {/* Subscription Interactive Input block (no html form tag used) */}
        {hasForm && (
          <div
            id="cta-form-container"
            className="w-full max-w-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          >
            <div
              id="cta-input-row"
              className="bg-white p-1.5 pl-4 sm:pl-5 rounded-full flex items-center shadow-md focus-within:ring-2 focus-within:ring-[#00875a]/30 transition-all"
            >
              {inputPlaceholder && (
                <input
                  id="cta-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="bg-transparent border-0 outline-none flex-grow text-gray-800 placeholder-gray-400 text-sm sm:text-base w-full min-w-0 pr-3 focus:ring-0 focus:outline-none"
                  style={{ fontWeight: 300 }}
                />
              )}
              {buttonText && (
                <button
                  id="cta-submit-button"
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#00875a] hover:bg-[#00734d] text-white text-sm sm:text-base py-2.5 px-6 sm:px-8 rounded-full transition-all shrink-0 cursor-pointer active:scale-95 border-0 outline-none"
                  style={{ fontWeight: 300 }}
                >
                  {buttonText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CtaGoalDynamic;
