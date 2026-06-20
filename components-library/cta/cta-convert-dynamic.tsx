import * as React from 'react';

export interface CtaConvertDynamicProps {
  heading?: string;
  description?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  subtext?: string;
  linkText?: string;
  linkUrl?: string;
  onSubmitAction?: (email: string) => void;
}

export function CtaConvertDynamic({
  heading,
  description,
  inputLabel,
  inputPlaceholder,
  buttonText,
  subtext,
  linkText,
  linkUrl,
  onSubmitAction,
}: CtaConvertDynamicProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    if (onSubmitAction && email) {
      onSubmitAction(email);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // If none of the main elements are present, render nothing
  if (!heading && !description && !inputLabel && !inputPlaceholder && !buttonText) {
    return null;
  }

  return (
    <section
      id="cta-convert-dynamic-root"
      onKeyDown={handleKeyDown}
      className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-24"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="w-full bg-[#E05A17] rounded-[2.5rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 shadow-xl relative overflow-hidden">
        {/* Left Side Content */}
        <div className="flex-1 space-y-4 md:space-y-6">
          {heading && (
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight"
              style={{ fontWeight: 500 }}
            >
              {heading}
            </h2>
          )}
          {description && (
            <p
              className="text-base lg:text-lg text-white/90 leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Right Side Content */}
        <div className="w-full lg:w-auto lg:min-w-[400px] flex flex-col gap-4">
          {inputLabel && (
            <span
              className="text-white text-sm md:text-base tracking-wide"
              style={{ fontWeight: 300 }}
            >
              {inputLabel}
            </span>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {inputPlaceholder && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={inputPlaceholder}
                className="flex-1 w-full h-14 px-6 bg-[#fed7aa] text-[#4d160a] placeholder-[#8a5d42] rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                style={{ fontWeight: 300 }}
              />
            )}
            {buttonText && (
              <button
                onClick={handleSubmit}
                className="h-14 px-8 bg-[#80220c] hover:bg-[#661b0a] text-white rounded-2xl transition duration-200 text-base cursor-pointer flex items-center justify-center shrink-0"
                style={{ fontWeight: 300 }}
              >
                {buttonText}
              </button>
            )}
          </div>

          {(subtext || linkText) && (
            <p
              className="text-xs md:text-sm text-white/80"
              style={{ fontWeight: 300 }}
            >
              {subtext && <span style={{ fontWeight: 300 }}>{subtext} </span>}
              {linkText && (
                <a
                  href={linkUrl || undefined}
                  className="underline hover:text-white transition duration-150"
                  style={{ fontWeight: 300 }}
                >
                  {linkText}
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CtaConvertDynamic;
