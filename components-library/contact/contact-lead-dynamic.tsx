import * as React from 'react';

export interface ContactLeadDynamicProps {
  // Section Headers
  tagText?: string;
  title?: string;
  description?: string;

  // Contact Info Items (Left Column)
  emailLabel?: string;
  emailValue?: string;
  emailIcon?: React.ReactNode;

  phoneLabel?: string;
  phoneValue?: string;
  phoneIcon?: React.ReactNode;

  officeLabel?: string;
  officeValue?: string;
  officeIcon?: React.ReactNode;

  // Form Fields (Right Column)
  nameLabel?: string;
  namePlaceholder?: string;
  lastNameLabel?: string;
  lastNamePlaceholder?: string;
  emailFieldLabel?: string;
  emailFieldPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButtonText?: string;

  // Submission handler
  onSubmit?: (data: {
    name: string;
    lastName: string;
    email: string;
    message: string;
  }) => void;
}

export function ContactLeadDynamic({
  tagText,
  title,
  description,
  emailLabel,
  emailValue,
  emailIcon,
  phoneLabel,
  phoneValue,
  phoneIcon,
  officeLabel,
  officeValue,
  officeIcon,
  nameLabel,
  namePlaceholder,
  lastNameLabel,
  lastNamePlaceholder,
  emailFieldLabel,
  emailFieldPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitButtonText,
  onSubmit,
}: ContactLeadDynamicProps) {
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // If user presses Command/Control + Enter inside form area, submit
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ name, lastName, email, message });
    }
  };

  return (
    <section
      id="contact-lead-dynamic"
      className="w-full bg-[#f4f5f6] rounded-[2rem] p-6 sm:p-8 md:p-12 lg:p-14 border border-[#e1e3e6]/60 shadow-[0_4px_30px_rgba(0,0,0,0.015)]"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        onKeyDown={handleKeyDown}
      >
        {/* Left Column (Info) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {tagText && (
              <div className="mb-4">
                <span
                  className="inline-block px-4 py-1.5 border border-[#111] rounded-full text-xs uppercase tracking-wider"
                  style={{ fontWeight: 300 }}
                >
                  {tagText}
                </span>
              </div>
            )}

            {title && (
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-[#111] leading-tight mb-4 tracking-tight"
                style={{ fontWeight: 500 }}
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                className="text-sm sm:text-base text-[#666] leading-relaxed mb-8 max-w-md"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Cards container */}
          <div className="space-y-4">
            {(emailLabel || emailValue) && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center space-x-4 border border-[#e1e3e6]/40 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-transform hover:translate-y-[-2px] duration-200">
                {emailIcon && (
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#0052ff] flex items-center justify-center text-white font-light">
                    {emailIcon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {emailLabel && (
                    <span
                      className="block text-[11px] uppercase tracking-wider text-[#999] mb-0.5"
                      style={{ fontWeight: 300 }}
                    >
                      {emailLabel}
                    </span>
                  )}
                  {emailValue && (
                    <h4
                      className="text-sm sm:text-base text-[#111] break-all truncate"
                      style={{ fontWeight: 500 }}
                    >
                      {emailValue}
                    </h4>
                  )}
                </div>
              </div>
            )}

            {(phoneLabel || phoneValue) && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center space-x-4 border border-[#e1e3e6]/40 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-transform hover:translate-y-[-2px] duration-200">
                {phoneIcon && (
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#0052ff] flex items-center justify-center text-white">
                    {phoneIcon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {phoneLabel && (
                    <span
                      className="block text-[11px] uppercase tracking-wider text-[#999] mb-0.5"
                      style={{ fontWeight: 300 }}
                    >
                      {phoneLabel}
                    </span>
                  )}
                  {phoneValue && (
                    <h4
                      className="text-sm sm:text-base text-[#111] break-all truncate"
                      style={{ fontWeight: 500 }}
                    >
                      {phoneValue}
                    </h4>
                  )}
                </div>
              </div>
            )}

            {(officeLabel || officeValue) && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center space-x-4 border border-[#e1e3e6]/40 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-transform hover:translate-y-[-2px] duration-200">
                {officeIcon && (
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#0052ff] flex items-center justify-center text-white">
                    {officeIcon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {officeLabel && (
                    <span
                      className="block text-[11px] uppercase tracking-wider text-[#999] mb-0.5"
                      style={{ fontWeight: 300 }}
                    >
                      {officeLabel}
                    </span>
                  )}
                  {officeValue && (
                    <h4
                      className="text-sm sm:text-base text-[#111] break-all truncate"
                      style={{ fontWeight: 500 }}
                    >
                      {officeValue}
                    </h4>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Form) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Row for Name / Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(nameLabel || namePlaceholder) && (
                <div className="flex flex-col">
                  {nameLabel && (
                    <label
                      className="text-sm text-[#111] mb-2"
                      style={{ fontWeight: 300 }}
                    >
                      {nameLabel}
                    </label>
                  )}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={namePlaceholder || ""}
                    className="w-full bg-white border border-[#e1e3e6] rounded-full px-5 py-3.5 text-sm text-[#111] placeholder-[#a0a5ad] focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all duration-150"
                    style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}
                  />
                </div>
              )}

              {(lastNameLabel || lastNamePlaceholder) && (
                <div className="flex flex-col">
                  {lastNameLabel && (
                    <label
                      className="text-sm text-[#111] mb-2"
                      style={{ fontWeight: 300 }}
                    >
                      {lastNameLabel}
                    </label>
                  )}
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={lastNamePlaceholder || ""}
                    className="w-full bg-white border border-[#e1e3e6] rounded-full px-5 py-3.5 text-sm text-[#111] placeholder-[#a0a5ad] focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all duration-150"
                    style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}
                  />
                </div>
              )}
            </div>

            {/* Email Address */}
            {(emailFieldLabel || emailFieldPlaceholder) && (
              <div className="flex flex-col">
                {emailFieldLabel && (
                  <label
                    className="text-sm text-[#111] mb-2"
                    style={{ fontWeight: 300 }}
                  >
                    {emailFieldLabel}
                  </label>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailFieldPlaceholder || ""}
                  className="w-full bg-white border border-[#e1e3e6] rounded-full px-5 py-3.5 text-sm text-[#111] placeholder-[#a0a5ad] focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all duration-150"
                  style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}
                />
              </div>
            )}

            {/* Message Area */}
            {(messageLabel || messagePlaceholder) && (
              <div className="flex flex-col">
                {messageLabel && (
                  <label
                    className="text-sm text-[#111] mb-2"
                    style={{ fontWeight: 300 }}
                  >
                    {messageLabel}
                  </label>
                )}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={messagePlaceholder || ""}
                  rows={6}
                  className="w-full bg-white border border-[#e1e3e6] rounded-3xl px-5 py-4 text-sm text-[#111] placeholder-[#a0a5ad] focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all duration-150 resize-none"
                  style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          {submitButtonText && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#0052ff] hover:bg-[#0047df] text-white py-4 px-6 rounded-full text-base transition-colors duration-150 shadow-[0_4px_14px_rgba(0,82,255,0.2)] focus:ring-2 focus:ring-[#0052ff]/50 focus:outline-none active:scale-[0.99] cursor-pointer animate-none"
                style={{ fontWeight: 300 }}
              >
                {submitButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactLeadDynamic;
