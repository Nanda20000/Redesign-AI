import * as React from 'react';

export interface CtaDriveDynamicProps {
  heading?: string;
  description?: string;
  cardText?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  privacyTextPrefix?: string;
  privacyLinkText?: string;
  privacyLinkUrl?: string;
  onButtonClick?: (email: string) => void;
}

export function CtaDriveDynamic({
  heading,
  description,
  cardText,
  inputPlaceholder,
  buttonText,
  privacyTextPrefix,
  privacyLinkText,
  privacyLinkUrl,
  onButtonClick,
}: CtaDriveDynamicProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    if (onButtonClick && email) {
      onButtonClick(email);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // If no content props are passed, render null
  if (!heading && !description && !cardText && !inputPlaceholder && !buttonText && !privacyTextPrefix && !privacyLinkText) {
    return null;
  }

  return (
    <section
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="bg-[#0b1329] text-white py-20 px-6 sm:px-12 lg:px-24 flex items-center justify-center overflow-hidden relative"
      id="cta-drive-container"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

        {/* Left Side Content */}
        {(heading || description) && (
          <div className="flex-1 max-w-xl text-left" id="cta-left-content">
            {heading && (
              <h2
                style={{ fontWeight: 500 }}
                className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-4 text-white"
                id="cta-heading"
              >
                {heading}
              </h2>
            )}
            {description && (
              <p
                style={{ fontWeight: 300 }}
                className="text-base sm:text-lg text-slate-400"
                id="cta-description"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Right Side Content with Glassmorphic Card & Borders */}
        {(cardText || inputPlaceholder || buttonText || privacyTextPrefix || privacyLinkText) && (
          <div
            className="relative w-full max-w-xl lg:max-w-lg flex-1 shrink-0"
            id="cta-right-wrapper"
            onKeyDown={handleKeyDown}
          >
            {/* Visual Decorative Shapes behind the glassy card */}
            <div
              className="absolute -top-7 -right-7 w-44 h-44 border-[10px] border-[#60cbf5]/60 rounded-tr-[48px] pointer-events-none z-0"
              id="decor-top-right"
            />
            <div
              className="absolute -bottom-7 -left-7 w-44 h-44 border-[10px] border-[#60cbf5]/60 rounded-bl-[48px] pointer-events-none z-0"
              id="decor-bottom-left"
            />

            {/* Glassmorphic Card */}
            <div
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-8 sm:p-10 rounded-2xl relative z-10 shadow-2xl"
              id="cta-glass-card"
            >
              {cardText && (
                <p
                  style={{ fontWeight: 300 }}
                  className="text-sm sm:text-base text-slate-200 mb-8 leading-relaxed"
                  id="cta-card-text"
                >
                  {cardText}
                </p>
              )}

              {(inputPlaceholder || buttonText) && (
                <div className="flex flex-col sm:flex-row gap-4 mb-4" id="cta-input-group">
                  {inputPlaceholder && (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={inputPlaceholder}
                      style={{ fontWeight: 300 }}
                      className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg outline-none border border-transparent focus:border-cyan-400 transition"
                      id="cta-email-input"
                    />
                  )}
                  {buttonText && (
                    <button
                      onClick={handleSubmit}
                      style={{ fontWeight: 300 }}
                      className="px-6 py-3 bg-[#0d1627] text-white hover:bg-[#1a2c4e] active:scale-95 border border-slate-700 rounded-lg transition whitespace-nowrap"
                      id="cta-submit-button"
                    >
                      {buttonText}
                    </button>
                  )}
                </div>
              )}

              {(privacyTextPrefix || privacyLinkText) && (
                <p
                  style={{ fontWeight: 300 }}
                  className="text-xs text-slate-400"
                  id="cta-privacy-note"
                >
                  {privacyTextPrefix && (
                    <span style={{ fontWeight: 300 }} id="cta-privacy-prefix">
                      {privacyTextPrefix}{' '}
                    </span>
                  )}
                  {privacyLinkText && (
                    <a
                      href={privacyLinkUrl || '#'}
                      style={{ fontWeight: 300 }}
                      className="underline hover:text-cyan-400 transition"
                      id="cta-privacy-link"
                    >
                      {privacyLinkText}
                    </a>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default CtaDriveDynamic;
