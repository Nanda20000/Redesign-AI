import React from 'react';
import { motion } from 'motion/react';

interface HeroActionDynamicProps {
  badgeText?: string;
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  secondaryCtaIcon?: React.ReactNode;
  trustAvatars?: string[];
  trustText?: string;
  mainImage?: string;
  floatingCard1Title?: string;
  floatingCard1Subtitle?: string;
  floatingCard2Title?: string;
  floatingCard2Subtitle?: string;
  floatingCard2Avatars?: string[];
}

export const HeroActionDynamic: React.FC<HeroActionDynamicProps> = ({
  badgeText,
  heading,
  description,
  primaryCtaText,
  secondaryCtaText,
  secondaryCtaIcon,
  trustAvatars,
  trustText,
  mainImage,
  floatingCard1Title,
  floatingCard1Subtitle,
  floatingCard2Title,
  floatingCard2Subtitle,
  floatingCard2Avatars,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start space-y-8"
          >
            {badgeText && (
              <div className="rounded-lg border border-[#0F766E] bg-[#F0FDFA] px-4 py-2 text-sm font-medium text-[#0F766E]">
                {badgeText}
              </div>
            )}

            {heading && (
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:leading-[1.1]">
                {heading}
              </h1>
            )}

            {description && (
              <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6">
              {primaryCtaText && (
                <button className="rounded-lg bg-[#0F766E] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#0D9488] active:scale-95">
                  {primaryCtaText}
                </button>
              )}
              {secondaryCtaText && (
                <button className="flex items-center gap-2 text-lg font-semibold text-[#0F766E] transition-colors hover:text-[#0D9488]">
                  {secondaryCtaIcon && <span>{secondaryCtaIcon}</span>}
                  {secondaryCtaText}
                </button>
              )}
            </div>

            {(trustAvatars || trustText) && (
              <div className="flex items-center gap-4 pt-4">
                {trustAvatars && trustAvatars.length > 0 && (
                  <div className="flex -space-x-3">
                    {trustAvatars.map((avatar, i) => (
                      <img
                        key={i}
                        src={avatar}
                        alt=""
                        className="h-10 w-10 rounded-full border-2 border-white object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                )}
                {trustText && (
                  <p className="text-sm text-gray-500">
                    {trustText}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative h-[500px] w-full max-w-[500px] overflow-hidden rounded-[2rem] bg-[#78B3A3]">
              {/* Subtle Pattern Overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              
              {mainImage && (
                <img
                  src={mainImage}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Floating Card 1 (Top Right) */}
              {(floatingCard1Title || floatingCard1Subtitle) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute right-6 top-6 rounded-xl bg-white/90 p-4 shadow-xl backdrop-blur-sm"
                >
                  <div className="text-center">
                    {floatingCard1Title && <div className="text-xl font-bold text-gray-900">{floatingCard1Title}</div>}
                    {floatingCard1Subtitle && <div className="text-xs text-gray-600">{floatingCard1Subtitle}</div>}
                  </div>
                </motion.div>
              )}

              {/* Floating Card 2 (Middle Left) */}
              {(floatingCard2Title || floatingCard2Subtitle || floatingCard2Avatars) && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 rounded-xl bg-white/90 p-4 shadow-xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      {floatingCard2Title && <div className="text-sm font-bold text-gray-900">{floatingCard2Title}</div>}
                      {floatingCard2Subtitle && <div className="text-[10px] text-gray-600">{floatingCard2Subtitle}</div>}
                    </div>
                    {floatingCard2Avatars && floatingCard2Avatars.length > 0 && (
                      <div className="flex -space-x-2">
                        {floatingCard2Avatars.map((avatar, i) => (
                          <img
                            key={i}
                            src={avatar}
                            alt=""
                            className="h-6 w-6 rounded-full border border-white object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroActionDynamic;
