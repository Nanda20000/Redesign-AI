import * as React from 'react';

export interface ContactInboxItem {
  id: string;
  icon?: React.ReactNode;
  text?: string;
}

export interface ContactInboxDynamicProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  titlePart1?: string;
  titlePart2?: string;
  description?: string;
  
  formNameLabel?: string;
  formNamePlaceholder?: string;
  formPhoneLabel?: string;
  formPhonePlaceholder?: string;
  formServiceLabel?: string;
  formServicePlaceholder?: string;
  formServiceOptions?: string[];
  
  formSubmitText?: string;
  formSubmitIcon?: React.ReactNode;
  selectArrowIcon?: React.ReactNode;
  
  items?: ContactInboxItem[];
  onSubmit?: (data: { name: string; phone: string; service: string }) => void;
}

export function ContactInboxDynamic({
  badgeText,
  badgeIcon,
  titlePart1,
  titlePart2,
  description,
  formNameLabel,
  formNamePlaceholder,
  formPhoneLabel,
  formPhonePlaceholder,
  formServiceLabel,
  formServicePlaceholder,
  formServiceOptions,
  formSubmitText,
  formSubmitIcon,
  selectArrowIcon,
  items,
  onSubmit,
}: ContactInboxDynamicProps) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [service, setService] = React.useState('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, phone, service });
    }
  };

  return (
    <section 
      id="contact-inbox-section"
      className="relative w-full overflow-hidden bg-white py-16 md:py-24"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div id="contact-container" className="mx-auto max-w-6xl px-4 lg:px-8">
        <div id="contact-grid" className="flex flex-col md:flex-row items-stretch justify-between gap-12 lg:gap-16">
          {/* Left Side: Contact Form Card */}
          <div 
            id="contact-card"
            className="relative w-full md:w-[48%] rounded-3xl p-8 lg:p-10 bg-[#075354] text-white flex flex-col justify-between shadow-lg overflow-hidden min-h-[500px]"
          >
            {/* Fine grid pattern overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none rounded-3xl overflow-hidden">
              <div 
                className="w-full h-full" 
                style={{ 
                  backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', 
                  backgroundSize: '40px 40px' 
                }} 
              />
            </div>

            {/* Inputs & Form layout container */}
            <div id="form-fields-wrapper" className="flex flex-col gap-6 z-10 w-full">
              {/* Name field */}
              {(formNameLabel || formNamePlaceholder) && (
                <div id="name-field-group" className="flex flex-col w-full">
                  {formNameLabel && (
                    <label 
                      id="name-label"
                      style={{ fontWeight: 300, fontFamily: 'inherit' }} 
                      className="text-xs text-white/70 tracking-wide mb-2 block"
                    >
                      {formNameLabel}
                    </label>
                  )}
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={formNamePlaceholder || undefined}
                    style={{ fontWeight: 300, fontFamily: 'inherit' }}
                    className="w-full rounded-2xl bg-white/10 p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/5 transition-all text-sm"
                  />
                </div>
              )}

              {/* Phone field */}
              {(formPhoneLabel || formPhonePlaceholder) && (
                <div id="phone-field-group" className="flex flex-col w-full">
                  {formPhoneLabel && (
                    <label 
                      id="phone-label"
                      style={{ fontWeight: 300, fontFamily: 'inherit' }} 
                      className="text-xs text-white/70 tracking-wide mb-2 block"
                    >
                      {formPhoneLabel}
                    </label>
                  )}
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={formPhonePlaceholder || undefined}
                    style={{ fontWeight: 300, fontFamily: 'inherit' }}
                    className="w-full rounded-2xl bg-white/10 p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/5 transition-all text-sm"
                  />
                </div>
              )}

              {/* Services Dropdown */}
              {(formServiceLabel || formServicePlaceholder) && (
                <div id="service-field-group" className="flex flex-col w-full">
                  {formServiceLabel && (
                    <label 
                      id="service-label"
                      style={{ fontWeight: 300, fontFamily: 'inherit' }} 
                      className="text-xs text-white/70 tracking-wide mb-2 block"
                    >
                      {formServiceLabel}
                    </label>
                  )}
                  <div id="select-wrapper" className="relative w-full">
                    <select
                      id="service-select"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      style={{ fontWeight: 300, fontFamily: 'inherit' }}
                      className="w-full appearance-none rounded-2xl bg-white/10 p-4 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/5 transition-all text-sm"
                    >
                      {formServicePlaceholder && (
                        <option value="" style={{ fontWeight: 300, fontFamily: 'inherit' }} className="text-slate-800 bg-white">
                          {formServicePlaceholder}
                        </option>
                      )}
                      {formServiceOptions && formServiceOptions.map((opt) => (
                        <option 
                          key={opt} 
                          value={opt} 
                          style={{ fontWeight: 300, fontFamily: 'inherit' }} 
                          className="text-slate-800 bg-white"
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                    {selectArrowIcon && (
                      <div id="select-icon-container" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/100">
                        {selectArrowIcon}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {formSubmitText && (
              <div id="submit-wrapper" className="z-10 mt-8">
                <button
                  id="submit-button"
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-4 bg-[#bdf45d] text-[#075354] rounded-full p-1.5 pr-6 hover:opacity-95 transition-all cursor-pointer focus:outline-none"
                  style={{ fontWeight: 300, fontFamily: 'inherit' }}
                >
                  {formSubmitIcon && (
                    <div 
                      id="submit-icon-badge" 
                      className="w-11 h-11 rounded-full bg-[#1e292d] flex items-center justify-center text-[#bdf45d] shrink-0"
                    >
                      {formSubmitIcon}
                    </div>
                  )}
                  <span id="submit-button-text" style={{ fontWeight: 300, fontFamily: 'inherit' }} className="text-base font-medium">
                    {formSubmitText}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Description & Info items */}
          <div id="content-column" className="w-full md:w-[48%] flex flex-col justify-center gap-6 text-slate-800">
            {/* Badge pill */}
            {badgeText && (
              <div 
                id="branding-badge" 
                className="inline-flex items-center gap-2 bg-[#e8f5f4] border border-[#d6ebe9] text-[#075354] rounded-full p-1 pr-4 self-start"
              >
                {badgeIcon && (
                  <div 
                    id="badge-icon-badge" 
                    className="w-8 h-8 rounded-full bg-[#1e292d] flex items-center justify-center text-[#bdf45d] shrink-0"
                  >
                    {badgeIcon}
                  </div>
                )}
                <span id="badge-text" style={{ fontWeight: 300, fontFamily: 'inherit' }} className="text-sm">
                  {badgeText}
                </span>
              </div>
            )}

            {/* Title Part */}
            {(titlePart1 || titlePart2) && (
              <h2 id="heading-container" className="text-4xl lg:text-5xl tracking-tight text-[#1a2b2b] leading-tight" style={{ fontWeight: 500 }}>
                {titlePart1 && <span id="title-p1" className="block">{titlePart1}</span>}
                {titlePart2 && <span id="title-p2" className="text-[#0c6a69] italic block mt-1">{titlePart2}</span>}
              </h2>
            )}

            {/* Description Text */}
            {description && (
              <p 
                id="description-p" 
                className="text-slate-500 text-sm md:text-base leading-relaxed max-w-lg mt-2" 
                style={{ fontWeight: 300, fontFamily: 'inherit' }}
              >
                {description}
              </p>
            )}

            {/* Information Items */}
            {items && items.length > 0 && (
              <div id="info-items-row" className="flex flex-wrap items-center gap-6 md:gap-8 mt-8">
                {items.map((item, index) => {
                  if (!item.text && !item.icon) return null;
                  return (
                    <div id={`info-item-${item.id || index}`} key={item.id || index} className="flex items-center gap-3">
                      {item.icon && (
                        <div 
                          id={`info-item-icon-${item.id || index}`} 
                          className="w-12 h-9 rounded-xl bg-[#1e292d] text-[#bdf45d] flex items-center justify-center shrink-0"
                        >
                          {item.icon}
                        </div>
                      )}
                      {item.text && (
                        <span 
                          id={`info-item-text-${item.id || index}`} 
                          style={{ fontWeight: 300, fontFamily: 'inherit' }} 
                          className="text-sm text-[#1e292d] leading-normal"
                        >
                          {item.text}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactInboxDynamic;
