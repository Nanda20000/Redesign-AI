import React, { useState } from 'react';

export interface ContactHelpDynamicProps {
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  heading?: string;
  descriptionText?: string;
  phoneIcon?: React.ReactNode;
  phoneText?: string;
  addressIcon?: React.ReactNode;
  addressText?: string;
  emailIcon?: React.ReactNode;
  emailText?: string;
  formNameLabel?: string;
  formNamePlaceholder?: string;
  formPhoneLabel?: string;
  formPhonePlaceholder?: string;
  formServicesLabel?: string;
  formServicesPlaceholder?: string;
  formServicesOptions?: string[];
  submitIcon?: React.ReactNode;
  submitText?: string;
  dropdownChevronIcon?: React.ReactNode;
  onSubmit?: (data: { name: string; phoneAndEmail: string; service: string }) => void;
}

export function ContactHelpDynamic({
  badgeIcon,
  badgeText,
  heading,
  descriptionText,
  phoneIcon,
  phoneText,
  addressIcon,
  addressText,
  emailIcon,
  emailText,
  formNameLabel,
  formNamePlaceholder,
  formPhoneLabel,
  formPhonePlaceholder,
  formServicesLabel,
  formServicesPlaceholder,
  formServicesOptions,
  submitIcon,
  submitText,
  dropdownChevronIcon,
  onSubmit,
}: ContactHelpDynamicProps) {
  const [name, setName] = useState('');
  const [phoneAndEmail, setPhoneAndEmail] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFormSubmit = () => {
    if (onSubmit) {
      onSubmit({ name, phoneAndEmail, service: selectedService });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleFormSubmit();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="w-full bg-[#E5E5E5] p-4 sm:p-8 md:p-12 lg:p-16 flex justify-center items-center"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="bg-white shadow-xl rounded-[32px] md:rounded-[48px] p-6 sm:p-10 md:p-14 lg:p-16 max-w-5xl w-full flex flex-col md:flex-row gap-10 md:gap-14 lg:gap-16 items-stretch">
        
        {/* Left Column (Text & Contacts) */}
        <div className="flex-1 flex flex-col justify-between gap-8 py-2">
          <div className="flex flex-col gap-6">
            {badgeText ? (
              <div 
                className="inline-flex self-start items-center gap-2 border border-[#FFD214] rounded-full p-1 bg-white select-none"
                style={{ fontWeight: 300 }}
              >
                {badgeIcon ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0D0E1C] text-white">
                    {badgeIcon}
                  </div>
                ) : null}
                <span className="text-[#FFC80A] text-xs sm:text-sm px-2" style={{ fontWeight: 300 }}>
                  {badgeText}
                </span>
              </div>
            ) : null}

            {heading ? (
              <h2 className="text-4xl sm:text-5xl tracking-tight text-neutral-900 leading-tight" style={{ fontWeight: 500 }}>
                {heading}
              </h2>
            ) : null}

            {descriptionText ? (
              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed" style={{ fontWeight: 300 }}>
                {descriptionText}
              </p>
            ) : null}
          </div>

          {/* Contact Details Section */}
          {(phoneText || addressText || emailText) ? (
            <div className="flex flex-col gap-5 pt-4">
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {phoneText ? (
                  <div className="flex items-center gap-3">
                    {phoneIcon ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D0E1C] text-white">
                        {phoneIcon}
                      </div>
                    ) : null}
                    <span className="text-sm md:text-base text-neutral-800" style={{ fontWeight: 300 }}>
                      {phoneText}
                    </span>
                  </div>
                ) : null}

                {addressText ? (
                  <div className="flex items-center gap-3">
                    {addressIcon ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D0E1C] text-white">
                        {addressIcon}
                      </div>
                    ) : null}
                    <span className="text-sm md:text-base text-neutral-800" style={{ fontWeight: 300 }}>
                      {addressText}
                    </span>
                  </div>
                ) : null}
              </div>

              {emailText ? (
                <div>
                  <div className="flex items-center gap-3">
                    {emailIcon ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D0E1C] text-white">
                        {emailIcon}
                      </div>
                    ) : null}
                    <span className="text-sm md:text-base text-neutral-800" style={{ fontWeight: 300 }}>
                      {emailText}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Right Column (Yellow Form block) */}
        <div className="w-full md:w-[400px] shrink-0 bg-[#FFD214] rounded-[24px] md:rounded-[36px] p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-6">
            
            {/* Name Input */}
            {formNameLabel || formNamePlaceholder ? (
              <div className="flex flex-col gap-2">
                {formNameLabel ? (
                  <label className="text-[#3E3200] text-sm tracking-wide" style={{ fontWeight: 300 }}>
                    {formNameLabel}
                  </label>
                ) : null}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={formNamePlaceholder}
                  className="w-full bg-[#FFE779] border-none rounded-2xl px-4 py-3.5 text-[#3E3200] placeholder-[#816C15] outline-none transition-all focus:bg-[#FFE052]"
                  style={{ fontWeight: 300 }}
                />
              </div>
            ) : null}

            {/* Email/Phone Input */}
            {formPhoneLabel || formPhonePlaceholder ? (
              <div className="flex flex-col gap-2">
                {formPhoneLabel ? (
                  <label className="text-[#3E3200] text-sm tracking-wide" style={{ fontWeight: 300 }}>
                    {formPhoneLabel}
                  </label>
                ) : null}
                <input
                  type="text"
                  value={phoneAndEmail}
                  onChange={(e) => setPhoneAndEmail(e.target.value)}
                  placeholder={formPhonePlaceholder}
                  className="w-full bg-[#FFE779] border-none rounded-2xl px-4 py-3.5 text-[#3E3200] placeholder-[#816C15] outline-none transition-all focus:bg-[#FFE052]"
                  style={{ fontWeight: 300 }}
                />
              </div>
            ) : null}

            {/* Services Dropdown Input */}
            {formServicesLabel || formServicesPlaceholder ? (
              <div className="flex flex-col gap-2 relative">
                {formServicesLabel ? (
                  <label className="text-[#3E3200] text-sm tracking-wide" style={{ fontWeight: 300 }}>
                    {formServicesLabel}
                  </label>
                ) : null}
                
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#FFE779] border-none rounded-2xl px-4 py-3.5 text-[#3E3200] hover:bg-[#FFE052] transition-colors cursor-pointer flex justify-between items-center select-none"
                  style={{ fontWeight: 300 }}
                >
                  <span style={{ fontWeight: 300 }}>
                    {selectedService || formServicesPlaceholder}
                  </span>
                  {dropdownChevronIcon ? (
                    <span className="shrink-0 text-[#816C15]">{dropdownChevronIcon}</span>
                  ) : (
                    <span className="shrink-0 text-[#816C15] text-xs">▼</span>
                  )}
                </div>

                {isDropdownOpen && formServicesOptions && formServicesOptions.length > 0 ? (
                  <div 
                    className="absolute top-[100%] left-0 right-0 z-50 mt-2 bg-white border border-[#E5E5E5] rounded-2xl shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                    style={{ fontWeight: 300 }}
                  >
                    {formServicesOptions.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedService(option);
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-3 text-sm text-neutral-800 hover:bg-[#FFF9DB] hover:text-[#3E3200] cursor-pointer transition-colors"
                        style={{ fontWeight: 300 }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

          </div>

          {/* Submit Button */}
          {submitText ? (
            <button
              onClick={handleFormSubmit}
              className="inline-flex self-start items-center gap-4 rounded-full bg-white p-1.5 pr-6 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 outline-none select-none cursor-pointer"
              style={{ fontWeight: 300 }}
            >
              {submitIcon ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D0E1C] text-white">
                  {submitIcon}
                </div>
              ) : null}
              <span className="text-[#0D0E1C] text-base" style={{ fontWeight: 300 }}>
                {submitText}
              </span>
            </button>
          ) : null}

        </div>

      </div>
    </div>
  );
}

export default ContactHelpDynamic;
