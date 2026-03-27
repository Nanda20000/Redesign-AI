'use client';

import React from 'react';

export interface BlogArticle {
  imageUrl: string | null | undefined;
  category?: string | null;
  title?: string | null;
  excerpt?: string | null;
  author?: string | null;
  date?: string | null;
  readMoreText?: string | null;
  href?: string | null;
}

export interface BlogDynamicProps {
  title?: string | null;
  subtitle?: string | null;
  items?: BlogArticle[] | null;
}

export function BlogDynamic({ title, subtitle, items }: BlogDynamicProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const validItems = items.filter(
    (item): item is { imageUrl: string; category?: string | null; title?: string | null; excerpt?: string | null; author?: string | null; date?: string | null; readMoreText?: string | null; href?: string | null } =>
      !!item.imageUrl
  );

  if (validItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-muted/30">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {validItems.map((item, index) => (
            <article
              key={index}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
            >
              {item.imageUrl && (
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title || ''}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                {item.category && (
                  <span className="mb-3 inline-block text-xs font-medium text-primary">
                    {item.category}
                  </span>
                )}
                {item.title && (
                  <h3 className="text-lg font-semibold leading-tight">
                    {item.title}
                  </h3>
                )}
                {item.excerpt && (
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">
                    {item.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  {item.author && (
                    <span>{item.author}</span>
                  )}
                  {item.date && (
                    <>
                      <span>•</span>
                      <span>{item.date}</span>
                    </>
                  )}
                </div>
                {item.readMoreText && item.href && (
                  <a
                    href={item.href}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    {item.readMoreText}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogDynamic;
