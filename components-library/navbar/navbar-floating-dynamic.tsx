import React from 'react';
import { motion } from 'motion/react';

/**
 * NavbarFloatingDynamicProps defines the props for the floating dynamic navbar.
 * @property {Array<{label: string, href: string}>} links - The navigation links to display.
 * @property {string} ctaLabel - The text for the call-to-action button.
 * @property {string} ctaHref - The destination URL for the call-to-action button.
 */
export interface NavbarFloatingDynamicProps {
  links?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * NavbarFloatingDynamic is a pill-shaped, floating navigation bar component.
 * It features a clean, minimalist design with a light background and a dark CTA button.
 */
export const NavbarFloatingDynamic: React.FC<NavbarFloatingDynamicProps> = ({
  links,
  ctaLabel,
  ctaHref,
}) => {
  // If no content is provided, render nothing.
  if ((!links || links.length === 0) && !ctaLabel) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-8 left-1/2 z-50 flex items-center p-1.5 bg-[#FCFAF5] border border-[#E5E2D9] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      id="navbar-floating-dynamic"
    >
      {links && links.length > 0 && (
        <div className="flex items-center px-4 md:px-6 space-x-6 md:space-x-10">
          {links.map((link, index) => {
            if (!link.label) return null;
            return (
              <a
                key={`nav-link-${index}`}
                href={link.href || '#'}
                className="text-[13px] md:text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}

      {ctaLabel && (
        <a
          href={ctaHref || '#'}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#141414] text-white text-[13px] md:text-sm font-medium rounded-full hover:bg-black transition-all active:scale-95 whitespace-nowrap"
        >
          {ctaLabel}
        </a>
      )}
    </motion.nav>
  );
};

export default NavbarFloatingDynamic;
