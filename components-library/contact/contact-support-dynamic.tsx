import React, { useState } from 'react';

export interface ContactSupportDynamicProps {
  heading?: string;
  description?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButtonText?: string;
  successMessage?: string;
  images?: string[];
  submitIcon?: React.ReactNode;
  onSubmit?: (data: { email: string; message: string }) => void;
}

export function ContactSupportDynamic({
  heading,
  description,
  emailLabel,
  emailPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitButtonText,
  successMessage,
  images,
  submitIcon,
  onSubmit,
}: ContactSupportDynamicProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ email, message });
    }
    setHasSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const firstImage = images && images.length > 0 ? images[0] : null;
  const gridImages = images && images.length > 1 ? images.slice(1, 5) : [];

  return (
    <section
      onKeyDown={handleKeyDown}
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full bg-[#cbd2be] py-16 px-6 sm:px-12 md:py-24 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 select-none"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {images && images.length > 0 && (
        <div className="w-full lg:w-1/2 flex flex-row items-center justify-center gap-4 sm:gap-6 shrink-0 order-2 lg:order-1">
          {firstImage && (
            <div className="relative w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[24rem] lg:h-[24rem] rounded-full overflow-hidden shrink-0 shadow-lg bg-green-50/10">
              <img
                src={firstImage}
                alt="Main Support Visual"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {gridImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
              {gridImages.map((img, idx) => (
                img ? (
                  <div
                    key={idx}
                    className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-md bg-green-50/10"
                  >
                    <img
                      src={img}
                      alt={`Support Visual Detail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full lg:w-1/2 max-w-lg flex flex-col justify-center order-1 lg:order-2">
        {heading && (
          <h2
            style={{ fontWeight: 500 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-[#112d1b] tracking-tight mb-4"
          >
            {heading}
          </h2>
        )}

        {description && (
          <p
            style={{ fontWeight: 300 }}
            className="text-sm sm:text-base text-[#2e4737] leading-relaxed mb-8 max-w-md"
          >
            {description}
          </p>
        )}

        <div className="w-full flex flex-col gap-6">
          {emailLabel && (
            <div className="flex flex-col w-full">
              <label
                style={{ fontWeight: 300 }}
                className="text-[#2e4737]/80 text-xs uppercase tracking-wider mb-1"
              >
                {emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontWeight: 300 }}
                placeholder={emailPlaceholder || ''}
                className="w-full bg-transparent border-b border-[#2e4737]/30 text-[#112d1b] py-2 focus:border-[#112d1b] outline-none transition-colors"
              />
            </div>
          )}

          {messageLabel && (
            <div className="flex flex-col w-full">
              <label
                style={{ fontWeight: 300 }}
                className="text-[#2e4737]/80 text-xs uppercase tracking-wider mb-1"
              >
                {messageLabel}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                style={{ fontWeight: 300 }}
                placeholder={messagePlaceholder || ''}
                className="w-full bg-transparent border-b border-[#2e4737]/30 text-[#112d1b] py-2 focus:border-[#112d1b] outline-none transition-colors resize-none"
              />
            </div>
          )}

          {submitButtonText && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <button
                onClick={handleSubmit}
                style={{ fontWeight: 300 }}
                className="px-8 py-3 bg-[#112d1b] hover:bg-[#1b3d26] text-white rounded-full transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 max-w-xs uppercase tracking-wider text-sm select-none"
              >
                {submitIcon && <span className="inline-flex shrink-0">{submitIcon}</span>}
                <span>{submitButtonText}</span>
              </button>

              {hasSubmitted && successMessage && (
                <span
                  style={{ fontWeight: 300 }}
                  className="text-sm text-[#112d1b] bg-white/20 px-3 py-1.5 rounded-md animate-fade-in"
                >
                  {successMessage}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactSupportDynamic;
