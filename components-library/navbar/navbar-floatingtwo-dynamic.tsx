import React from 'react';

/**
 * NavbarFloatingtwoDynamic Component
 * 
 * A floating, pill-shaped navigation bar with a logo, centered links, and a call-to-action button.
 * Designed to be used as a sticky or fixed header.
 * 
 * @param logo - The logo element (icon or text) to display on the left.
 * @param navItems - An array of navigation links with labels and hrefs.
 * @param ctaText - The text for the call-to-action button.
 * @param ctaHref - The destination URL for the call-to-action button.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarFloatingtwoDynamicProps {
  logo?: React.ReactNode;
  logoImage?: string;
  navItems?: NavItem[];
  ctaText?: string;
  ctaHref?: string;
}

export const NavbarFloatingtwoDynamic: React.FC<NavbarFloatingtwoDynamicProps> = ({
  logo,
  logoImage,
  navItems,
  ctaText,
  ctaHref,
}) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          {logoImage ? (
            <img 
              src={logoImage} 
              alt="Logo" 
              className="h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          ) : logo ? (
            <div className="flex items-center justify-center">
              {logo}
            </div>
          ) : null}
        </div>

        {/* Navigation Links */}
        {navItems && navItems.length > 0 && (
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Section */}
        <div>
          {ctaText && (
            <a
              href={ctaHref || '#'}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-all active:scale-95"
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarFloatingtwoDynamic;
