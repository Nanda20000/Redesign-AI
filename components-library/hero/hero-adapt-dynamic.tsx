import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeroAdaptDynamicProps {
  trustpilotLogo?: React.ReactNode;
  trustpilotStars?: React.ReactNode;
  trustpilotRating?: string;
  trustpilotReviews?: string;
  trustpilotSubLabel?: string;
  title?: string;
  description?: string;
  feature1Icon?: React.ReactNode;
  feature1Text?: string;
  feature2Icon?: React.ReactNode;
  feature2Text?: string;
  feature3Icon?: React.ReactNode;
  feature3Text?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: {
    main?: string;
    badge?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
}

export const HeroAdaptDynamic: React.FC<HeroAdaptDynamicProps> = ({
  trustpilotLogo,
  trustpilotStars,
  trustpilotRating,
  trustpilotReviews,
  trustpilotSubLabel,
  title,
  description,
  feature1Icon,
  feature1Text,
  feature2Icon,
  feature2Text,
  feature3Icon,
  feature3Text,
  ctaText,
  ctaLink,
  images,
}) => {
  const mainImage = images?.main;
  const badgeImage = images?.badge;
  const bottomLeftImage = images?.bottomLeft;
  const bottomRightImage = images?.bottomRight;
  return (
    <section
      style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#F9F7F2' }}
      className="relative overflow-hidden"
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght @300;500&display=swap');`}</style>
      
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start max-w-xl">
            {/* Trustpilot Section */}
            {(trustpilotLogo || trustpilotStars || trustpilotRating || trustpilotReviews) && (
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {trustpilotLogo && <div>{trustpilotLogo}</div>}
                {trustpilotStars && <div>{trustpilotStars}</div>}
                {trustpilotRating && (
                  <span style={{ fontWeight: 300 }} className="text-sm text-gray-700">
                    {trustpilotRating}
                  </span>
                )}
                {trustpilotReviews && (
                  <span style={{ fontWeight: 300 }} className="text-sm text-gray-500">
                    • {trustpilotReviews}
                  </span>
                )}
              </div>
            )}

            {trustpilotSubLabel && (
              <p
                style={{ fontWeight: 300 }}
                className="text-sm text-gray-800 mb-8"
              >
                {trustpilotSubLabel}
              </p>
            )}

            {title && (
              <h1
                style={{ fontWeight: 500 }}
                className="text-5xl lg:text-7xl text-[#1A2E1A] leading-[1.1] mb-8"
              >
                {title}
              </h1>
            )}

            {description && (
              <p
                style={{ fontWeight: 300 }}
                className="text-lg text-[#1A2E1A] opacity-80 mb-10 max-w-md leading-relaxed"
              >
                {description}
              </p>
            )}

            {/* Features List */}
            <div className="space-y-4 mb-10">
              {feature1Text && (
                <div className="flex items-center gap-3">
                  {feature1Icon && <div className="text-[#1A2E1A]">{feature1Icon}</div>}
                  <span style={{ fontWeight: 300 }} className="text-[#1A2E1A]">
                    {feature1Text}
                  </span>
                </div>
              )}
              {feature2Text && (
                <div className="flex items-center gap-3">
                  {feature2Icon && <div className="text-[#1A2E1A]">{feature2Icon}</div>}
                  <span style={{ fontWeight: 300 }} className="text-[#1A2E1A]">
                    {feature2Text}
                  </span>
                </div>
              )}
              {feature3Text && (
                <div className="flex items-center gap-3">
                  {feature3Icon && <div className="text-[#1A2E1A]">{feature3Icon}</div>}
                  <span style={{ fontWeight: 300 }} className="text-[#1A2E1A]">
                    {feature3Text}
                  </span>
                </div>
              )}
            </div>

            {ctaText && (
              <a
                href={ctaLink || '#'}
                style={{ fontWeight: 300 }}
                className="inline-block bg-[#1A2E1A] text-white px-8 py-4 rounded-full text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-black/5"
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Right Column: Image Grid */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {mainImage && (
              <div className="col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden group">
                <img
                  src={mainImage}
                  alt={title || 'Main hero image'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {badgeImage && (
                  <div className="absolute top-6 right-6 w-24 h-24 lg:w-32 lg:h-32">
                    <img
                      src={badgeImage}
                      alt="Badge"
                      className="w-full h-full object-contain animate-spin-slow"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            )}
            {bottomLeftImage && (
              <div className="aspect-square rounded-3xl overflow-hidden group">
                <img
                  src={bottomLeftImage}
                  alt="Feature detail 1"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            {bottomRightImage && (
              <div className="aspect-square rounded-3xl overflow-hidden group">
                <img
                  src={bottomRightImage}
                  alt="Feature detail 2"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroAdaptDynamic;
