import * as React from 'react';

export interface ContactItem {
  id: string;
  text?: string;
  icon?: React.ReactNode;
}

export interface ContactOfficeDynamicProps {
  title?: string;
  fullNameLabel?: string;
  fullNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButtonText?: string;
  onSubmitClick?: (data: { fullName: string; email: string; message: string }) => void;
  cardTitle?: string;
  cardSubtitle?: string;
  contactItems?: ContactItem[];
}

export function ContactOfficeDynamic(props: ContactOfficeDynamicProps) {
  const {
    title,
    fullNameLabel,
    fullNamePlaceholder,
    emailLabel,
    emailPlaceholder,
    messageLabel,
    messagePlaceholder,
    submitButtonText,
    onSubmitClick,
    cardTitle,
    cardSubtitle,
    contactItems,
  } = props;

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onSubmitClick) {
      onSubmitClick({ fullName, email, message });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      if (onSubmitClick) {
        onSubmitClick({ fullName, email, message });
      }
    }
  };

  return (
    <section 
      onKeyDown={handleKeyDown}
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full bg-[#EAEAEA] py-16 px-6 sm:px-12 md:py-24 text-[#0B100D] overflow-hidden"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Title & Form */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            {title && (
              <h1 
                style={{ fontWeight: 500 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none m-0 select-none"
              >
                {title}
              </h1>
            )}

            <div className="flex flex-col gap-8 w-full max-w-xl">
              {/* Full Name Input */}
              {fullNameLabel !== undefined && fullNameLabel !== null && (
                <div className="flex flex-col gap-2">
                  <label 
                    style={{ fontWeight: 300 }}
                    className="text-sm tracking-wide text-zinc-600"
                  >
                    {fullNameLabel}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={fullNamePlaceholder ?? undefined}
                    style={{ fontWeight: 300 }}
                    className="w-full bg-transparent border-b border-zinc-400 focus:border-zinc-900 pb-2 pt-1 outline-none transition-colors"
                  />
                </div>
              )}

              {/* Email Input */}
              {emailLabel !== undefined && emailLabel !== null && (
                <div className="flex flex-col gap-2">
                  <label 
                    style={{ fontWeight: 300 }}
                    className="text-sm tracking-wide text-zinc-600"
                  >
                    {emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={emailPlaceholder ?? undefined}
                    style={{ fontWeight: 300 }}
                    className="w-full bg-transparent border-b border-zinc-400 focus:border-zinc-900 pb-2 pt-1 outline-none transition-colors"
                  />
                </div>
              )}

              {/* Message Input */}
              {messageLabel !== undefined && messageLabel !== null && (
                <div className="flex flex-col gap-2">
                  <label 
                    style={{ fontWeight: 300 }}
                    className="text-sm tracking-wide text-zinc-600"
                  >
                    {messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={messagePlaceholder ?? undefined}
                    style={{ fontWeight: 300 }}
                    className="w-full bg-transparent border-b border-zinc-400 focus:border-zinc-900 pb-2 pt-1 outline-none transition-colors resize-none"
                  />
                </div>
              )}

              {/* Submit Button */}
              {submitButtonText && (
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={{ fontWeight: 300 }}
                    className="bg-[#0B100D] text-[#C6F432] rounded-full px-10 py-3.5 text-base tracking-wide hover:opacity-90 active:scale-95 transition-all outline-none cursor-pointer"
                  >
                    {submitButtonText}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Contact Cards */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            {((cardTitle || cardSubtitle) || (contactItems && contactItems.length > 0)) && (
              <div className="w-full max-w-sm rounded-[2.5rem] bg-white shadow-xl shadow-zinc-200 overflow-hidden flex flex-col">
                
                {/* Black Section */}
                {(cardTitle || cardSubtitle) && (
                  <div className="bg-[#0B100D] text-[#FFFFFE] pt-12 pb-10 px-8 relative flex flex-col items-center justify-center text-center rounded-t-[2.5rem]">
                    {/* Retro Green Pins */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6F432] absolute top-4 left-4" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6F432] absolute top-4 right-4" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6F432] absolute bottom-4 left-4" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6F432] absolute bottom-4 right-4" />

                    {cardTitle && (
                      <h3 
                        style={{ fontWeight: 500 }}
                        className="text-lg md:text-xl tracking-tight leading-snug m-0 text-white"
                      >
                        {cardTitle}
                      </h3>
                    )}
                    {cardSubtitle && (
                      <p 
                        style={{ fontWeight: 300 }}
                        className="text-[#C6F432]/90 text-sm tracking-wide mt-1.5 mb-0"
                      >
                        {cardSubtitle}
                      </p>
                    )}
                  </div>
                )}

                {/* White Section with Contacts */}
                {contactItems && contactItems.length > 0 && (
                  <div className="bg-[#FFFFFE] py-8 px-6 flex flex-col gap-5 rounded-b-[2.5rem]">
                    {contactItems.map((item) => {
                      if (!item.text && !item.icon) return null;
                      return (
                        <div key={item.id} className="flex items-center gap-4">
                          {item.icon && (
                            <div className="w-11 h-11 rounded-full bg-[#0B100D] flex items-center justify-center text-[#C6F432] shrink-0">
                              {item.icon}
                            </div>
                          )}
                          {item.text && (
                            <span 
                              style={{ fontWeight: 300 }}
                              className="text-zinc-800 text-sm tracking-wide break-all"
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
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactOfficeDynamic;
