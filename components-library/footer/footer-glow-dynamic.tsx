import React from 'react';

export interface FooterLink {
  id: string;
  label?: string;
  url?: string;
}

export interface FooterColumn {
  id: string;
  title?: string;
  links?: FooterLink[];
}

export interface SocialLink {
  id: string;
  url?: string;
  icon?: React.ReactNode;
}

export interface FooterGlowDynamicProps {
  // Logo info
  logoIcon?: React.ReactNode;
  logoText?: string;
  description?: string;

  // Social
  socialLinks?: SocialLink[];

  // Dynamic Navigation Columns
  columns?: FooterColumn[];

  // Newsletter Section
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  onNewsletterSubmit?: (email: string) => void;

  // Bottom Links & Copyright
  bottomLinks?: FooterLink[];
  copyrightText?: string;
}

export function FooterGlowDynamic({
  logoIcon,
  logoText,
  description,
  socialLinks,
  columns,
  newsletterTitle,
  newsletterDescription,
  newsletterPlaceholder,
  newsletterButtonText,
  onNewsletterSubmit,
  bottomLinks,
  copyrightText,
}: FooterGlowDynamicProps) {
  const [email, setEmail] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email.trim() && onNewsletterSubmit) {
      onNewsletterSubmit(email.trim());
    }
  };

  const handleSubscribe = () => {
    if (email.trim() && onNewsletterSubmit) {
      onNewsletterSubmit(email.trim());
    }
  };

  return (
    <footer
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="relative w-full bg-white text-gray-800 pt-16 pb-12 px-6 md:px-12 lg:px-24 border-t border-gray-100 overflow-hidden"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Top ambient glow bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 filter blur-[1px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[80px] bg-blue-400 opacity-[0.08] filter blur-[45px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-gray-100">

          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            {(logoIcon || logoText) && (
              <div className="flex items-center gap-2.5">
                {logoIcon && <div className="text-blue-600 flex items-center justify-center">{logoIcon}</div>}
                {logoText && (
                  <span
                    style={{ fontWeight: 500 }}
                    className="text-xl text-gray-900 tracking-tight"
                  >
                    {logoText}
                  </span>
                )}
              </div>
            )}

            {description && (
              <p
                style={{ fontWeight: 300 }}
                className="text-gray-500 text-sm leading-relaxed max-w-sm"
              >
                {description}
              </p>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <div className="flex items-center gap-4 mt-2">
                {socialLinks.map((social) => {
                  if (!social.icon) return null;
                  return (
                    <a
                      key={social.id}
                      href={social.url ?? '#'}
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      aria-label="Social Link"
                    >
                      {social.icon}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            {columns && columns.map((col) => {
              const hasLinks = col.links && col.links.length > 0;
              if (!col.title && !hasLinks) return null;
              return (
                <div key={col.id} className="flex flex-col gap-4">
                  {col.title && (
                    <h4
                      style={{ fontWeight: 500 }}
                      className="text-gray-900 text-sm tracking-wide lowercase first-letter:uppercase"
                    >
                      {col.title}
                    </h4>
                  )}
                  {hasLinks && (
                    <ul className="flex flex-col gap-2.5">
                      {col.links?.map((link) => {
                        if (!link.label) return null;
                        return (
                          <li key={link.id}>
                            <a
                              href={link.url ?? '#'}
                              style={{ fontWeight: 300 }}
                              className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200"
                            >
                              {link.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {newsletterTitle && (
              <h4
                style={{ fontWeight: 500 }}
                className="text-gray-900 text-sm tracking-wide lowercase first-letter:uppercase"
              >
                {newsletterTitle}
              </h4>
            )}
            {newsletterDescription && (
              <p
                style={{ fontWeight: 300 }}
                className="text-gray-500 text-sm leading-relaxed"
              >
                {newsletterDescription}
              </p>
            )}

            <div className="flex flex-col gap-2.5 w-full mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={newsletterPlaceholder ?? undefined}
                style={{ fontWeight: 300 }}
                className="w-full px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
              />
              {newsletterButtonText && (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  style={{ fontWeight: 300 }}
                  className="w-full px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                >
                  {newsletterButtonText}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
          {bottomLinks && bottomLinks.length > 0 ? (
            <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
              {bottomLinks.map((link) => {
                if (!link.label) return null;
                return (
                  <a
                    key={link.id}
                    href={link.url ?? '#'}
                    style={{ fontWeight: 300 }}
                    className="text-gray-400 hover:text-blue-600 text-xs transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          {copyrightText && (
            <span
              style={{ fontWeight: 300 }}
              className="text-gray-400 text-xs text-center sm:text-right"
            >
              {copyrightText}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

export default FooterGlowDynamic;
