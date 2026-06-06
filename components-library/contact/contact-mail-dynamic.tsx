import * as React from 'react';

export interface ContactMailDynamicProps {
  // Left column variables
  title?: string;
  description?: string;
  address?: string;
  email?: string;
  
  // Custom Social media links & icons passed as react node props (no direct lucide imports)
  linkedinIcon?: React.ReactNode;
  linkedinUrl?: string;
  facebookIcon?: React.ReactNode;
  facebookUrl?: string;
  twitterIcon?: React.ReactNode;
  twitterUrl?: string;

  // Form input label / fields
  nameLabel?: string;
  emailLabel?: string;
  companyLabel?: string;
  phoneLabel?: string;
  messageLabel?: string;
  
  // Submit action label & feedback
  submitButtonText?: string;
  onSubmit?: (data: {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string;
  }) => void;
  successMessage?: string;
}

export function ContactMailDynamic({
  title,
  description,
  address,
  email,
  linkedinIcon,
  linkedinUrl,
  facebookIcon,
  facebookUrl,
  twitterIcon,
  twitterUrl,
  nameLabel,
  emailLabel,
  companyLabel,
  phoneLabel,
  messageLabel,
  submitButtonText,
  onSubmit,
  successMessage,
}: ContactMailDynamicProps) {
  const [name, setName] = React.useState('');
  const [emailValue, setEmailValue] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ name, email: emailValue, company, phone, message });
    }
    setIsSuccess(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full bg-[#FAF8F5] p-6 md:p-12 lg:p-20 flex items-center justify-center"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      {/* Outer rounded card closely matching the UI design */}
      <div className="w-full max-w-6xl bg-white rounded-[40px] p-8 md:p-16 lg:p-20 shadow-sm flex flex-col md:flex-row gap-12 md:gap-20">
        
        {/* Left Column containing title, paragraph, address info and social media icons */}
        <div className="flex-1 flex flex-col md:max-w-md">
          {title && (
            <h2
              style={{ fontWeight: 500 }}
              className="text-4xl md:text-5xl lg:text-6xl text-[#111] tracking-tight mb-6"
            >
              {title}
            </h2>
          )}
          
          {description && (
            <p
              style={{ fontWeight: 300 }}
              className="text-[#666] text-sm md:text-base leading-relaxed mb-10"
            >
              {description}
            </p>
          )}
          
          <div className="flex flex-col gap-4 mb-12">
            {address && (
              <p
                style={{ fontWeight: 300 }}
                className="text-[#333] text-sm md:text-base leading-relaxed whitespace-pre-line"
              >
                {address}
              </p>
            )}
            
            {email && (
              <p
                style={{ fontWeight: 300 }}
                className="text-[#333] text-sm md:text-base"
              >
                {email}
              </p>
            )}
          </div>
          
          {/* Social Icons footer circles formatted to style */}
          <div className="flex gap-4">
            {linkedinIcon && (
              <a
                href={linkedinUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[#0F6F52]/30 flex items-center justify-center text-[#0F6F52] hover:bg-[#0F6F52]/5 transition-colors"
                style={{ fontWeight: 300 }}
              >
                {linkedinIcon}
              </a>
            )}
            {facebookIcon && (
              <a
                href={facebookUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[#0F6F52]/30 flex items-center justify-center text-[#0F6F52] hover:bg-[#0F6F52]/5 transition-colors"
                style={{ fontWeight: 300 }}
              >
                {facebookIcon}
              </a>
            )}
            {twitterIcon && (
              <a
                href={twitterUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[#0F6F52]/30 flex items-center justify-center text-[#0F6F52] hover:bg-[#0F6F52]/5 transition-colors"
                style={{ fontWeight: 300 }}
              >
                {twitterIcon}
              </a>
            )}
          </div>
        </div>
        
        {/* Right Column / Inter-active form fields */}
        <div
          onKeyDown={handleKeyDown}
          className="flex-1 flex flex-col gap-8 justify-center"
        >
          {isSuccess && successMessage ? (
            <div className="flex flex-col items-center justify-center p-8 bg-green-50/50 rounded-2xl border border-green-100/50">
              <span
                style={{ fontWeight: 300 }}
                className="text-green-800 text-lg text-center"
              >
                {successMessage}
              </span>
            </div>
          ) : (
            <>
              {nameLabel && (
                <div className="flex flex-col gap-2">
                  <label
                    style={{ fontWeight: 300 }}
                    className="text-xs md:text-sm text-[#777]"
                  >
                    {nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-gray-200 outline-none focus:border-[#0F6F52] transition-colors text-[#333]"
                    style={{ fontWeight: 300 }}
                  />
                </div>
              )}
              
              {emailLabel && (
                <div className="flex flex-col gap-2">
                  <label
                    style={{ fontWeight: 300 }}
                    className="text-xs md:text-sm text-[#777]"
                  >
                    {emailLabel}
                  </label>
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-gray-200 outline-none focus:border-[#0F6F52] transition-colors text-[#333]"
                    style={{ fontWeight: 300 }}
                  />
                </div>
              )}
              
              {companyLabel && (
                <div className="flex flex-col gap-2">
                  <label
                    style={{ fontWeight: 300 }}
                    className="text-xs md:text-sm text-[#777]"
                  >
                    {companyLabel}
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-gray-200 outline-none focus:border-[#0F6F52] transition-colors text-[#333]"
                    style={{ fontWeight: 300 }}
                  />
                </div>
              )}
              
              {phoneLabel && (
                <div className="flex flex-col gap-2">
                  <label
                    style={{ fontWeight: 300 }}
                    className="text-xs md:text-sm text-[#777]"
                  >
                    {phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-gray-200 outline-none focus:border-[#0F6F52] transition-colors text-[#333]"
                    style={{ fontWeight: 300 }}
                  />
                </div>
              )}
              
              {messageLabel && (
                <div className="flex flex-col gap-2">
                  <label
                    style={{ fontWeight: 300 }}
                    className="text-xs md:text-sm text-[#777]"
                  >
                    {messageLabel}
                  </label>
                  <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-gray-200 outline-none focus:border-[#0F6F52] transition-colors resize-none text-[#333]"
                    style={{ fontWeight: 300 }}
                  />
                </div>
              )}
              
              {submitButtonText && (
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    className="bg-[#0F6F52] hover:bg-[#0C5841] text-white px-8 py-3 rounded-lg cursor-pointer transition-all duration-200 active:scale-95 flex items-center justify-center"
                    style={{ fontWeight: 300 }}
                  >
                    {submitButtonText}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default ContactMailDynamic;
