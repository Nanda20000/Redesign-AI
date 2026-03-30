/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeroItem {
  label?: string;
  title?: string;
  description?: string;
  footerLabel?: string;
  footerValue?: string;
  color?: string;
  icon?: React.ReactNode;
}

export interface HeroStylishColouredDynamicProps {
  title?: string;
  subtitle?: string;
  emailPlaceholder?: string;
  buttonText?: string;
  emailIcon?: React.ReactNode;
  sectionTitle?: string;
  exploreText?: string;
  exploreLink?: string;
  items?: HeroItem[];
  onSignUp?: (email: string) => void;
}

export const HeroStylishColouredDynamic: React.FC<HeroStylishColouredDynamicProps> = ({
  title,
  subtitle,
  emailPlaceholder,
  buttonText,
  emailIcon,
  sectionTitle,
  exploreText,
  exploreLink,
  items,
  onSignUp,
}) => {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSignUp) onSignUp(email);
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {title && (
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 max-w-4xl leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-lg text-gray-600 mb-10 max-w-2xl">
            {subtitle}
          </p>
        )}

        <div 
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mb-20"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        >
          <div className="relative w-full">
            {emailIcon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {emailIcon}
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder || ''}
              className={`w-full py-4 ${emailIcon ? 'pl-12' : 'pl-6'} pr-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition-all`}
            />
          </div>
          {buttonText && (
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-10 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              {buttonText}
            </button>
          )}
        </div>

        <div className="w-full flex justify-between items-end mb-8">
          {sectionTitle && (
            <h2 className="text-2xl font-bold text-black">
              {sectionTitle}
            </h2>
          )}
          {exploreText && (
            <a 
              href={exploreLink || '#'} 
              className="text-black font-semibold hover:underline flex items-center gap-1"
            >
              {exploreText}
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {items?.map((item, index) => (
            <div
              key={index}
              className={`p-8 rounded-3xl flex flex-col justify-between min-h-[320px] text-left transition-transform hover:scale-[1.02] ${item.color || 'bg-gray-100'}`}
            >
              <div>
                {item.label && (
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-4 block">
                    {item.label}
                  </span>
                )}
                {item.title && (
                  <h3 className="text-2xl font-bold mb-4 leading-tight">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-sm leading-relaxed opacity-80">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-end mt-8">
                <div>
                  {item.footerLabel && (
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-1">
                      {item.footerLabel}
                    </span>
                  )}
                  {item.footerValue && (
                    <span className="text-3xl font-bold">
                      {item.footerValue}
                    </span>
                  )}
                </div>
                {item.icon && (
                  <button className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                    {item.icon}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroStylishColouredDynamic;
