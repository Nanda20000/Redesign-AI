import React from 'react';

export interface NavItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface NavLinkDynamicProps {
  navItems?: NavItem[];
  activeItem?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaIcon?: React.ReactNode;
}

export function NavLinkDynamic({
  navItems,
  activeItem,
  ctaText,
  ctaHref,
  ctaIcon,
}: NavLinkDynamicProps) {
  const hasNavItems = Array.isArray(navItems) && navItems.length > 0;
  const hasCta = Boolean((ctaText && ctaText.trim() !== '') || ctaIcon);

  const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(() => {
    if (activeItem && activeItem.trim() !== '') {
      return activeItem.trim();
    }
    const itemWithActive = navItems?.find((i) => i?.isActive);
    return itemWithActive?.label?.trim();
  });

  React.useEffect(() => {
    if (activeItem !== undefined && activeItem.trim() !== '') {
      setSelectedLabel(activeItem.trim());
    }
  }, [activeItem]);

  if (!hasNavItems && !hasCta) {
    return null;
  }

  return (
    <nav
      id="nav-link-dynamic"
      className="inline-flex items-center bg-white border border-black rounded-full px-2 py-1.5 shadow-sm max-w-full overflow-x-auto"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {hasNavItems && (
        <div id="nav-link-dynamic-list" className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item, index) => {
            if (!item || !item.label || item.label.trim() === '') {
              return null;
            }

            const isCurrentActive = Boolean(
              (selectedLabel &&
                item.label.trim().toLowerCase() === selectedLabel.toLowerCase()) ||
                (!selectedLabel && item.isActive)
            );

            return (
              <a
                key={index}
                id={`nav-link-item-${index}`}
                href={item.href || '#'}
                onClick={(e) => {
                  if (!item.href || item.href === '#' || item.href.startsWith('#')) {
                    e.preventDefault();
                  }
                  setSelectedLabel(item.label.trim());
                }}
                className={
                  isCurrentActive
                    ? 'bg-black text-white rounded-full px-5 py-2 text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center transition-all duration-200 cursor-pointer'
                    : 'text-black hover:bg-neutral-100 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center transition-all duration-200 cursor-pointer'
                }
                style={{ fontWeight: 300 }}
              >
                <span style={{ fontWeight: 300 }}>{item.label}</span>
              </a>
            );
          })}
        </div>
      )}

      {hasNavItems && hasCta && (
        <div
          id="nav-link-dynamic-divider"
          className="h-5 w-px bg-neutral-300 mx-2 sm:mx-3 shrink-0"
        />
      )}

      {hasCta && (
        <a
          id="nav-link-dynamic-cta"
          href={ctaHref || '#'}
          className="bg-black text-white rounded-full px-5 py-2 text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 shrink-0 transition-opacity hover:opacity-90"
          style={{ fontWeight: 300 }}
        >
          {ctaText && ctaText.trim() !== '' && (
            <span style={{ fontWeight: 300 }}>{ctaText}</span>
          )}
          {ctaIcon && <span style={{ fontWeight: 300 }}>{ctaIcon}</span>}
        </a>
      )}
    </nav>
  );
}

export default NavLinkDynamic;
