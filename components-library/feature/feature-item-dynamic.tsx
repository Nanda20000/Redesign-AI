'use client';

import React from 'react';

interface FeatureItem {
  badge?: string;
  title?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  variant?: 'dark' | 'blue' | 'orange' | 'default';
  icon?: React.ReactNode;
}

interface FeatureItemDynamicProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  items?: FeatureItem[];
}

export const FeatureItemDynamic: React.FC<FeatureItemDynamicProps> = ({
  title,
  subtitle,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  items,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'dark':
        return 'bg-[#1e2235] text-white';
      case 'blue':
        return 'bg-[#2b89ff] text-white';
      case 'orange':
        return 'bg-[#ff9f43] text-white';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <section 
      className="py-20 px-6 md:px-12 lg:px-24 bg-white"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {title && (
            <h2 
              className="text-4xl md:text-5xl mb-6 text-[#1e2235] tracking-tight leading-tight"
              style={{ fontWeight: 500 }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p 
              className="text-lg text-gray-500 mb-10 leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {subtitle}
            </p>
          )}
          
          <div className="flex flex-wrap justify-center gap-4">
            {primaryCtaText && (
              <a
                href={primaryCtaLink || '#'}
                className="px-8 py-3 bg-[#2b89ff] text-white rounded-md transition-all hover:bg-[#1a73e8] shadow-sm"
                style={{ fontWeight: 300 }}
              >
                {primaryCtaText}
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={secondaryCtaLink || '#'}
                className="px-8 py-3 bg-[#e8f0fe] text-[#2b89ff] rounded-md transition-all hover:bg-[#d2e3fc]"
                style={{ fontWeight: 300 }}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>

        {/* Grid Section */}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-8 min-h-[400px] flex flex-col justify-end transition-transform hover:-translate-y-1 shadow-lg ${getVariantStyles(item.variant || 'default')}`}
              >
                {/* Decorative Background Patterns (Simplified) */}
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-40 h-40 border-8 border-current rounded-full" />
                  <div className="absolute top-20 left-10 w-20 h-20 bg-current opacity-20 rotate-45" />
                  <div className="absolute bottom-10 right-20 w-32 h-10 bg-current opacity-10" />
                </div>

                <div className="relative z-10">
                  {item.badge && (
                    <span 
                      className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest mb-6"
                      style={{ fontWeight: 500 }}
                    >
                      {item.badge}
                    </span>
                  )}
                  
                  {item.icon && (
                    <div className="mb-6 opacity-80">
                      {item.icon}
                    </div>
                  )}

                  {item.title && (
                    <h3 
                      className="text-2xl mb-4 leading-snug"
                      style={{ fontWeight: 500 }}
                    >
                      {item.title}
                    </h3>
                  )}
                  
                  {item.description && (
                    <p 
                      className="text-sm opacity-80 mb-8 leading-relaxed line-clamp-4"
                      style={{ fontWeight: 300 }}
                    >
                      {item.description}
                    </p>
                  )}

                  {item.linkText && (
                    <a
                      href={item.linkUrl || '#'}
                      className="inline-flex items-center group text-sm"
                      style={{ fontWeight: 300 }}
                    >
                      {item.linkText}
                      <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureItemDynamic;
