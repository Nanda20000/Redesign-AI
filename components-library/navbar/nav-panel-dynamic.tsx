import React, { useState } from 'react';

export interface NavItem {
  label: string;
  url: string;
}

export interface NavPanelDynamicProps {
  id?: string;
  logoText?: string;
  logoIcon?: React.ReactNode;
  navItems?: NavItem[];
  signInText?: string;
  signInUrl?: string;
  signUpText?: string;
  signUpUrl?: string;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  onNavItemClick?: (item: NavItem) => void;
  menuIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

export function NavPanelDynamic({
  id,
  logoText,
  logoIcon,
  navItems,
  signInText,
  signInUrl,
  signUpText,
  signUpUrl,
  onSignInClick,
  onSignUpClick,
  onNavItemClick,
  menuIcon,
  closeIcon,
}: NavPanelDynamicProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper handles navigation item clicking safely
  const handleNavItemClick = (item: NavItem, e: React.MouseEvent) => {
    if (onNavItemClick) {
      e.preventDefault();
      onNavItemClick(item);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    if (onSignInClick) {
      e.preventDefault();
      onSignInClick();
    }
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    if (onSignUpClick) {
      e.preventDefault();
      onSignUpClick();
    }
  };

  return (
    <header
      id={id || 'nav-panel-dynamic'}
      className="w-full bg-white border-b border-zinc-100 sticky top-0 z-50 transition-all duration-300"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo Section */}
          {(logoIcon || logoText) && (
            <div className="flex items-center space-x-3 flex-shrink-0">
              {logoIcon && <div className="flex items-center justify-center">{logoIcon}</div>}
              {logoText && (
                <h1
                  className="text-zinc-800 text-lg md:text-xl tracking-wider uppercase"
                  style={{ fontWeight: 500 }}
                >
                  {logoText}
                </h1>
              )}
            </div>
          )}

          {/* Desktop Navigation Link items */}
          {navItems && navItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
              {navItems.map((item, index) => (
                <a
                  key={`nav-item-${index}`}
                  href={item.url || '#'}
                  onClick={(e) => handleNavItemClick(item, e)}
                  className="text-zinc-500 hover:text-zinc-950 transition-colors uppercase tracking-widest text-xs lg:text-sm"
                  style={{ fontWeight: 300 }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Action buttons section */}
          <div className="hidden md:flex items-center space-x-4">
            {signInText && (
              <a
                href={signInUrl || '#'}
                onClick={handleSignInClick}
                className="border border-zinc-300 hover:border-zinc-800 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 px-5 py-1.5 rounded-full text-xs lg:text-sm transition-all duration-200 cursor-pointer ease-in-out inline-flex items-center justify-center min-w-[90px]"
                style={{ fontWeight: 300 }}
              >
                {signInText}
              </a>
            )}
            {signUpText && (
              <a
                href={signUpUrl || '#'}
                onClick={handleSignUpClick}
                className="border border-zinc-300 hover:border-zinc-800 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 px-5 py-1.5 rounded-full text-xs lg:text-sm transition-all duration-200 cursor-pointer ease-in-out inline-flex items-center justify-center min-w-[90px]"
                style={{ fontWeight: 300 }}
              >
                {signUpText}
              </a>
            )}
          </div>

          {/* Mobile menu trigger */}
          {((navItems && navItems.length > 0) || signInText || signUpText) && (
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-zinc-600 hover:text-zinc-900 focus:outline-none p-2 rounded-lg"
                aria-label="Toggle Menu"
                style={{ fontWeight: 300 }}
              >
                {isMobileMenuOpen ? (
                  closeIcon ? closeIcon : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )
                ) : (
                  menuIcon ? menuIcon : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )
                )}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && ((navItems && navItems.length > 0) || signInText || signUpText) && (
        <div className="md:hidden border-t border-zinc-100 bg-white">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navItems && navItems.length > 0 && (
              <div className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <a
                    key={`mobile-nav-item-${index}`}
                    href={item.url || '#'}
                    onClick={(e) => handleNavItemClick(item, e)}
                    className="text-zinc-500 hover:text-zinc-900 block py-1.5 tracking-wider uppercase text-sm"
                    style={{ fontWeight: 300 }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}

            {/* Mobile auth buttons */}
            {(signInText || signUpText) && (
              <div className="pt-4 border-t border-zinc-100 flex flex-col space-y-2.5">
                {signInText && (
                  <a
                    href={signInUrl || '#'}
                    onClick={handleSignInClick}
                    className="w-full text-center border border-zinc-300 hover:border-zinc-800 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 px-4 py-2.5 rounded-full text-sm transition-all duration-200 inline-block"
                    style={{ fontWeight: 300 }}
                  >
                    {signInText}
                  </a>
                )}
                {signUpText && (
                  <a
                    href={signUpUrl || '#'}
                    onClick={handleSignUpClick}
                    className="w-full text-center border border-zinc-300 hover:border-zinc-800 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 px-4 py-2.5 rounded-full text-sm transition-all duration-200 inline-block"
                    style={{ fontWeight: 300 }}
                  >
                    {signUpText}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default NavPanelDynamic;
