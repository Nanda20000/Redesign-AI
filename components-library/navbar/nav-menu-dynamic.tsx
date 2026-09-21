import React, { useState, useEffect } from 'react';

export interface NavItem {
  label: string;
  href?: string;
}

export interface NavMenuDynamicProps {
  logoText?: string;
  logoImage?: string;
  logoHref?: string;
  navItems?: NavItem[];
  activeItem?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function NavMenuDynamic({
  logoText,
  logoImage,
  logoHref,
  navItems,
  activeItem,
  ctaText,
  ctaHref,
}: NavMenuDynamicProps) {
  const [currentActive, setCurrentActive] = useState<string | undefined>(activeItem);

  useEffect(() => {
    setCurrentActive(activeItem);
  }, [activeItem]);

  return (
    <header
      id="nav-menu-dynamic"
      className="w-full flex justify-center py-6 px-4"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      <nav
        id="nav-menu-bar"
        className="w-full max-w-5xl bg-[#111015] border border-zinc-800/80 rounded-2xl px-5 py-3 sm:px-7 sm:py-3.5 shadow-2xl shadow-black/60 flex items-center justify-between gap-4"
      >
        {/* Left: Brand / Logo */}
        {(logoImage || logoText) && (
          <a
            id="nav-logo-link"
            href={logoHref}
            className="flex items-center gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
          >
            {logoImage && (
              <img
                id="nav-logo-image"
                src={logoImage}
                alt={logoText || ''}
                className="w-9 h-9 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            )}
            {logoText && (
              <h2
                id="nav-logo-text"
                style={{ fontWeight: 500 }}
                className="text-xl sm:text-2xl text-[#a855f7] tracking-tight leading-none"
              >
                {logoText}
              </h2>
            )}
          </a>
        )}

        {/* Center: Navigation links */}
        {navItems && navItems.length > 0 && (
          <ul
            id="nav-items-list"
            className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 list-none m-0 p-0"
          >
            {navItems.map((item, index) => {
              if (!item || !item.label) return null;
              const isActive = currentActive === item.label;

              return (
                <li key={index} id={`nav-item-li-${index}`} className="list-none m-0 p-0">
                  <a
                    id={`nav-item-link-${index}`}
                    href={item.href}
                    onClick={() => setCurrentActive(item.label)}
                    style={{ fontWeight: 300 }}
                    className={`inline-block transition-all duration-200 text-sm sm:text-base leading-normal ${
                      isActive
                        ? 'bg-[#291345] border border-[#a855f7]/50 shadow-[0_0_22px_rgba(168,85,247,0.45)] text-white px-5 py-2 rounded-full'
                        : 'text-zinc-200 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right: CTA Button */}
        {ctaText && (
          <a
            id="nav-cta-button"
            href={ctaHref}
            style={{ fontWeight: 300 }}
            className="shrink-0 bg-[#a855f7] hover:bg-[#9333ea] active:scale-95 text-white text-sm sm:text-base px-6 py-2.5 rounded-full shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 flex items-center justify-center leading-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            {ctaText}
          </a>
        )}
      </nav>
    </header>
  );
}

export default NavMenuDynamic;
