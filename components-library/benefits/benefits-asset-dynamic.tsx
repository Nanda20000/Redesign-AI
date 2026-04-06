import React from 'react';

/**
 * BenefitItem represents a single card in the benefits section.
 */
export interface BenefitItem {
  /** The icon to display at the top left of the card. */
  icon?: React.ReactNode;
  /** The title of the benefit. */
  title?: string;
  /** A brief description of the benefit. */
  description?: string;
  /** The text for the link (e.g., "Read More"). */
  linkText?: string;
  /** The destination URL for the link. */
  linkHref?: string;
  /** Whether this card should be highlighted with a dark background. */
  isHighlighted?: boolean;
}

/**
 * BenefitsAssetDynamicProps defines the props for the BenefitsAssetDynamic component.
 */
export interface BenefitsAssetDynamicProps {
  /** A small label above the main heading (e.g., "Practice Areas"). */
  label?: string;
  /** The main heading for the section. */
  heading?: string;
  /** An array of benefit items to display in a grid. */
  items?: BenefitItem[];
  /** The text for the footer button (e.g., "View More Services"). */
  footerButtonText?: string;
  /** The destination URL for the footer button. */
  footerButtonHref?: string;
  /** The arrow icon to display at the top right of each card. */
  arrowIcon?: React.ReactNode;
  /** The arrow icon to display next to the "Read More" link. */
  readMoreArrowIcon?: React.ReactNode;
}

/**
 * BenefitsAssetDynamic is a grid-based benefits section featuring a label, 
 * a main heading with decorative accents, and a series of cards. 
 * Each card contains an icon, a title, a description, and a 'Read More' link. 
 * One card can be highlighted with a dark background.
 */
export const BenefitsAssetDynamic: React.FC<BenefitsAssetDynamicProps> = ({
  label,
  heading,
  items,
  footerButtonText,
  footerButtonHref,
  arrowIcon,
  readMoreArrowIcon,
}) => {
  if (!label && !heading && (!items || items.length === 0) && !footerButtonText) {
    return null;
  }

  return (
    <section className="w-full bg-[#f5f5f0] py-16 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-12">
          {label && (
            <span className="inline-block bg-[#e0e0d5] text-[#4a4a4a] text-xs font-semibold px-3 py-1 rounded mb-4 uppercase tracking-wider">
              {label}
            </span>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] relative inline-block">
              {heading}
              {/* Decorative lines next to "Solution" (or end of heading) */}
              <span className="absolute -right-8 top-0 flex flex-col gap-1">
                <span className="w-4 h-[2px] bg-[#1a1a1a] rotate-[-30deg]"></span>
                <span className="w-4 h-[2px] bg-[#1a1a1a] rotate-[-30deg]"></span>
                <span className="w-4 h-[2px] bg-[#1a1a1a] rotate-[-30deg]"></span>
              </span>
            </h2>
          )}
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {items?.map((item, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                item.isHighlighted
                  ? 'bg-[#2c4454] text-white'
                  : 'bg-white text-[#1a1a1a]'
              }`}
            >
              {/* Top Right Arrow Icon */}
              {arrowIcon && (
                <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center ${
                  item.isHighlighted ? 'bg-[#3d5a6d]' : 'bg-[#f5f5f0]'
                }`}>
                  {arrowIcon}
                </div>
              )}

              {/* Icon */}
              {item.icon && (
                <div className={`mb-6 w-12 h-12 flex items-center justify-center rounded-lg ${
                  item.isHighlighted ? 'bg-[#3d5a6d]' : 'bg-[#f5f5f0]'
                }`}>
                  {item.icon}
                </div>
              )}

              {/* Title */}
              {item.title && (
                <h3 className="text-xl font-bold mb-4">
                  {item.title}
                </h3>
              )}

              {/* Description */}
              {item.description && (
                <p className={`text-sm leading-relaxed mb-6 ${
                  item.isHighlighted ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              )}

              {/* Read More Link */}
              {item.linkText && (
                <a
                  href={item.linkHref || '#'}
                  className="inline-flex items-center text-sm font-bold hover:underline"
                >
                  {item.linkText}
                  {readMoreArrowIcon && <span className="ml-2">{readMoreArrowIcon}</span>}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Footer Button */}
        {footerButtonText && (
          <a
            href={footerButtonHref || '#'}
            className="bg-[#2c4454] text-white px-8 py-3 rounded-full font-bold text-sm transition-colors hover:bg-[#1e2f3a]"
          >
            {footerButtonText}
          </a>
        )}
      </div>
    </section>
  );
};

export default BenefitsAssetDynamic;
