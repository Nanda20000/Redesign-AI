import React from 'react';

export interface FooterEtherDynamicProps {
  /** Beautiful background image URL for the footer mountain backdrop */
  backgroundImage?: string;
  /** Brand logo element, e.g. custom icon or SVG wrapper */
  logoIcon?: React.ReactNode;
  /** Brand title / name, e.g., "MAGIC STONE" */
  brandName?: string;
  /** Paragraph describing the brand, company, or visual philosophy */
  brandDescription?: string;
  /** Placeholder text for the search input pill */
  searchPlaceholder?: string;
  /** Custom icon rendering inside the search pill button */
  searchButtonIcon?: React.ReactNode;
  /** Callback triggered when a search query is submitted */
  onSearch?: (query: string) => void;

  /** Title of the first link list, e.g., "MENU" */
  menuTitle?: string;
  /** Array of link objects for the first column */
  menuLinks?: Array<{ label: string; url: string }>;

  /** Title of the second link list, e.g., "INFO" */
  infoTitle?: string;
  /** Array of link objects for the second column */
  infoLinks?: Array<{ label: string; url: string }>;

  /** Title of the third link list, e.g., "SOCIAL" */
  socialTitle?: string;
  /** Array of link objects for the third column */
  socialLinks?: Array<{ label: string; url: string }>;

  /** Text for the scroll to top action, e.g., "GO ON TOP" */
  goOnTopText?: string;
  /** Custom up-pointing arrow or caret icon for scroll to top */
  goOnTopIcon?: React.ReactNode;

  /** Copyright notice string, e.g., "© UI Chest. All rights reserved." */
  copyrightText?: string;
}

export function FooterEtherDynamic({
  backgroundImage,
  logoIcon,
  brandName,
  brandDescription,
  searchPlaceholder,
  searchButtonIcon,
  onSearch,
  menuTitle,
  menuLinks,
  infoTitle,
  infoLinks,
  socialTitle,
  socialLinks,
  goOnTopText,
  goOnTopIcon,
  copyrightText,
}: FooterEtherDynamicProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchClick = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Determine if we have any link columns to display
  const hasColumns =
    (menuTitle || (menuLinks && menuLinks.length > 0)) ||
    (infoTitle || (infoLinks && infoLinks.length > 0)) ||
    (socialTitle || (socialLinks && socialLinks.length > 0));

  return (
    <footer
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
      }}
      className="relative w-full overflow-hidden text-white"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Elegant dark overlay mimicking the atmospheric mountain look */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs pointer-events-none" />

      {/* Primary content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-16 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Brand & Search Column */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
            
            {/* Logo and Name row */}
            {(logoIcon || brandName) && (
              <div className="flex items-center gap-3">
                {logoIcon && <div className="flex items-center justify-center">{logoIcon}</div>}
                {brandName && (
                  <h2
                    style={{ fontWeight: 500 }}
                    className="text-lg tracking-wider text-slate-100 select-none uppercase"
                  >
                    {brandName}
                  </h2>
                )}
              </div>
            )}

            {/* Brand Description */}
            {brandDescription && (
              <p
                style={{ fontWeight: 300 }}
                className="text-sm text-slate-300 leading-relaxed max-w-md"
              >
                {brandDescription}
              </p>
            )}

            {/* Custom Search Box inside a non-form block */}
            {(searchPlaceholder !== undefined && searchPlaceholder !== null) && (
              <div
                onKeyDown={handleKeyDown}
                className="flex items-center bg-white/95 rounded-full pl-4 pr-1.5 py-1.5 max-w-xs shadow-md border border-slate-700/10 focus-within:ring-2 focus-within:ring-amber-500/50 transition-all duration-300"
              >
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontWeight: 300 }}
                  className="bg-transparent text-slate-800 outline-none flex-grow text-sm py-1.5 placeholder-slate-400 min-w-0"
                />
                
                <button
                  type="button"
                  onClick={handleSearchClick}
                  aria-label="Search button"
                  className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 transition-colors duration-200 rounded-full h-9 w-9 flex items-center justify-center text-slate-900 cursor-pointer flex-shrink-0"
                >
                  {searchButtonIcon}
                </button>
              </div>
            )}

          </div>

          {/* Links Grid Section */}
          {hasColumns && (
            <div className="col-span-1 lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Menu List Column */}
              {(menuTitle || (menuLinks && menuLinks.length > 0)) && (
                <div className="flex flex-col gap-4">
                  {menuTitle && (
                    <h3
                      style={{ fontWeight: 500 }}
                      className="text-xs uppercase tracking-widest text-slate-400"
                    >
                      {menuTitle}
                    </h3>
                  )}
                  {menuLinks && menuLinks.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
                      {menuLinks.map((item, index) => {
                        if (!item.label) return null;
                        return (
                          <li key={index}>
                            <a
                              href={item.url || '#'}
                              style={{ fontWeight: 300 }}
                              className="text-sm text-slate-300 hover:text-white transition-colors duration-200 block"
                            >
                              {item.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {/* Info List Column */}
              {(infoTitle || (infoLinks && infoLinks.length > 0)) && (
                <div className="flex flex-col gap-4">
                  {infoTitle && (
                    <h3
                      style={{ fontWeight: 500 }}
                      className="text-xs uppercase tracking-widest text-slate-400"
                    >
                      {infoTitle}
                    </h3>
                  )}
                  {infoLinks && infoLinks.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
                      {infoLinks.map((item, index) => {
                        if (!item.label) return null;
                        return (
                          <li key={index}>
                            <a
                              href={item.url || '#'}
                              style={{ fontWeight: 300 }}
                              className="text-sm text-slate-300 hover:text-white transition-colors duration-200 block"
                            >
                              {item.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {/* Social List Column */}
              {(socialTitle || (socialLinks && socialLinks.length > 0)) && (
                <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
                  {socialTitle && (
                    <h3
                      style={{ fontWeight: 500 }}
                      className="text-xs uppercase tracking-widest text-slate-400"
                    >
                      {socialTitle}
                    </h3>
                  )}
                  {socialLinks && socialLinks.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
                      {socialLinks.map((item, index) => {
                        if (!item.label) return null;
                        return (
                          <li key={index}>
                            <a
                              href={item.url || '#'}
                              style={{ fontWeight: 300 }}
                              className="text-sm text-slate-300 hover:text-white transition-colors duration-200 block"
                            >
                              {item.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Divider item */}
        <div className="border-t border-slate-800/80 my-8 w-full" />

        {/* Footer Bottom Metadata/Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          
          {/* Scroll to Top */}
          {goOnTopText && (
            <button
              onClick={scrollToTop}
              style={{ fontWeight: 300 }}
              className="flex items-center gap-2 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer uppercase tracking-wider"
            >
              {goOnTopIcon && <span className="flex items-center justify-center">{goOnTopIcon}</span>}
              <span style={{ fontWeight: 300 }}>{goOnTopText}</span>
            </button>
          )}

          {/* Copyright text */}
          {copyrightText && (
            <span style={{ fontWeight: 300 }} className="text-slate-500 tracking-wide text-center sm:text-right">
              {copyrightText}
            </span>
          )}

        </div>
      </div>
    </footer>
  );
}

export default FooterEtherDynamic;
