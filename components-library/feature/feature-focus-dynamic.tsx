import React from 'react';
import { motion } from 'motion/react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FeatureFocusDynamicProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  features: FeatureItem[];
}

export const FeatureFocusDynamic: React.FC<FeatureFocusDynamicProps> = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  features = [],
}) => {
  const leftFeatures = features.slice(0, 2);
  const rightFeatures = features.slice(2, 4);

  return (
    <section
      className="py-20 px-6 md:px-12 bg-white overflow-hidden"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{` @import url('https://fonts.googleapis.com/css2family=Roboto:wght @300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl text-neutral-900 mb-6 leading-tight"
              style={{ fontWeight: 500 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-neutral-600 leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Column */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            {leftFeatures.map((feature, index) => (
              <motion.div
                key={`left-${index}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-neutral-50 p-8 rounded-[2rem] flex flex-col gap-6 h-full"
              >
                {feature.icon && (
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                    {feature.icon}
                  </div>
                )}
                <div className="space-y-3">
                  {feature.title && (
                    <h3
                      className="text-xl text-neutral-900"
                      style={{ fontWeight: 500 }}
                    >
                      {feature.title}
                    </h3>
                  )}
                  {feature.description && (
                    <p
                      className="text-neutral-600 leading-relaxed"
                      style={{ fontWeight: 300 }}
                    >
                      {feature.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            {imageSrc && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl"
              >
                <img
                  src={imageSrc}
                  alt={imageAlt || "Feature spotlight"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 order-3">
            {rightFeatures.map((feature, index) => (
              <motion.div
                key={`right-${index}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-neutral-50 p-8 rounded-[2rem] flex flex-col gap-6 h-full"
              >
                {feature.icon && (
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                    {feature.icon}
                  </div>
                )}
                <div className="space-y-3">
                  {feature.title && (
                    <h3
                      className="text-xl text-neutral-900"
                      style={{ fontWeight: 500 }}
                    >
                      {feature.title}
                    </h3>
                  )}
                  {feature.description && (
                    <p
                      className="text-neutral-600 leading-relaxed"
                      style={{ fontWeight: 300 }}
                    >
                      {feature.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureFocusDynamic;
