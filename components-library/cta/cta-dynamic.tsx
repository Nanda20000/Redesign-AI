'use client';

import React from 'react';

export interface CtaDynamicProps {
  badge?: string | null;
  headline?: string | null;
  description?: string | null;
  primaryButtonText?: string | null;
  primaryButtonHref?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonHref?: string | null;
  backgroundImage?: string | null;
}

export function CtaDynamic({
  badge,
  headline,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  backgroundImage,
}: CtaDynamicProps) {
  if (!headline && !description && !primaryButtonText && !secondaryButtonText) {
    return null;
  }

  const hasBackground = !!backgroundImage;

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32">
      {hasBackground && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div
        className={`relative z-10 ${hasBackground ? 'bg-black/60' : 'bg-primary'} ${hasBackground ? '' : 'text-primary-foreground'}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            {badge && (
              <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                {badge}
              </span>
            )}
            {headline && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {headline}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base sm:text-lg md:text-xl opacity-90">
                {description}
              </p>
            )}
            {(primaryButtonText || secondaryButtonText) && (
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                {primaryButtonText && primaryButtonHref && (
                  <a
                    href={primaryButtonHref}
                    className={`inline-flex items-center justify-center rounded-md px-8 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      hasBackground
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                    }`}
                  >
                    {primaryButtonText}
                  </a>
                )}
                {secondaryButtonText && secondaryButtonHref && (
                  <a
                    href={secondaryButtonHref}
                    className={`inline-flex items-center justify-center rounded-md border px-8 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      hasBackground
                        ? 'border-white/30 text-white hover:bg-white/10'
                        : 'border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10'
                    }`}
                  >
                    {secondaryButtonText}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaDynamic;
