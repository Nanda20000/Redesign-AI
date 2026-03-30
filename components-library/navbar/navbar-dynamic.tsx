'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NavSubItem {
  label?: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface NavItem {
  label?: string;
  href?: string;
  subItems?: NavSubItem[];
}

export interface NavAction {
  label?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface NavbarDynamicProps {
  logo?: {
    icon?: React.ReactNode;
    text?: string;
    href?: string;
  };
  navItems?: NavItem[];
  actions?: NavAction[];
  mobileMenuIcon?: React.ReactNode;
  closeMenuIcon?: React.ReactNode;
  chevronIcon?: React.ReactNode;
}

/**
 * NavbarDynamic - A responsive, dynamic navigation bar component.
 * Supports desktop dropdowns, mobile expandable menus, and customizable actions.
 */
export const NavbarDynamic: React.FC<NavbarDynamicProps> = ({
  logo,
  navItems,
  actions,
  mobileMenuIcon,
  closeMenuIcon,
  chevronIcon,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getButtonStyles = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-black text-white hover:bg-black/90';
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
      case 'outline':
        return 'border border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50';
      default:
        return 'bg-black text-white hover:bg-black/90';
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md" id="navbar-dynamic">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          {logo && (
            <a
              href={logo.href || '#'}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900"
              id="navbar-logo"
            >
              {logo.icon && <span id="navbar-logo-icon" className="flex items-center justify-center">{logo.icon}</span>}
              {logo.text && <span id="navbar-logo-text">{logo.text}</span>}
            </a>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {navItems?.map((item, idx) => (
              <div key={idx} className="relative group">
                {item.subItems && item.subItems.length > 0 ? (
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                    id={`nav-item-dropdown-${idx}`}
                  >
                    {item.label}
                    {chevronIcon && (
                      <span className="h-4 w-4 transition-transform group-hover:rotate-180 flex items-center justify-center">
                        {chevronIcon}
                      </span>
                    )}
                  </button>
                ) : (
                  <a
                    href={item.href || '#'}
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                    id={`nav-item-link-${idx}`}
                  >
                    {item.label}
                  </a>
                )}

                {/* Dropdown Menu */}
                {item.subItems && item.subItems.length > 0 && (
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="w-56 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5">
                      {item.subItems.map((subItem, subIdx) => (
                        <a
                          key={subIdx}
                          href={subItem.href || '#'}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                          id={`nav-subitem-${idx}-${subIdx}`}
                        >
                          {subItem.icon && <span className="h-4 w-4 flex items-center justify-center">{subItem.icon}</span>}
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {actions?.map((action, idx) => (
            <a
              key={idx}
              href={action.href || '#'}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${getButtonStyles(action.variant)}`}
              id={`navbar-action-${idx}`}
            >
              {action.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-expanded={isMobileMenuOpen}
            id="mobile-menu-trigger"
          >
            {isMobileMenuOpen ? (
              <span className="h-6 w-6 flex items-center justify-center">{closeMenuIcon}</span>
            ) : (
              <span className="h-6 w-6 flex items-center justify-center">{mobileMenuIcon}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-gray-100 bg-white lg:hidden"
            id="mobile-menu-container"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {navItems?.map((item, idx) => (
                <div key={idx}>
                  {item.subItems && item.subItems.length > 0 ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveSubMenu(activeSubMenu === item.label ? null : (item.label || null))}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        id={`mobile-nav-item-dropdown-${idx}`}
                      >
                        {item.label}
                        {chevronIcon && (
                          <span className={`h-5 w-5 transition-transform flex items-center justify-center ${activeSubMenu === item.label ? 'rotate-180' : ''}`}>
                            {chevronIcon}
                          </span>
                        )}
                      </button>
                      <AnimatePresence>
                        {activeSubMenu === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 space-y-1 border-l border-gray-100 pl-4 overflow-hidden"
                          >
                            {item.subItems.map((subItem, subIdx) => (
                              <a
                                key={subIdx}
                                href={subItem.href || '#'}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                id={`mobile-nav-subitem-${idx}-${subIdx}`}
                              >
                                {subItem.icon && <span className="h-4 w-4 flex items-center justify-center">{subItem.icon}</span>}
                                {subItem.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      href={item.href || '#'}
                      className="block rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      id={`mobile-nav-item-link-${idx}`}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
              <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
                {actions?.map((action, idx) => (
                  <a
                    key={idx}
                    href={action.href || '#'}
                    className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-medium transition-all ${getButtonStyles(action.variant)}`}
                    id={`mobile-navbar-action-${idx}`}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarDynamic;
