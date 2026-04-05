/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ContactFormDynamicProps {
  title?: string;
  emailLabel?: string;
  email?: string;
  phoneLabel?: string;
  phone?: string;
  addressLabel?: string;
  address?: string;
  socialTitle?: string;
  socialLinks?: { icon: React.ReactNode; url: string }[];
  formNameLabel?: string;
  formNamePlaceholder?: string;
  formEmailLabel?: string;
  formEmailPlaceholder?: string;
  formMessageLabel?: string;
  formMessagePlaceholder?: string;
  formSubmitLabel?: string;
}

export const ContactFormDynamic: React.FC<ContactFormDynamicProps> = ({
  title,
  emailLabel,
  email,
  phoneLabel,
  phone,
  addressLabel,
  address,
  socialTitle,
  socialLinks,
  formNameLabel,
  formNamePlaceholder,
  formEmailLabel,
  formEmailPlaceholder,
  formMessageLabel,
  formMessagePlaceholder,
  formSubmitLabel,
}) => {
  if (!title && !email && !phone && !address && !formSubmitLabel) return null;

  return (
    <section 
      className="w-full bg-white py-16 px-6 md:px-12 lg:px-24 font-['Open_Sans',_sans-serif]"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          // Handle submit logic if needed
        }
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Left Column: Contact Info */}
        <div className="flex flex-col space-y-8">
          {title && (
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h2>
          )}

          <div className="space-y-6">
            {/* Email */}
            {(emailLabel || email) && (
              <div className="flex flex-col">
                {emailLabel && <span className="text-sm text-gray-500 mb-1">{emailLabel}</span>}
                {email && <span className="text-lg text-gray-900">{email}</span>}
              </div>
            )}

            {/* Phone */}
            {(phoneLabel || phone) && (
              <div className="flex flex-col">
                {phoneLabel && <span className="text-sm text-gray-500 mb-1">{phoneLabel}</span>}
                {phone && <span className="text-lg text-gray-900">{phone}</span>}
              </div>
            )}

            {/* Address */}
            {(addressLabel || address) && (
              <div className="flex flex-col">
                {addressLabel && <span className="text-sm text-gray-500 mb-1">{addressLabel}</span>}
                {address && (
                  <div className="text-lg text-gray-900 whitespace-pre-line leading-relaxed">
                    {address}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Links */}
          {(socialTitle || (socialLinks && socialLinks.length > 0)) && (
            <div className="pt-4">
              {socialTitle && <h3 className="text-sm text-gray-500 mb-4">{socialTitle}</h3>}
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Form */}
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Field */}
            {(formNameLabel || formNamePlaceholder) && (
              <div className="flex flex-col space-y-2">
                {formNameLabel && (
                  <label className="text-sm font-medium text-gray-900">
                    {formNameLabel}
                  </label>
                )}
                <input
                  type="text"
                  placeholder={formNamePlaceholder}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-200 outline-none placeholder:text-gray-400"
                />
              </div>
            )}

            {/* Email Field */}
            {(formEmailLabel || formEmailPlaceholder) && (
              <div className="flex flex-col space-y-2">
                {formEmailLabel && (
                  <label className="text-sm font-medium text-gray-900">
                    {formEmailLabel}
                  </label>
                )}
                <input
                  type="email"
                  placeholder={formEmailPlaceholder}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-200 outline-none placeholder:text-gray-400"
                />
              </div>
            )}
          </div>

          {/* Message Field */}
          {(formMessageLabel || formMessagePlaceholder) && (
            <div className="flex flex-col space-y-2">
              {formMessageLabel && (
                <label className="text-sm font-medium text-gray-900">
                  {formMessageLabel}
                </label>
              )}
              <textarea
                placeholder={formMessagePlaceholder}
                rows={6}
                className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-200 outline-none placeholder:text-gray-400 resize-none"
              />
            </div>
          )}

          {/* Submit Button */}
          {formSubmitLabel && (
            <button
              type="button"
              className="w-full py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors mt-4"
            >
              {formSubmitLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactFormDynamic;
