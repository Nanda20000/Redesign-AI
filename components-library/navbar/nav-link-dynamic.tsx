import React from 'react';

export interface NavLinkDynamicProps {
  // Brand Logo Text & Icon
  logoText?: string;
  logoIcon?: React.ReactNode;

  // Top Links Text & URL
  topLink1Text?: string;
  topLink1Url?: string;
  topLink2Text?: string;
  topLink2Url?: string;
  topLink3Text?: string;
  topLink3Url?: string;

  // Main Links Text & URL
  mainLink1Text?: string;
  mainLink1Url?: string;
  mainLink2Text?: string;
  mainLink2Url?: string;
  mainLink3Text?: string;
  mainLink3Url?: string;
  mainLink4Text?: string;
  mainLink4Url?: string;

  // Action/Interactive Icons
  searchIcon?: React.ReactNode;
  userIcon?: React.ReactNode;
  cartIcon?: React.ReactNode;

  // Optional array-based props for list flexibility
  topLinks?: Array<{ label?: string; href?: string }>;
  mainLinks?: Array<{ label?: string; href?: string }>;
}

export function NavLinkDynamic(props: NavLinkDynamicProps) {
  const {
    logoText,
    logoIcon,
    topLink1Text,
    topLink1Url,
    topLink2Text,
    topLink2Url,
    topLink3Text,
    topLink3Url,
    mainLink1Text,
    mainLink1Url,
    mainLink2Text,
    mainLink2Url,
    mainLink3Text,
    mainLink3Url,
    mainLink4Text,
    mainLink4Url,
    searchIcon,
    userIcon,
    cartIcon,
    topLinks,
    mainLinks,
  } = props;

  // Resolve top-level links to dynamic list
  const activeTopLinks = [
    { text: topLink1Text, url: topLink1Url },
    { text: topLink2Text, url: topLink2Url },
    { text: topLink3Text, url: topLink3Url },
  ].filter((link) => !!link.text);

  const topLinksToRender = topLinks && topLinks.length > 0
    ? topLinks.filter((l) => !!l.label)
    : activeTopLinks.map((l) => ({ label: l.text, href: l.url }));

  // Resolve main/primary navigation links to dynamic list
  const activeMainLinks = [
    { text: mainLink1Text, url: mainLink1Url },
    { text: mainLink2Text, url: mainLink2Url },
    { text: mainLink3Text, url: mainLink3Url },
    { text: mainLink4Text, url: mainLink4Url },
  ].filter((link) => !!link.text);

  const mainLinksToRender = mainLinks && mainLinks.length > 0
    ? mainLinks.filter((l) => !!l.label)
    : activeMainLinks.map((l) => ({ label: l.text, href: l.url }));

  const hasTopLinks = topLinksToRender.length > 0;
  const hasTopIcons = !!searchIcon || !!userIcon || !!cartIcon;
  const showTopBar = hasTopLinks || hasTopIcons;

  const hasLogo = !!logoText || !!logoIcon;
  const hasMainLinks = mainLinksToRender.length > 0;
  const showMainBar = hasLogo || hasMainLinks;

  return (
    <nav className="w-full bg-white border-b border-gray-100" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Google Fonts Import for Roboto Light (300) and Roboto Medium (500) */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Top Bar / Secondary Row */}
      {showTopBar && (
        <div className="w-full border-b border-gray-100 py-2.5 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Top Links */}
            <div className="flex items-center gap-6">
              {topLinksToRender.map((link, idx) => (
                <React.Fragment key={idx}>
                  {link.label && (
                    <a
                      href={link.href || '#'}
                      className="text-gray-500 hover:text-black transition-colors text-xs md:text-sm"
                      style={{ fontWeight: 300 }}
                    >
                      {link.label}
                    </a>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Top Right Utility Icons */}
            {hasTopIcons && (
              <div className="flex items-center gap-4">
                {searchIcon && (
                  <button
                    className="text-gray-500 hover:text-black transition-all cursor-pointer p-1"
                    style={{ fontWeight: 300 }}
                    aria-label="Search"
                  >
                    {searchIcon}
                  </button>
                )}
                {userIcon && (
                  <button
                    className="text-gray-500 hover:text-black transition-all cursor-pointer p-1"
                    style={{ fontWeight: 300 }}
                    aria-label="Account"
                  >
                    {userIcon}
                  </button>
                )}
                {cartIcon && (
                  <button
                    className="text-gray-500 hover:text-black transition-all cursor-pointer p-1"
                    style={{ fontWeight: 300 }}
                    aria-label="Shopping Cart"
                  >
                    {cartIcon}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Bar / Primary Row */}
      {showMainBar && (
        <div className="w-full py-5 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Brand Logo and Text/Icon */}
            {hasLogo && (
              <div className="flex items-center gap-3">
                {logoIcon && <div className="flex-shrink-0 flex items-center justify-center">{logoIcon}</div>}
                {logoText && (
                  <h2 className="text-xl md:text-2xl text-slate-800 tracking-wider" style={{ fontWeight: 500 }}>
                    {logoText}
                  </h2>
                )}
              </div>
            )}

            {/* Main Links */}
            {hasMainLinks && (
              <div className="flex items-center flex-wrap gap-y-2">
                {mainLinksToRender.map((link, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <span
                        className="text-gray-300 pointer-events-none select-none px-4 text-xs md:text-sm"
                        style={{ fontWeight: 300 }}
                      >
                        |
                      </span>
                    )}
                    {link.label && (
                      <a
                        href={link.href || '#'}
                        className="text-slate-800 hover:text-black transition-colors uppercase tracking-widest text-xs md:text-sm hover:underline hover:underline-offset-4"
                        style={{ fontWeight: 300 }}
                      >
                        {link.label}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavLinkDynamic;
