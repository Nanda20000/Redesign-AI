import React from 'react';

/**
 * NavFloatDynamic Component
 * A floating, pill-shaped navigation bar with a logo, centered links, and a CTA button.
 * Designed for a modern, clean look with a white background and rounded corners.
 */

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavFloatDynamicProps {
  logoText?: string;
  logoIcon?: React.ReactNode;
  navLinks?: NavLink[];
  ctaText?: string;
  ctaHref?: string;
}

export const NavFloatDynamic: React.FC<NavFloatDynamicProps> = ({
  logoText,
  logoIcon,
  navLinks,
  ctaText,
  ctaHref,
}) => {
  // If no essential props are provided, render nothing
  if (!logoText && !logoIcon && (!navLinks || navLinks.length === 0) && !ctaText) {
    return null;
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl font-['Open_Sans',sans-serif]">
      <div className="bg-white/90 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-6 py-2 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          {logoIcon && <span className="flex-shrink-0">{logoIcon}</span>}
          {logoText && (
            <span className="text-gray-900 font-bold text-lg tracking-tight">
              {logoText}
            </span>
          )}
        </div>

        {/* Navigation Links */}
        {navLinks && navLinks.length > 0 && (
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <li key={`${link.label}-${index}`}>
                <a
                  href={link.href || '#'}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    link.isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        {ctaText && (
          <a
            href={ctaHref || '#'}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
          >
            {ctaText}
          </a>
        )}
      </div>
    </nav>
  );
};

export default NavFloatDynamic;
