import * as React from 'react';

export interface NavHeaderDynamicProps {
  brandLogo?: React.ReactNode;
  brandName?: string;
  brandLink?: string;

  menuItem1Text?: string;
  menuItem1Link?: string;
  menuItem2Text?: string;
  menuItem2Link?: string;
  menuItem3Text?: string;
  menuItem3Link?: string;
  menuItem4Text?: string;
  menuItem4Link?: string;
  menuItem5Text?: string;
  menuItem5Link?: string;

  searchPlaceholder?: string;
  searchIcon?: React.ReactNode;
  searchValue?: string;
  
  mobileToggleIcon?: React.ReactNode;

  onSearchChange?: (val: string) => void;
  onSearchSubmit?: (val: string) => void;
}

export const NavHeaderDynamic: React.FC<NavHeaderDynamicProps> = ({
  brandLogo,
  brandName,
  brandLink,
  menuItem1Text,
  menuItem1Link,
  menuItem2Text,
  menuItem2Link,
  menuItem3Text,
  menuItem3Link,
  menuItem4Text,
  menuItem4Link,
  menuItem5Text,
  menuItem5Link,
  searchPlaceholder,
  searchIcon,
  searchValue,
  mobileToggleIcon,
  onSearchChange,
  onSearchSubmit,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit(e.currentTarget.value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const hasMenuItems =
    menuItem1Text ||
    menuItem2Text ||
    menuItem3Text ||
    menuItem4Text ||
    menuItem5Text;

  return (
    <header
      className="relative w-full bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between z-40 select-none"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Brand logo & name */}
      {(brandLogo || brandName) && (
        <a
          href={brandLink || '#'}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          style={{ fontWeight: 300 }}
        >
          {brandLogo && (
            <div className="flex items-center justify-center">
              {brandLogo}
            </div>
          )}
          {brandName && (
            <h1
              style={{ fontWeight: 500 }}
              className="text-xl md:text-2xl text-gray-800 tracking-wide"
            >
              {brandName}
            </h1>
          )}
        </a>
      )}

      {/* Navigation center items */}
      {hasMenuItems && (
        <nav className="hidden md:flex items-center gap-8">
          {menuItem1Text && (
            <a
              href={menuItem1Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              {menuItem1Text}
            </a>
          )}
          {menuItem2Text && (
            <a
              href={menuItem2Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              {menuItem2Text}
            </a>
          )}
          {menuItem3Text && (
            <a
              href={menuItem3Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              {menuItem3Text}
            </a>
          )}
          {menuItem4Text && (
            <a
              href={menuItem4Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              {menuItem4Text}
            </a>
          )}
          {menuItem5Text && (
            <a
              href={menuItem5Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              {menuItem5Text}
            </a>
          )}
        </nav>
      )}

      {/* Search Input on the right */}
      <div className="flex items-center gap-4">
        {searchPlaceholder && (
          <div
            className="relative flex items-center w-full max-w-[200px] sm:max-w-xs"
            style={{ fontWeight: 300 }}
          >
            <input
              type="text"
              value={searchValue || ''}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              style={{ fontWeight: 300 }}
              className="w-full text-sm py-1.5 pl-4 pr-10 rounded-full border border-gray-300 outline-none focus:border-gray-500 transition-colors placeholder-gray-400 text-gray-700 bg-transparent"
            />
            {searchIcon && (
              <div
                className="absolute right-3.5 text-gray-400 pointer-events-none flex items-center justify-center"
                style={{ fontWeight: 300 }}
              >
                {searchIcon}
              </div>
            )}
          </div>
        )}

        {/* Mobile Toggle Button */}
        {mobileToggleIcon && hasMenuItems && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 text-gray-500 hover:text-black focus:outline-none"
            style={{ fontWeight: 300 }}
          >
            {mobileToggleIcon}
          </button>
        )}
      </div>

      {/* Mobile Drawer/Menu Tray */}
      {isMobileMenuOpen && hasMenuItems && (
        <div
          className="absolute top-full left-0 w-full bg-white border-b border-gray-100 py-4 px-6 flex flex-col gap-3 shadow-md z-50 md:hidden"
          style={{ fontWeight: 300 }}
        >
          {menuItem1Text && (
            <a
              href={menuItem1Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItem1Text}
            </a>
          )}
          {menuItem2Text && (
            <a
              href={menuItem2Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItem2Text}
            </a>
          )}
          {menuItem3Text && (
            <a
              href={menuItem3Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItem3Text}
            </a>
          )}
          {menuItem4Text && (
            <a
              href={menuItem4Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItem4Text}
            </a>
          )}
          {menuItem5Text && (
            <a
              href={menuItem5Link || '#'}
              style={{ fontWeight: 300 }}
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItem5Text}
            </a>
          )}
        </div>
      )}
    </header>
  );
};

export default NavHeaderDynamic;
