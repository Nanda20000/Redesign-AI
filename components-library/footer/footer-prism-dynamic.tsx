import React from 'react';

export interface FooterPrismDynamicProps {
  /** Logo image source URL (optional) */
  logoImgSrc?: string;
  /** Logo image alt description */
  logoImgAlt?: string;
  /** Logo main text (optional) */
  logoText?: string;
  /** Logo small subtitle/subtext underneath (optional) */
  logoSubtext?: string;
  /** Navigation links listed in the footer */
  links?: Array<{
    label?: string;
    href?: string;
  }>;
  /** Social links with pre-rendered or component-based icons */
  socials?: Array<{
    icon?: React.ReactNode;
    href?: string;
    ariaLabel?: string;
  }>;
  /** Standard copyright text, e.g. "© 2019 All rights reserved." */
  copyrightText?: string;
  /** Colorful highlight brand name, e.g. "Aidan Technologies Sdn Bhd" */
  copyrightBrandText?: string;
  /** URL for the copyright brand name if it should link somewhere */
  copyrightBrandHref?: string;
}

export function FooterPrismDynamic({
  logoImgSrc,
  logoImgAlt,
  logoText,
  logoSubtext,
  links,
  socials,
  copyrightText,
  copyrightBrandText,
  copyrightBrandHref,
}: FooterPrismDynamicProps) {
  // If there are literally no props provided, we render absolutely nothing as requested
  if (
    !logoImgSrc &&
    !logoText &&
    !logoSubtext &&
    (!links || links.length === 0) &&
    (!socials || socials.length === 0) &&
    !copyrightText &&
    !copyrightBrandText
  ) {
    return null;
  }

  return (
    <footer
      id="footer-prism-dynamic-root"
      className="w-full bg-[#151515] text-[#ececec] py-12 px-6 border-t border-neutral-900 select-none flex flex-col items-center justify-center"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* MANDATORY FONT REQUIREMENT (first child inside root JSX) */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* LOGO SECTION */}
        {(logoImgSrc || logoText || logoSubtext) && (
          <div className="flex flex-col items-center space-y-2">
            {logoImgSrc && (
              <img
                id="footer-logo-image"
                src={logoImgSrc}
                alt={logoImgAlt ?? ''}
                referrerPolicy="no-referrer"
                className="h-10 w-auto object-contain mx-auto transition-transform duration-300 hover:scale-[1.03]"
              />
            )}
            {logoText && (
              <h3
                id="footer-logo-text"
                className="text-white text-xl tracking-wide uppercase"
                style={{ fontWeight: 500 }}
              >
                {logoText}
              </h3>
            )}
            {logoSubtext && (
              <span
                id="footer-logo-subtext"
                className="text-[10px] text-zinc-400 tracking-widest uppercase"
                style={{ fontWeight: 300 }}
              >
                {logoSubtext}
              </span>
            )}
          </div>
        )}

        {/* NAVIGATION LINKS */}
        {links && links.length > 0 && (
          <div
            id="footer-links-container"
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-2 text-sm text-zinc-300"
          >
            {links.map((link, idx) => {
              if (!link.label) return null;
              return (
                <a
                  key={idx}
                  id={`footer-link-${idx}`}
                  href={link.href ?? '#'}
                  className="hover:text-white transition-colors duration-200 relative group"
                  style={{ fontWeight: 300 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-500 transition-all duration-300 group-hover:w-full" />
                </a>
              );
            })}
          </div>
        )}

        {/* SOCIAL LINKS */}
        {socials && socials.length > 0 && (
          <div
            id="footer-socials-container"
            className="flex items-center justify-center gap-4 py-2"
          >
            {socials.map((social, idx) => {
              if (!social.icon) return null;
              return (
                <a
                  key={idx}
                  id={`footer-social-${idx}`}
                  href={social.href ?? '#'}
                  aria-label={social.ariaLabel ?? 'Social Media Link'}
                  className="w-10 h-10 rounded-full border border-zinc-700 hover:border-white transition-all duration-300 flex items-center justify-center text-zinc-400 hover:text-white hover:scale-105"
                  style={{ fontWeight: 300 }}
                >
                  <span className="flex items-center justify-center text-sm" style={{ fontWeight: 300 }}>
                    {social.icon}
                  </span>
                </a>
              );
            })}
          </div>
        )}

        {/* COPYRIGHT & BRANDING */}
        {(copyrightText || copyrightBrandText) && (
          <div
            id="footer-copyright-container"
            className="text-[11px] md:text-xs text-zinc-500 tracking-wide pt-4"
            style={{ fontWeight: 300 }}
          >
            {copyrightText && (
              <span id="footer-copyright-text" style={{ fontWeight: 300 }} className="mr-1">
                {copyrightText}
              </span>
            )}
            {copyrightBrandText && (
              copyrightBrandHref ? (
                <a
                  id="footer-copyright-brand-link"
                  href={copyrightBrandHref}
                  className="text-red-500 hover:text-red-400 transition-colors duration-200"
                  style={{ fontWeight: 300 }}
                >
                  {copyrightBrandText}
                </a>
              ) : (
                <span
                  id="footer-copyright-brand-text"
                  className="text-red-500"
                  style={{ fontWeight: 300 }}
                >
                  {copyrightBrandText}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </footer>
  );
}

export default FooterPrismDynamic;
