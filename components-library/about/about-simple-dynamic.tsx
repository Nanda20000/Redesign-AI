import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AboutSimpleDynamicProps {
  headline?: string;
  topIntro?: string;
  heroImage?: string;
  label?: string;
  subIntro?: string;
  avatarImage?: string;
  avatarName?: string;
  avatarTitle?: string;
  mainStatement?: string;
}

export const AboutSimpleDynamic: React.FC<AboutSimpleDynamicProps> = ({
  headline,
  topIntro,
  heroImage,
  label,
  subIntro,
  avatarImage,
  avatarName,
  avatarTitle,
  mainStatement,
}) => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-start">
          <div className="md:col-span-7 lg:col-span-8">
            {headline && (
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black">
                {headline}
              </h2>
            )}
          </div>
          <div className="md:col-span-5 lg:col-span-4">
            {topIntro && (
              <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-md">
                {topIntro}
              </p>
            )}
          </div>
        </div>

        {/* Hero Image Section */}
        {heroImage && (
          <div className="w-full mb-16 md:mb-24">
            <img
              src={heroImage}
              alt={headline || ""}
              className="w-full h-auto object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Bottom Detailed Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Column 1: Label */}
          <div className="md:col-span-2">
            {label && (
              <span className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                {label}
              </span>
            )}
          </div>

          {/* Column 2: Sub Intro & Avatar */}
          <div className="md:col-span-4 flex flex-col gap-8">
            {subIntro && (
              <p className="text-sm md:text-base text-zinc-500 leading-relaxed">
                {subIntro}
              </p>
            )}
            
            {(avatarImage || avatarName || avatarTitle) && (
              <div className="flex items-center gap-4">
                {avatarImage && (
                  <img
                    src={avatarImage}
                    alt={avatarName || ""}
                    className="w-12 h-12 rounded-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  {avatarName && (
                    <h4 className="text-sm font-semibold text-black">
                      {avatarName}
                    </h4>
                  )}
                  {avatarTitle && (
                    <p className="text-xs text-zinc-400">
                      {avatarTitle}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Main Statement */}
          <div className="md:col-span-6">
            {mainStatement && (
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black leading-tight">
                {mainStatement}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSimpleDynamic;
