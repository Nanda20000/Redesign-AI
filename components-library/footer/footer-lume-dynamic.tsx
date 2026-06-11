import React, { useState } from 'react';

export interface FooterLumeDynamicProps {
  // Brand / Column 1
  logoIcon?: React.ReactNode;
  logoText?: string;
  brandDescription?: string;
  socialLinks?: Array<{
    icon?: React.ReactNode;
    href?: string;
  }>;

  // Quick Links / Column 2
  col2Title?: string;
  col2Links?: Array<{
    label?: string;
    href?: string;
  }>;

  // Customer Service / Column 3
  col3Title?: string;
  col3Links?: Array<{
    label?: string;
    href?: string;
  }>;

  // Stay Connected / Column 4
  col4Title?: string;
  col4Description?: string;
  newsletterPlaceholder?: string;
  newsletterButtonIcon?: React.ReactNode;
  onNewsletterSubmit?: (email: string) => void;
  contactIcon?: React.ReactNode;
  contactEmail?: string;
  contactEmailHref?: string;

  // Bottom Area
  copyrightText?: string;
  privacyText?: string;
  privacyUrl?: string;
  termsText?: string;
  termsUrl?: string;
}

export function FooterLumeDynamic({
  logoIcon,
  logoText,
  brandDescription,
  socialLinks,
  col2Title,
  col2Links,
  col3Title,
  col3Links,
  col4Title,
  col4Description,
  newsletterPlaceholder,
  newsletterButtonIcon,
  onNewsletterSubmit,
  contactIcon,
  contactEmail,
  contactEmailHref,
  copyrightText,
  privacyText,
  privacyUrl,
  termsText,
  termsUrl,
}: FooterLumeDynamicProps) {
  const [email, setEmail] = useState('');

  return (
    <div
      className="w-full bg-white text-gray-850 py-16 px-6 md:px-12 lg:px-24 border-t border-gray-100"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-12">
        {/* Brand Column (Column 1) */}
        {((logoText) || (brandDescription) || (socialLinks && socialLinks.length > 0)) && (
          <div className="flex flex-col gap-4">
            {logoText && (
              <h2 className="text-2xl tracking-tight text-gray-950 flex items-center gap-2.5" style={{ fontWeight: 500 }}>
                {logoIcon && <span className="flex items-center shrink-0">{logoIcon}</span>}
                {logoText}
              </h2>
            )}
            {brandDescription && (
              <p className="text-sm text-gray-600 leading-relaxed max-w-sm" style={{ fontWeight: 300 }}>
                {brandDescription}
              </p>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex items-center gap-4.5 mt-2">
                {socialLinks.map((link, idx) => {
                  if (!link.icon) return null;
                  return (
                    <a
                      key={idx}
                      href={link.href || '#'}
                      className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                      style={{ fontWeight: 300 }}
                    >
                      {link.icon}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quick Links Column (Column 2) */}
        {((col2Title) || (col2Links && col2Links.length > 0)) && (
          <div className="flex flex-col gap-5">
            {col2Title && (
              <h4 className="text-sm uppercase tracking-wider text-gray-900" style={{ fontWeight: 500 }}>
                {col2Title}
              </h4>
            )}
            {col2Links && col2Links.length > 0 && (
              <ul className="flex flex-col gap-3">
                {col2Links.map((link, idx) => {
                  if (!link.label) return null;
                  return (
                    <li key={idx} className="flex">
                      <a
                        href={link.href || '#'}
                        className="text-sm text-gray-600 hover:text-gray-950 transition-colors"
                        style={{ fontWeight: 300 }}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Customer Service Column (Column 3) */}
        {((col3Title) || (col3Links && col3Links.length > 0)) && (
          <div className="flex flex-col gap-5">
            {col3Title && (
              <h4 className="text-sm uppercase tracking-wider text-gray-900" style={{ fontWeight: 500 }}>
                {col3Title}
              </h4>
            )}
            {col3Links && col3Links.length > 0 && (
              <ul className="flex flex-col gap-3">
                {col3Links.map((link, idx) => {
                  if (!link.label) return null;
                  return (
                    <li key={idx} className="flex">
                      <a
                        href={link.href || '#'}
                        className="text-sm text-gray-600 hover:text-gray-950 transition-colors"
                        style={{ fontWeight: 300 }}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Stay Connected Column (Column 4) */}
        {((col4Title) || (col4Description) || (newsletterPlaceholder) || (contactEmail)) && (
          <div className="flex flex-col gap-5">
            {col4Title && (
              <h4 className="text-sm uppercase tracking-wider text-gray-900" style={{ fontWeight: 500 }}>
                {col4Title}
              </h4>
            )}
            {col4Description && (
              <p className="text-sm text-gray-600 leading-relaxed" style={{ fontWeight: 300 }}>
                {col4Description}
              </p>
            )}

            {/* Newsletter Input */}
            {((newsletterPlaceholder) || (newsletterButtonIcon)) && (
              <div
                className="flex items-center gap-2 w-full bg-white border border-gray-200 rounded-lg p-1 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/10 focus-within:border-orange-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email.trim()) {
                    onNewsletterSubmit?.(email.trim());
                  }
                }}
              >
                {newsletterPlaceholder && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterPlaceholder}
                    className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-transparent border-0 outline-none placeholder:text-gray-400 text-gray-900"
                    style={{ fontWeight: 300 }}
                  />
                )}
                {newsletterButtonIcon && (
                  <button
                    type="button"
                    onClick={() => email.trim() && onNewsletterSubmit?.(email.trim())}
                    className="flex items-center justify-center w-9 h-9 shrink-0 rounded-md bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white transition-colors cursor-pointer"
                    style={{ fontWeight: 300 }}
                  >
                    {newsletterButtonIcon}
                  </button>
                )}
              </div>
            )}

            {/* Email Contact Detail */}
            {contactEmail && (
              <div className="flex items-center gap-2.5 mt-1.5">
                {contactIcon && <span className="text-gray-400 flex items-center shrink-0">{contactIcon}</span>}
                <a
                  href={contactEmailHref || `mailto:${contactEmail}`}
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors break-all"
                  style={{ fontWeight: 300 }}
                >
                  {contactEmail}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar Area */}
      {((copyrightText) || (privacyText) || (termsText)) && (
        <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col items-center justify-center gap-3.5 text-center">
          {copyrightText && (
            <p className="text-xs text-gray-500" style={{ fontWeight: 300 }}>
              {copyrightText}
            </p>
          )}
          {((privacyText) || (termsText)) && (
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {privacyText && (
                <a href={privacyUrl || '#'} className="hover:text-gray-600 transition-colors" style={{ fontWeight: 300 }}>
                  {privacyText}
                </a>
              )}
              {privacyText && termsText && <span style={{ fontWeight: 300 }}>|</span>}
              {termsText && (
                <a href={termsUrl || '#'} className="hover:text-gray-600 transition-colors" style={{ fontWeight: 300 }}>
                  {termsText}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FooterLumeDynamic;
