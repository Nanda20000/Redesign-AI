import React from 'react';

export interface PartnerItem {
  name?: string;
  icon?: React.ReactNode;
}

export interface HeroNewBaseDynamicProps {
  tagline?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaIcon?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  statValue?: string;
  statLabel?: string;
  highlightTitle?: string;
  highlightDescription?: string;
  partners?: PartnerItem[];
}

export function HeroNewBaseDynamic({
  tagline,
  title,
  description,
  ctaText,
  ctaLink,
  ctaIcon,
  imageUrl,
  imageAlt,
  statValue,
  statLabel,
  highlightTitle,
  highlightDescription,
  partners,
}: HeroNewBaseDynamicProps) {
  const hasHeaderContent = Boolean(tagline || title || description || ctaText);
  const hasCardContent = Boolean(
    imageUrl ||
    statValue ||
    statLabel ||
    highlightTitle ||
    highlightDescription ||
    (partners && partners.length > 0)
  );

  return (
    <section
      id="hero-new-base-dynamic"
      className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {hasHeaderContent && (
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12 lg:mb-16 flex flex-col items-center">
            {tagline && (
              <p
                id="hero-tagline"
                className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-800 mb-4 sm:mb-6"
                style={{ fontWeight: 300 }}
              >
                {tagline}
              </p>
            )}

            {title && (
              <h1
                id="hero-title"
                className="text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] leading-[1.08] text-neutral-950 mb-6 sm:mb-8"
                style={{ fontWeight: 500 }}
              >
                {title}
              </h1>
            )}

            {description && (
              <p
                id="hero-description"
                className="text-base sm:text-lg lg:text-xl text-neutral-500 max-w-2xl sm:max-w-3xl leading-relaxed mb-8 sm:mb-10"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            )}

            {ctaText && (
              ctaLink ? (
                <a
                  href={ctaLink}
                  id="hero-cta-button"
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-black text-white text-sm sm:text-base hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                  style={{ fontWeight: 300 }}
                >
                  <span style={{ fontWeight: 300 }}>{ctaText}</span>
                  {ctaIcon && (
                    <span
                      className="inline-flex items-center justify-center shrink-0"
                      style={{ fontWeight: 300 }}
                    >
                      {ctaIcon}
                    </span>
                  )}
                </a>
              ) : (
                <div
                  id="hero-cta-button"
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-black text-white text-sm sm:text-base hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                  style={{ fontWeight: 300 }}
                >
                  <span style={{ fontWeight: 300 }}>{ctaText}</span>
                  {ctaIcon && (
                    <span
                      className="inline-flex items-center justify-center shrink-0"
                      style={{ fontWeight: 300 }}
                    >
                      {ctaIcon}
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {hasCardContent && (
          <div
            id="hero-card-container"
            className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden bg-neutral-900 shadow-xl"
          >
            {imageUrl && (
              <img
                id="hero-image"
                src={imageUrl}
                alt={imageAlt || ''}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

            {(statValue || statLabel) && (
              <div
                id="hero-stat-block"
                className="absolute top-6 left-6 sm:top-10 sm:left-10 lg:top-12 lg:left-12 z-10 flex flex-col gap-1 max-w-[180px] sm:max-w-[220px]"
              >
                {statValue && (
                  <h3
                    className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none drop-shadow-sm"
                    style={{ fontWeight: 500 }}
                  >
                    {statValue}
                  </h3>
                )}
                {statLabel && (
                  <p
                    className="text-xs sm:text-sm text-white/90 leading-snug mt-1 drop-shadow-sm"
                    style={{ fontWeight: 300 }}
                  >
                    {statLabel}
                  </p>
                )}
              </div>
            )}

            {(highlightTitle || highlightDescription) && (
              <div
                id="hero-highlight-block"
                className="absolute bottom-16 right-6 sm:bottom-20 sm:right-10 lg:bottom-20 lg:right-12 z-10 flex flex-col items-end text-right max-w-[240px] sm:max-w-xs lg:max-w-sm"
              >
                {highlightTitle && (
                  <h2
                    className="text-xl sm:text-2xl lg:text-3xl text-white leading-tight mb-2 drop-shadow-sm"
                    style={{ fontWeight: 500 }}
                  >
                    {highlightTitle}
                  </h2>
                )}
                {highlightDescription && (
                  <p
                    className="text-xs sm:text-sm text-white/85 leading-relaxed drop-shadow-sm"
                    style={{ fontWeight: 300 }}
                  >
                    {highlightDescription}
                  </p>
                )}
              </div>
            )}

            {partners && partners.length > 0 && (
              <div
                id="hero-partners-dock"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 bg-white rounded-t-[20px] sm:rounded-t-[24px] px-4 sm:px-8 py-2.5 sm:py-3.5 shadow-lg flex items-center justify-center gap-3.5 sm:gap-8 max-w-[95%] sm:max-w-none"
              >
                {partners.map((partner, index) => (
                  (partner.name || partner.icon) ? (
                    <div
                      key={index}
                      id={`hero-partner-${index}`}
                      className={`${index >= 3 ? 'hidden sm:flex' : 'flex'} items-center gap-1.5 sm:gap-2 shrink-0`}
                    >
                      {partner.icon && (
                        <span
                          className="inline-flex items-center justify-center shrink-0 text-black"
                          style={{ fontWeight: 300 }}
                        >
                          {partner.icon}
                        </span>
                      )}
                      {partner.name && (
                        <span
                          className="text-xs sm:text-sm text-neutral-900 whitespace-nowrap"
                          style={{ fontWeight: 300 }}
                        >
                          {partner.name}
                        </span>
                      )}
                    </div>
                  ) : null
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroNewBaseDynamic;
