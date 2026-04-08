/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FeatureItem {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export interface FeatureListDynamicProps {
  label?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  features?: FeatureItem[];
  backgroundImage?: string;
}

export const FeatureListDynamic: React.FC<FeatureListDynamicProps> = ({
  label,
  title,
  description,
  ctaText,
  features,
  backgroundImage,
}) => {
  return (
    <section
      className="relative overflow-hidden bg-white py-24 lg:py-32"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght @300;500&display=swap');`}</style>

      {/* Background Image with Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-5">
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-wrap lg:flex-nowrap">
          {/* Left Content Column */}
          <div className="mb-16 w-full lg:mb-0 lg:w-1/3 lg:pr-12">
            {label && (
              <span
                className="mb-4 block text-sm tracking-widest uppercase text-rose-500"
                style={{ fontWeight: 300 }}
              >
                {label}
              </span>
            )}
            {title && (
              <h2
                className="mb-6 text-4xl leading-tight text-slate-900 md:text-5xl"
                style={{ fontWeight: 500 }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className="mb-10 text-lg leading-relaxed text-slate-600"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            )}
            {ctaText && (
              <button
                className="inline-block bg-slate-900 px-8 py-4 text-sm tracking-wider text-white transition-colors hover:bg-slate-800"
                style={{ fontWeight: 300 }}
              >
                {ctaText}
              </button>
            )}
          </div>

          {/* Right Features Grid */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
              {features?.map((feature, index) => (
                <div key={index} className="flex flex-col">
                  {feature.icon && (
                    <div className="mb-6 text-slate-900">
                      {React.cloneElement(feature.icon as React.ReactElement, {
                        size: 40,
                        strokeWidth: 1.5,
                      })}
                    </div>
                  )}
                  {feature.title && (
                    <h3
                      className="mb-4 text-xl text-slate-900"
                      style={{ fontWeight: 500 }}
                    >
                      {feature.title}
                    </h3>
                  )}
                  {feature.description && (
                    <p
                      className="text-sm leading-relaxed text-slate-500"
                      style={{ fontWeight: 300 }}
                    >
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureListDynamic;
