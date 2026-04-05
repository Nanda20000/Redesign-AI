import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface AboutBioDynamicProps {
  label?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaIcon?: React.ReactNode;
  storyTitle?: string;
  storyDescription?: string;
  storyImage?: string;
  missionTitle?: string;
  missionDescription?: string;
  visionTitle?: string;
  visionDescription?: string;
  className?: string;
}

export const AboutBioDynamic: React.FC<AboutBioDynamicProps> = ({
  label,
  heading,
  description,
  ctaText,
  ctaIcon,
  storyTitle,
  storyDescription,
  storyImage,
  missionTitle,
  missionDescription,
  visionTitle,
  visionDescription,
  className,
}) => {
  return (
    <section className={cn('py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto font-sans', className)}>
      {/* Top Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {label && (
            <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">
              {label}
            </span>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              {heading}
            </h2>
          )}
          {ctaText && (
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2 group">
              {ctaText}
              {ctaIcon && <span className="group-hover:translate-x-1 transition-transform">{ctaIcon}</span>}
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {description && (
            <p className="text-slate-500 text-lg leading-relaxed md:pt-12">
              {description}
            </p>
          )}
        </motion.div>
      </div>

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Story Card (Large) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:col-span-2 relative group overflow-hidden rounded-3xl min-h-[400px] md:min-h-[500px]"
        >
          {storyImage && (
            <img 
              src={storyImage} 
              alt={storyTitle || 'Our Story'} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-2xl">
            {storyTitle && (
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {storyTitle}
              </h3>
            )}
            {storyDescription && (
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                {storyDescription}
              </p>
            )}
          </div>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="flex flex-col gap-6">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 bg-emerald-50 p-8 md:p-10 rounded-3xl flex flex-col justify-center"
          >
            {missionTitle && (
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {missionTitle}
              </h3>
            )}
            {missionDescription && (
              <p className="text-slate-600 leading-relaxed">
                {missionDescription}
              </p>
            )}
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex-1 bg-emerald-800 p-8 md:p-10 rounded-3xl flex flex-col justify-center text-white"
          >
            {visionTitle && (
              <h3 className="text-2xl font-bold mb-4">
                {visionTitle}
              </h3>
            )}
            {visionDescription && (
              <p className="text-emerald-50/80 leading-relaxed">
                {visionDescription}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutBioDynamic;
