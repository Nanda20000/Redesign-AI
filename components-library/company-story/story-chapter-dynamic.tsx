import React from 'react';

export interface StoryChapterDynamicProps {
  label?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;

  // List Item 1
  item1Title?: string;
  item1Description?: string;
  item1Icon?: React.ReactNode;

  // List Item 2
  item2Title?: string;
  item2Description?: string;
  item2Icon?: React.ReactNode;

  // List Item 3
  item3Title?: string;
  item3Description?: string;
  item3Icon?: React.ReactNode;

  // List Item 4
  item4Title?: string;
  item4Description?: string;
  item4Icon?: React.ReactNode;
}

export function StoryChapterDynamic({
  label,
  titlePrefix,
  titleHighlight,
  description,
  ctaText,
  ctaHref,
  item1Title,
  item1Description,
  item1Icon,
  item2Title,
  item2Description,
  item2Icon,
  item3Title,
  item3Description,
  item3Icon,
  item4Title,
  item4Description,
  item4Icon,
}: StoryChapterDynamicProps) {
  // If no props are populated, render nothing.
  const hasContent =
    label ||
    titlePrefix ||
    titleHighlight ||
    description ||
    ctaText ||
    item1Title ||
    item2Title ||
    item3Title ||
    item4Title;

  if (!hasContent) {
    return null;
  }

  // Render individual list items only if they have a title or description.
  const renderItem = (
    title?: string,
    desc?: string,
    icon?: React.ReactNode
  ) => {
    if (!title && !desc) return null;
    return (
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 w-11 h-11 rounded-full border border-red-500/25 flex items-center justify-center text-[#ef4444] self-start mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          {title && (
            <h3
              className="text-lg text-[#1a1a1a] mb-1.5 leading-snug"
              style={{ fontWeight: 500 }}
            >
              {title}
            </h3>
          )}
          {desc && (
            <p
              className="text-sm text-gray-500 leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {desc}
            </p>
          )}
        </div>
      </div>
    );
  };

  const hasCol1 = item1Title || item1Description || item2Title || item2Description;
  const hasCol2 = item3Title || item3Description || item4Title || item4Description;

  return (
    <section
      className="w-full bg-white py-16 md:py-24 px-6 md:px-12 md:max-w-7xl md:mx-auto"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
        
        {/* Left Information Panel */}
        <div className="md:col-span-5 flex flex-col items-start text-left">
          {/* Tagline / Sub-badge */}
          {label && (
            <div className="mb-4">
              <span
                className="text-xs tracking-widest uppercase text-[#555555]"
                style={{ fontWeight: 300 }}
              >
                {label}
              </span>
              <div className="grid grid-cols-1 mt-1.5">
                <div className="w-10 h-[2px] bg-[#ef4444]" />
              </div>
            </div>
          )}

          {/* Heading */}
          {(titlePrefix || titleHighlight) && (
            <h2
              className="text-[34px] md:text-[45px] text-[#1a1a1a] leading-tight mb-6 tracking-tight"
              style={{ fontWeight: 500 }}
            >
              {titlePrefix && (
                <span style={{ fontWeight: 500 }} className="mr-2">
                  {titlePrefix}
                </span>
              )}
              {titleHighlight && (
                <span style={{ fontWeight: 500 }} className="text-[#ef4444]">
                  {titleHighlight}
                </span>
              )}
            </h2>
          )}

          {/* Description Paragraph */}
          {description && (
            <p
              className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-md"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          )}

          {/* Dynamic Button (CTA) */}
          {ctaText && (
            <div>
              <a
                href={ctaHref || '#'}
                className="inline-block bg-[#ef4444] hover:bg-[#dc2626] text-white px-8 py-3.5 rounded-sm tracking-wider uppercase text-xs transition duration-200"
                style={{ fontWeight: 300 }}
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>

        {/* Right Feature Panel */}
        {(hasCol1 || hasCol2) && (
          <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 mt-2 md:mt-4">
            
            {/* List Column 1 (Left subset of items) */}
            {hasCol1 && (
              <div className="flex flex-col gap-8 md:pr-8">
                {renderItem(item1Title, item1Description, item1Icon)}
                {item1Title && item2Title && (
                  <div className="border-b border-gray-100 w-full" />
                )}
                {renderItem(item2Title, item2Description, item2Icon)}
              </div>
            )}

            {/* List Column 2 (Right subset of items separated by a vertical divider) */}
            {hasCol2 && (
              <div className="flex flex-col gap-8 border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0 pl-0 md:pl-8">
                {renderItem(item3Title, item3Description, item3Icon)}
                {item3Title && item4Title && (
                  <div className="border-b border-gray-100 w-full" />
                )}
                {renderItem(item4Title, item4Description, item4Icon)}
              </div>
            )}
            
          </div>
        )}

      </div>
    </section>
  );
}

export default StoryChapterDynamic;
