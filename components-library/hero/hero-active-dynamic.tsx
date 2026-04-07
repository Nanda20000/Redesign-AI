/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface HeroActiveDynamicProps {
  heading?: string;
  expertAvatars?: string[];
  expertCount?: string;
  expertLabel?: string;
  expertDescription?: string;
  videoThumbnail?: string;
  videoIcon?: React.ReactNode;
  portraitImage?: string;
  portraitCtaText?: string;
  portraitCtaIcon?: React.ReactNode;
  featureIcon?: React.ReactNode;
  featureTitle?: string;
  featureDescription?: string;
  featureCtaIcon?: React.ReactNode;
  statsCount?: string;
  statsLabel?: string;
  statsDescription?: string;
}

export const HeroActiveDynamic: React.FC<HeroActiveDynamicProps> = ({
  heading,
  expertAvatars,
  expertCount,
  expertLabel,
  expertDescription,
  videoThumbnail,
  videoIcon,
  portraitImage,
  portraitCtaText,
  portraitCtaIcon,
  featureIcon,
  featureTitle,
  featureDescription,
  featureCtaIcon,
  statsCount,
  statsLabel,
  statsDescription,
}) => {
  return (
    <section
      className="w-full py-12 md:py-20 bg-white"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2?family=Roboto:wght @400;500;700&display=swap');`}</style>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
          <div className="lg:col-span-7">
            {heading && (
              <h1 
                className="text-4xl md:text-6xl text-gray-900 leading-tight"
                style={{ fontWeight: 700 }}
              >
                {heading}
              </h1>
            )}
          </div>
          
          <div className="lg:col-span-5 flex flex-col gap-6">
            {(expertAvatars || expertCount || expertLabel) && (
              <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
                {expertAvatars && expertAvatars.length > 0 && (
                  <div className="flex -space-x-3">
                    {expertAvatars.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-col">
                  {expertCount && (
                    <span 
                      className="text-2xl text-blue-600 leading-none"
                      style={{ fontWeight: 700 }}
                    >
                      {expertCount}
                    </span>
                  )}
                  {expertLabel && (
                    <span 
                      className="text-sm text-gray-500"
                      style={{ fontWeight: 500 }}
                    >
                      {expertLabel}
                    </span>
                  )}
                </div>
              </div>
            )}
            {expertDescription && (
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                {expertDescription}
              </p>
            )}
          </div>
        </div>

        {/* Bento Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Video + Feature/Stats) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Video Thumbnail */}
            {videoThumbnail && (
              <div className="relative aspect-[16/7] rounded-3xl overflow-hidden group">
                <img
                  src={videoThumbnail}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {videoIcon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors cursor-pointer">
                      {videoIcon}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sub-grid (Feature + Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Card (Blue) */}
              {(featureIcon || featureTitle || featureDescription || featureCtaIcon) && (
                <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  
                  <div>
                    {featureIcon && (
                      <div className="mb-6 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        {featureIcon}
                      </div>
                    )}
                    {featureTitle && (
                      <h3 
                        className="text-xl mb-2"
                        style={{ fontWeight: 700 }}
                      >
                        {featureTitle}
                      </h3>
                    )}
                    {featureDescription && (
                      <p className="text-blue-100 text-sm">{featureDescription}</p>
                    )}
                  </div>
                  
                  {featureCtaIcon && (
                    <div className="absolute bottom-8 right-8">
                      <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all cursor-pointer">
                        {featureCtaIcon}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Card */}
              {(statsCount || statsLabel || statsDescription) && (
                <div className="bg-slate-50 rounded-3xl p-8 flex flex-col justify-center">
                  {statsCount && (
                    <span 
                      className="text-4xl text-blue-600 mb-2"
                      style={{ fontWeight: 700 }}
                    >
                      {statsCount}
                    </span>
                  )}
                  {statsLabel && (
                    <h4 
                      className="text-lg text-gray-900 mb-2"
                      style={{ fontWeight: 700 }}
                    >
                      {statsLabel}
                    </h4>
                  )}
                  {statsDescription && (
                    <p className="text-gray-500 text-sm">
                      {statsDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Portrait Image) */}
          <div className="lg:col-span-4">
            {portraitImage && (
              <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden group">
                <img
                  src={portraitImage}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {(portraitCtaText || portraitCtaIcon) && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-8">
                    <button 
                      className="w-full bg-white text-gray-900 py-4 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-gray-50 transition-colors"
                      style={{ fontWeight: 700 }}
                    >
                      {portraitCtaText}
                      {portraitCtaIcon}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroActiveDynamic;
