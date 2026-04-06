import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface BenefitsAdvantageDynamicProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  description?: string;
  items?: Array<{
    id: string;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    toggleIcon?: React.ReactNode;
    expandedToggleIcon?: React.ReactNode;
  }>;
  images?: string[];
  experienceValue?: string;
  experienceLabel?: string;
}

export const BenefitsAdvantageDynamic: React.FC<BenefitsAdvantageDynamicProps> = ({
  badgeText,
  badgeIcon,
  title,
  description,
  items,
  images,
  experienceValue,
  experienceLabel,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(items?.[0]?.id || null);

  const image1 = images?.[0];
  const image2 = images?.[1];

  if (!badgeText && !title && !description && (!items || items.length === 0) && !image1 && !image2) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          {(badgeText || badgeIcon) && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              {badgeIcon && <span className="text-slate-600">{badgeIcon}</span>}
              {badgeText && <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">{badgeText}</span>}
            </div>
          )}

          {/* Title & Description */}
          <div className="space-y-4">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {items?.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  expandedId === item.id 
                    ? 'bg-slate-50 border-slate-200 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    {item.icon && (
                      <div className={`p-2.5 rounded-xl transition-colors ${
                        expandedId === item.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.icon}
                      </div>
                    )}
                    {item.title && (
                      <span className="text-lg font-semibold text-slate-800">
                        {item.title}
                      </span>
                    )}
                  </div>
                  <div className={`p-1.5 rounded-full transition-all duration-300 ${
                    expandedId === item.id ? 'bg-lime-400 text-slate-900' : 'bg-lime-100 text-lime-600'
                  }`}>
                    {expandedId === item.id ? (item.expandedToggleIcon || item.toggleIcon) : item.toggleIcon}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedId === item.id && item.description && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 ml-14">
                        <p className="text-slate-500 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Right Images */}
        <div className="relative flex gap-6 h-full min-h-[500px] lg:min-h-[600px]">
          {/* Main Tall Image */}
          {image1 && (
            <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={image1}
                alt="Benefit visual 1"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Secondary Smaller Image */}
          <div className="flex-1 flex flex-col gap-6">
            {image2 && (
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5]">
                <img
                  src={image2}
                  alt="Benefit visual 2"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Experience Badge */}
            {(experienceValue || experienceLabel) && (
              <div className="mt-auto p-6 bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center self-end w-full max-w-[180px]">
                {experienceValue && (
                  <span className="text-4xl font-bold text-teal-600 leading-none">
                    {experienceValue}
                  </span>
                )}
                {experienceLabel && (
                  <span className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">
                    {experienceLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsAdvantageDynamic;
