'use client';

import React from 'react';

export interface GalleryItem {
  imageUrl: string | null | undefined;
  caption?: string | null;
  category?: string | null;
}

export interface GalleryDynamicProps {
  title?: string | null;
  subtitle?: string | null;
  items?: GalleryItem[] | null;
}

export function GalleryDynamic({ title, subtitle, items }: GalleryDynamicProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const validItems = items.filter(
    (item): item is { imageUrl: string; caption?: string | null; category?: string | null } =>
      !!item.imageUrl
  );

  if (validItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mx-auto max-w-3xl text-center mb-10 md:mb-12">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-muted-foreground text-sm md:text-base lg:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {validItems.map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.caption || ''}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {(item.caption || item.category) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {item.category && (
                      <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                    {item.caption && (
                      <p className="text-sm font-medium text-white">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GalleryDynamic;
