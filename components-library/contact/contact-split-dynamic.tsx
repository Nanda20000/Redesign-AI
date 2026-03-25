import React from 'react';

export interface ContactItem {
  icon?: React.ReactNode;
  text?: string;
}

export interface ContactSplitProps {
  title: string;
  description?: string;
  contactItems?: ContactItem[];
  formTitle?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButtonText?: string;
}

export const ContactSplit = ({
  title,
  description,
  contactItems = [],
  formTitle,
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  messageLabel,
  messagePlaceholder,
  submitButtonText,
}: ContactSplitProps) => {
  if (!title) return null;

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              {title && (
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-lg md:text-xl text-gray-500 max-w-[600px]">
                  {description}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {contactItems && contactItems.length > 0 && contactItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {item.icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                      {item.icon}
                    </div>
                  )}
                  {item.text && (
                    <span className="text-lg text-gray-600">{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Form Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl lg:p-12">
            {formTitle && (
              <h3 className="mb-8 text-2xl font-bold text-gray-900">
                {formTitle}
              </h3>
            )}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {nameLabel && (
                    <label className="text-sm font-medium text-gray-700">
                      {nameLabel} <span className="text-red-500">*</span>
                    </label>
                  )}
                  <input
                    type="text"
                    placeholder={namePlaceholder || ""}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  {emailLabel && (
                    <label className="text-sm font-medium text-gray-700">
                      {emailLabel} <span className="text-red-500">*</span>
                    </label>
                  )}
                  <input
                    type="email"
                    placeholder={emailPlaceholder || ""}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                {phoneLabel && (
                  <label className="text-sm font-medium text-gray-700">
                    {phoneLabel}
                  </label>
                )}
                <input
                  type="tel"
                  placeholder={phonePlaceholder || ""}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div className="space-y-2">
                {messageLabel && (
                  <label className="text-sm font-medium text-gray-700">
                    {messageLabel} <span className="text-red-500">*</span>
                  </label>
                )}
                <textarea
                  placeholder={messagePlaceholder || ""}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
                />
              </div>
              {submitButtonText && (
                <button
                  type="submit"
                  className="w-full rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  {submitButtonText}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSplit;
