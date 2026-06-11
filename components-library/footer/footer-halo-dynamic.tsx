import * as React from 'react';

export interface FooterLink {
  text?: string;
  href?: string;
}

export interface SocialLink {
  icon?: React.ReactNode;
  href?: string;
  ariaLabel?: string;
}

export interface FooterHaloDynamicProps {
  logoIcon?: React.ReactNode;
  logoText?: string;
  brandDescription?: string;
  copyrightText?: string;
  column1Title?: string;
  column1Links?: FooterLink[];
  column2Title?: string;
  column2Links?: FooterLink[];
  column3Title?: string;
  column3Links?: FooterLink[];
  socialLinks?: SocialLink[];
}

export function FooterHaloDynamic({
  logoIcon,
  logoText,
  brandDescription,
  copyrightText,
  column1Title,
  column1Links,
  column2Title,
  column2Links,
  column3Title,
  column3Links,
  socialLinks,
}: FooterHaloDynamicProps) {
  // If no props are provided or they are all falsy, we render null to be safe
  const hasContent = !!(
    logoIcon ||
    logoText ||
    brandDescription ||
    copyrightText ||
    column1Title ||
    column1Links?.length ||
    column2Title ||
    column2Links?.length ||
    column3Title ||
    column3Links?.length ||
    socialLinks?.length
  );

  if (!hasContent) {
    return null;
  }

  return (
    <footer
      className="w-full bg-white border-t-2 border-[#E05230] py-12 px-6 md:px-12 lg:px-24"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12">
        {/* Left Column: Brand, Description, Copyright */}
        <div className="flex flex-col max-w-sm gap-6">
          {/* Logo Brand */}
          {(logoIcon || logoText) && (
            <div className="flex items-center gap-2">
              {logoIcon && <div className="flex-shrink-0">{logoIcon}</div>}
              {logoText && (
                <span
                  className="text-2xl tracking-wider text-[#E05230]"
                  style={{ fontWeight: 300 }}
                >
                  {logoText}
                </span>
              )}
            </div>
          )}

          {/* Brand Description */}
          {brandDescription && (
            <p
              className="text-[#6B7280] text-sm leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {brandDescription}
            </p>
          )}

          {/* Copyright Text */}
          {copyrightText && (
            <div className="mt-auto">
              <span
                className="text-[#E05230] text-xs"
                style={{ fontWeight: 300 }}
              >
                {copyrightText}
              </span>
            </div>
          )}
        </div>

        {/* Right Columns: Sitemaps, Products, Help & Social Links */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:pl-8 lg:pl-16">
          {/* Column 1 */}
          {(column1Title || (column1Links && column1Links.length > 0)) && (
            <div className="flex flex-col gap-4">
              {column1Title && (
                <h4
                  className="text-xs tracking-wider uppercase text-[#374151]"
                  style={{ fontWeight: 500 }}
                >
                  {column1Title}
                </h4>
              )}
              {column1Links && column1Links.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {column1Links.map((link, idx) => {
                    if (!link.text) return null;
                    return (
                      <li key={idx}>
                        <a
                          href={link.href || '#'}
                          className="text-[#6B7280] hover:text-[#E05230] text-sm transition-colors duration-200"
                          style={{ fontWeight: 300 }}
                        >
                          {link.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Column 2 */}
          {(column2Title || (column2Links && column2Links.length > 0)) && (
            <div className="flex flex-col gap-4">
              {column2Title && (
                <h4
                  className="text-xs tracking-wider uppercase text-[#374151]"
                  style={{ fontWeight: 500 }}
                >
                  {column2Title}
                </h4>
              )}
              {column2Links && column2Links.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {column2Links.map((link, idx) => {
                    if (!link.text) return null;
                    return (
                      <li key={idx}>
                        <a
                          href={link.href || '#'}
                          className="text-[#6B7280] hover:text-[#E05230] text-sm transition-colors duration-200"
                          style={{ fontWeight: 300 }}
                        >
                          {link.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Column 3 */}
          {(column3Title || (column3Links && column3Links.length > 0)) && (
            <div className="flex flex-col gap-4">
              {column3Title && (
                <h4
                  className="text-xs tracking-wider uppercase text-[#374151]"
                  style={{ fontWeight: 500 }}
                >
                  {column3Title}
                </h4>
              )}
              {column3Links && column3Links.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {column3Links.map((link, idx) => {
                    if (!link.text) return null;
                    return (
                      <li key={idx}>
                        <a
                          href={link.href || '#'}
                          className="text-[#6B7280] hover:text-[#E05230] text-sm transition-colors duration-200"
                          style={{ fontWeight: 300 }}
                        >
                          {link.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Social Links Column */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex sm:justify-end gap-3 lg:col-start-4">
              {socialLinks.map((link, idx) => {
                if (!link.icon) return null;
                return (
                  <a
                    key={idx}
                    href={link.href || '#'}
                    aria-label={link.ariaLabel || 'Social Link'}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#E05230] hover:border-[#E05230] transition-all duration-200"
                    style={{ fontWeight: 300 }}
                  >
                    {link.icon}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default FooterHaloDynamic;
