import React, { useState } from "react";

export interface ContactItem {
  icon?: React.ReactNode;
  text?: string;
}

export interface ContactReachDynamicProps {
  backgroundImageUrl?: string;
  titleLine?: string;
  brandName?: string;
  brandIcon?: React.ReactNode;
  description?: string;
  contactItems?: ContactItem[];
  formTitle?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  servicesLabel?: string;
  servicesPlaceholder?: string;
  servicesOptions?: string[];
  servicesIcon?: React.ReactNode;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButtonText?: string;
  onSubmitContactForm?: (data: { name: string; email: string; service: string; message: string }) => void;
}

export function ContactReachDynamic({
  backgroundImageUrl,
  titleLine,
  brandName,
  brandIcon,
  description,
  contactItems,
  formTitle,
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  servicesLabel,
  servicesPlaceholder,
  servicesOptions,
  servicesIcon,
  messageLabel,
  messagePlaceholder,
  submitButtonText,
  onSubmitContactForm,
}: ContactReachDynamicProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (onSubmitContactForm) {
      onSubmitContactForm({ name, email, service, message });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit();
    }
  };

  return (
    <div
      id="contact-reach-dynamic-root"
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="relative w-full"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <section
        style={{
          backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-[550px] p-6 sm:p-10 md:p-14 lg:p-20 flex flex-col md:flex-row items-stretch justify-between gap-12 bg-neutral-900"
      >
        {/* Dark elegant overlay for legibility */}
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

        {/* Left column info */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-6 text-white max-w-xl">
          <div className="flex flex-col gap-3">
            {titleLine && (
              <h2
                style={{ fontWeight: 500 }}
                className="text-3xl sm:text-4xl md:text-5xl leading-tight"
              >
                {titleLine}
              </h2>
            )}

            {(brandIcon || brandName) && (
              <div className="flex items-center gap-3">
                {brandIcon && (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-500 shadow-md shrink-0">
                    {brandIcon}
                  </div>
                )}
                {brandName && (
                  <span
                    style={{ fontWeight: 300 }}
                    className="text-3xl sm:text-4xl md:text-5xl italic leading-none"
                  >
                    {brandName}
                  </span>
                )}
              </div>
            )}
          </div>

          {description && (
            <p
              style={{ fontWeight: 300 }}
              className="text-white/80 text-sm sm:text-base leading-relaxed max-w-md mt-2"
            >
              {description}
            </p>
          )}

          {contactItems && contactItems.length > 0 && (
            <div className="flex flex-col gap-4 mt-6">
              {contactItems.map((item, index) => {
                if (!item.text && !item.icon) return null;
                return (
                  <div key={index} className="flex items-center gap-4">
                    {item.icon && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-500 shadow-sm shrink-0">
                        {item.icon}
                      </div>
                    )}
                    {item.text && (
                      <span
                        style={{ fontWeight: 300 }}
                        className="text-white/95 text-sm sm:text-base"
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

        {/* Right column form */}
        <div className="relative z-10 w-full md:w-[450px] shrink-0 flex items-center">
          <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
            {formTitle && (
              <h3
                style={{ fontWeight: 500 }}
                className="text-2xl text-stone-800 mb-6 leading-normal"
              >
                {formTitle}
              </h3>
            )}

            <div onKeyDown={handleKeyDown} className="flex flex-col gap-4">
              {/* Name Block */}
              {(nameLabel || namePlaceholder) && (
                <div className="flex flex-col gap-1">
                  {nameLabel && (
                    <label
                      style={{ fontWeight: 300 }}
                      className="text-xs text-stone-600 uppercase tracking-widest"
                    >
                      {nameLabel}
                    </label>
                  )}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={namePlaceholder}
                    style={{ fontWeight: 300 }}
                    className="w-full px-4 py-3 rounded-full border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:border-pink-300 transition duration-200"
                  />
                </div>
              )}

              {/* Email Block */}
              {(emailLabel || emailPlaceholder) && (
                <div className="flex flex-col gap-1">
                  {emailLabel && (
                    <label
                      style={{ fontWeight: 300 }}
                      className="text-xs text-stone-600 uppercase tracking-widest"
                    >
                      {emailLabel}
                    </label>
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={emailPlaceholder}
                    style={{ fontWeight: 300 }}
                    className="w-full px-4 py-3 rounded-full border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:border-pink-300 transition duration-200"
                  />
                </div>
              )}

              {/* Services Block */}
              {(servicesLabel || servicesPlaceholder || (servicesOptions && servicesOptions.length > 0)) && (
                <div className="flex flex-col gap-1 relative">
                  {servicesLabel && (
                    <label
                      style={{ fontWeight: 300 }}
                      className="text-xs text-stone-600 uppercase tracking-widest"
                    >
                      {servicesLabel}
                    </label>
                  )}
                  <div className="relative">
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      style={{ fontWeight: 300 }}
                      className="w-full px-4 py-3 rounded-full border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:border-pink-300 transition duration-200 appearance-none cursor-pointer pr-10"
                    >
                      {servicesPlaceholder && (
                        <option value="" disabled className="text-stone-400">
                          {servicesPlaceholder}
                        </option>
                      )}
                      {servicesOptions?.map((opt, i) => (
                        <option
                          style={{ fontWeight: 300 }}
                          key={i}
                          value={opt}
                          className="text-stone-800"
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                    {servicesIcon && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                        {servicesIcon}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message Block */}
              {(messageLabel || messagePlaceholder) && (
                <div className="flex flex-col gap-1">
                  {messageLabel && (
                    <label
                      style={{ fontWeight: 300 }}
                      className="text-xs text-stone-600 uppercase tracking-widest"
                    >
                      {messageLabel}
                    </label>
                  )}
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={messagePlaceholder}
                    style={{ fontWeight: 300 }}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:border-pink-300 transition duration-200 resize-none"
                  />
                </div>
              )}

              {/* Submit Button */}
              {submitButtonText && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{ fontWeight: 300 }}
                  className="w-full mt-3 py-3 rounded-full bg-pink-100/90 text-stone-800 text-sm hover:bg-pink-200 active:bg-pink-300 transition duration-200 cursor-pointer text-center"
                >
                  {submitButtonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactReachDynamic;
