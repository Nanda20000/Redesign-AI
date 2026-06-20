import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NavMenuLink {
  label?: string;
  href?: string;
}

export interface NavMenuSocialLink {
  icon?: React.ReactNode;
  href?: string;
}

export interface NavMenuDynamicProps {
  topLinks?: NavMenuLink[];
  socialLinks?: NavMenuSocialLink[];
  logoIcon?: React.ReactNode;
  brandName?: string;
  brandHref?: string;
  mainLinks?: NavMenuLink[];
  searchIcon?: React.ReactNode;
  onSearchClick?: () => void;
}

export function NavMenuDynamic({
  topLinks,
  socialLinks,
  logoIcon,
  brandName,
  brandHref,
  mainLinks,
  searchIcon,
  onSearchClick,
}: NavMenuDynamicProps) {
  const hasTopBar = (topLinks && topLinks.length > 0) || (socialLinks && socialLinks.length > 0);
  const hasMainBar = logoIcon || brandName || (mainLinks && mainLinks.length > 0) || searchIcon;

  if (!hasTopBar && !hasMainBar) {
    return null;
  }

  return (
    <header
      className="w-full bg-white text-gray-800 border-b border-gray-100"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {hasTopBar && (
        <div className="w-full border-b border-gray-100 py-2 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Aux links on the left */}
            <div>
              {topLinks && topLinks.length > 0 ? (
                <nav className="flex items-center space-x-6">
                  {topLinks.map((link, index) => {
                    if (!link || !link.label) return null;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                        style={{ fontWeight: 300 }}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </nav>
              ) : null}
            </div>

            {/* Social links on the right */}
            <div>
              {socialLinks && socialLinks.length > 0 ? (
                <div className="flex items-center space-x-5">
                  {socialLinks.map((social, index) => {
                    if (!social || !social.icon) return null;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                        style={{ fontWeight: 300 }}
                      >
                        {social.icon}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {hasMainBar && (
        <div className="w-full py-4 sm:py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo + Brand name */}
            <div className="flex items-center">
              {logoIcon || brandName ? (
                <a
                  href={brandHref}
                  className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
                  style={{ fontWeight: 300 }}
                >
                  {logoIcon && (
                    <div className="flex-shrink-0 flex items-center justify-center">
                      {logoIcon}
                    </div>
                  )}
                  {brandName && (
                    <h1
                      className="text-xl tracking-tight text-gray-900"
                      style={{ fontWeight: 500 }}
                    >
                      {brandName}
                    </h1>
                  )}
                </a>
              ) : null}
            </div>

            {/* Main navigation and search button */}
            <div className="flex items-center space-x-8">
              {mainLinks && mainLinks.length > 0 ? (
                <nav className="hidden md:flex items-center space-x-8">
                  {mainLinks.map((link, index) => {
                    if (!link || !link.label) return null;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        className="text-xs tracking-wider uppercase text-gray-600 hover:text-gray-900 transition-colors"
                        style={{ fontWeight: 300 }}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </nav>
              ) : null}

              {searchIcon ? (
                <button
                  type="button"
                  onClick={onSearchClick}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center p-1"
                  style={{ fontWeight: 300 }}
                >
                  {searchIcon}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavMenuDynamic;
