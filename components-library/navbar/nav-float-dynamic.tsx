import React from 'react';

export interface NavFloatDynamicItem {
  label?: string;
  href?: string;
  badge?: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface NavFloatDynamicProps {
  items?: NavFloatDynamicItem[];
  activeLabel?: string;
}

export function NavFloatDynamic({
  items,
  activeLabel,
}: NavFloatDynamicProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <header
      className="w-full flex justify-center py-4 px-3"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      <nav
        className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-white rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]"
        aria-label="Main Navigation"
      >
        <ul className="flex items-center gap-1 sm:gap-1.5 m-0 p-0 list-none">
          {items.map((item, index) => {
            if (!item.label && !item.icon && !item.badge) {
              return null;
            }

            const isCurrentActive = Boolean(
              item.isActive || (activeLabel && item.label === activeLabel)
            );

            const content = (
              <>
                {item.icon ? (
                  <span
                    style={{ fontWeight: 300 }}
                    className="inline-flex items-center justify-center shrink-0 text-[#0d2215]"
                  >
                    {item.icon}
                  </span>
                ) : null}

                {item.label ? (
                  <span
                    style={{ fontWeight: 300 }}
                    className="text-sm tracking-normal select-none"
                  >
                    {item.label}
                  </span>
                ) : null}

                {item.badge ? (
                  <span
                    style={{ fontWeight: 300 }}
                    className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#0d2215] text-white text-xs leading-none shrink-0"
                  >
                    {item.badge}
                  </span>
                ) : null}
              </>
            );

            const activeClasses =
              'inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#ccf7c8] text-[#0d2215] transition-all cursor-pointer';
            const inactiveClasses =
              'inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[#111827] hover:text-[#0d2215] hover:bg-black/[0.04] transition-all cursor-pointer';

            return (
              <li
                key={item.label || index}
                style={{ fontWeight: 300 }}
                className="inline-flex items-center"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    style={{ fontWeight: 300 }}
                    className={isCurrentActive ? activeClasses : inactiveClasses}
                    aria-current={isCurrentActive ? 'page' : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    style={{ fontWeight: 300 }}
                    className={isCurrentActive ? activeClasses : inactiveClasses}
                    aria-current={isCurrentActive ? 'page' : undefined}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default NavFloatDynamic;
