import * as React from 'react';

export interface NavHeaderItem {
  id?: string;
  label?: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export interface NavHeaderDynamicProps {
  navItems?: NavHeaderItem[];
  ctaText?: string;
  ctaHref?: string;
  ctaIcon?: React.ReactNode;
}

export function NavHeaderDynamic({
  navItems,
  ctaText,
  ctaHref,
  ctaIcon,
}: NavHeaderDynamicProps) {
  const hasNavItems = Array.isArray(navItems) && navItems.length > 0;
  const hasCta = Boolean(ctaText || ctaIcon);

  const [selectedKey, setSelectedKey] = React.useState<string | number | null>(() => {
    if (!navItems) return null;
    const activeIndex = navItems.findIndex((item) => item.isActive);
    if (activeIndex !== -1) {
      const activeItem = navItems[activeIndex];
      return activeItem.id ?? activeItem.label ?? activeIndex;
    }
    return null;
  });

  React.useEffect(() => {
    if (!navItems) return;
    const activeIndex = navItems.findIndex((item) => item.isActive);
    if (activeIndex !== -1) {
      const activeItem = navItems[activeIndex];
      setSelectedKey(activeItem.id ?? activeItem.label ?? activeIndex);
    }
  }, [navItems]);

  return (
    <header
      id="nav-header-dynamic"
      className="w-full flex items-center justify-center py-6 px-4 bg-transparent"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <nav
        id="nav-header-capsule"
        aria-label="Main Navigation"
        className="bg-white rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-1 sm:gap-2 max-w-full overflow-x-auto"
      >
        {hasNavItems && (
          <ul id="nav-header-items" className="flex items-center gap-1 sm:gap-1.5 list-none m-0 p-0" style={{ fontWeight: 300 }}>
            {navItems?.map((item, index) => {
              const itemKey = item.id || (item.label ? `${item.label}-${index}` : `nav-item-${index}`);
              const thisKey = item.id ?? item.label ?? index;
              const isActive = selectedKey !== null ? selectedKey === thisKey : Boolean(item.isActive);
              const hasLabel = Boolean(item.label);
              const hasIcon = Boolean(item.icon);

              if (!hasLabel && !hasIcon) {
                return null;
              }

              const handleItemClick = (e: React.MouseEvent) => {
                setSelectedKey(thisKey);
                if (item.href === '#') {
                  e.preventDefault();
                }
                if (item.onClick) {
                  item.onClick();
                }
              };

              const content = (
                <>
                  {hasIcon && (
                    <span
                      className={`inline-flex items-center justify-center shrink-0 w-4 h-4 transition-colors duration-150 ${
                        isActive ? 'text-white' : 'text-slate-600'
                      }`}
                      style={{ fontWeight: 300 }}
                    >
                      {item.icon}
                    </span>
                  )}
                  {hasLabel && (
                    <span
                      className={`text-sm tracking-normal whitespace-nowrap transition-colors duration-150 ${
                        isActive ? 'text-white' : 'text-slate-700'
                      }`}
                      style={{ fontWeight: 300 }}
                    >
                      {item.label}
                    </span>
                  )}
                </>
              );

              const itemClasses = `inline-flex items-center gap-2 rounded-full transition-all duration-200 select-none cursor-pointer ${
                isActive
                  ? 'bg-[#2f6ff5] text-white px-4 py-2 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-3.5 py-2'
              }`;

              return (
                <li key={itemKey} id={`nav-item-li-${index}`} className="flex items-center" style={{ fontWeight: 300 }}>
                  {item.href && item.href !== '#' ? (
                    <a
                      id={`nav-item-link-${index}`}
                      href={item.href}
                      onClick={handleItemClick}
                      className={itemClasses}
                      style={{ fontWeight: 300 }}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      id={`nav-item-btn-${index}`}
                      type="button"
                      onClick={handleItemClick}
                      className={itemClasses}
                      style={{ fontWeight: 300 }}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {hasNavItems && hasCta && (
          <div
            id="nav-header-divider"
            className="h-5 w-[1px] bg-slate-200 mx-1 sm:mx-1.5 shrink-0"
            aria-hidden="true"
          />
        )}

        {hasCta && (
          <div id="nav-header-cta-wrapper" className="flex items-center shrink-0">
            {ctaHref ? (
              <a
                id="nav-header-cta-link"
                href={ctaHref}
                className="inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-[#2f6ff5] hover:bg-blue-600 text-white shadow-sm transition-all duration-150 select-none"
                style={{ fontWeight: 300 }}
              >
                {ctaText && (
                  <span className="text-sm tracking-normal whitespace-nowrap pl-1 text-white" style={{ fontWeight: 300 }}>
                    {ctaText}
                  </span>
                )}
                {ctaIcon && (
                  <span
                    className="w-6 h-6 rounded-full bg-white text-[#2f6ff5] inline-flex items-center justify-center shrink-0 shadow-xs"
                    style={{ fontWeight: 300 }}
                  >
                    {ctaIcon}
                  </span>
                )}
              </a>
            ) : (
              <button
                id="nav-header-cta-button"
                type="button"
                className="inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-[#2f6ff5] hover:bg-blue-600 text-white shadow-sm transition-all duration-150 select-none cursor-pointer"
                style={{ fontWeight: 300 }}
              >
                {ctaText && (
                  <span className="text-sm tracking-normal whitespace-nowrap pl-1 text-white" style={{ fontWeight: 300 }}>
                    {ctaText}
                  </span>
                )}
                {ctaIcon && (
                  <span
                    className="w-6 h-6 rounded-full bg-white text-[#2f6ff5] inline-flex items-center justify-center shrink-0 shadow-xs"
                    style={{ fontWeight: 300 }}
                  >
                    {ctaIcon}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default NavHeaderDynamic;
