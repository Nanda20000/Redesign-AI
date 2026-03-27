'use client';

import React from 'react';

export interface HeroBannerDynamicProps {
  backgroundImage?: string | null;
  breadcrumb?: string | null;
  title?: string | null;
  description?: string | null;
}

export function HeroBannerDynamic({
  backgroundImage,
  breadcrumb,
  title,
  description,
}: HeroBannerDynamicProps) {
  if (!title && !breadcrumb && !description) {
    return null;
  }

  return (
    <section className="relative w-full h-[250px] md:h-[400px] overflow-hidden">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 text-center text-white">
          {breadcrumb && (
            <p className="mb-4 text-sm font-medium opacity-80">
              {breadcrumb}
            </p>
          )}
          {title && (
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroBannerDynamic;
