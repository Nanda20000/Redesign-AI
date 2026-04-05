import React from 'react';

/**
 * NavBarDynamic component
 * A floating navbar with a logo, navigation links, and two call-to-action buttons.
 * Designed to be a selectable dynamic component for the AI layout generator.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavBarDynamicProps {
  logoIcon?: React.ReactNode;
  logoText?: string;
  navLinks?: NavLink[];
  loginLabel?: string;
  loginHref?: string;
  signupLabel?: string;
  signupHref?: string;
}

export const NavBarDynamic: React.FC<NavBarDynamicProps> = ({
  logoIcon,
  logoText,
  navLinks,
  loginLabel,
  loginHref,
  signupLabel,
  signupHref,
}) => {
  // If no content is provided, render nothing
  if (!logoIcon && !logoText && (!navLinks || navLinks.length === 0) && !loginLabel && !signupLabel) {
    return null;
  }

  return (
    <nav className="w-full px-4 py-6 font-['Open_Sans',sans-serif]">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-xl bg-white px-6 py-3 shadow-sm border border-gray-100">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            {logoIcon && <div className="flex items-center justify-center">{logoIcon}</div>}
            {logoText && (
              <span className="text-xl font-bold tracking-tight text-gray-900">
                {logoText}
              </span>
            )}
          </div>

          {/* Navigation Links Section */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks?.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons Section */}
          <div className="flex items-center gap-3">
            {loginLabel && (
              <a
                href={loginHref || '#'}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200"
              >
                {loginLabel}
              </a>
            )}
            {signupLabel && (
              <a
                href={signupHref || '#'}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {signupLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarDynamic;
