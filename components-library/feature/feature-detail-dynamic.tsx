import React from 'react';
import { motion } from 'motion/react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FeatureItem {
  title?: string;
  description?: string;
  image?: string;
  linkText?: string;
  linkUrl?: string;
  isHighlighted?: boolean;
}

export interface FeatureDetailDynamicProps {
  heading?: string;
  items?: FeatureItem[];
  loadMoreText?: string;
  loadMoreUrl?: string;
  arrowIcon?: React.ReactNode;
}

export const FeatureDetailDynamic: React.FC<FeatureDetailDynamicProps> = ({
  heading,
  items,
  loadMoreText,
  loadMoreUrl,
  arrowIcon,
}) => {
  if (!heading && (!items || items.length === 0)) return null;

  return (
    <section className="py-20 px-6 md:px-12 bg-white font-['Open_Sans',_sans-serif]">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght @400;600;700&display=swap');
      ` }} />
      
      <div className="max-w-7xl mx-auto">
        {heading && (
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900 max-w-3xl mx-auto leading-[1.1] tracking-tight"
          >
            {heading}
          </motion.h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items?.map((item, index) => {
            // Pattern from screenshot: middle column (indices 1, 4, 7...) has text on top
            const isMiddleColumn = index % 3 === 1;
            const isHighlighted = item.isHighlighted;

            const cardClasses = `
              rounded-[2rem] overflow-hidden flex flex-col h-full transition-all duration-300
              ${isHighlighted 
                ? "bg-[#C1FF33] shadow-xl shadow-lime-200/20 scale-[1.02] z-10" 
                : "bg-[#F8F9FA] border border-slate-100 hover:shadow-lg hover:border-slate-200"
              }
            `.trim();

            const titleClasses = `
              text-2xl font-bold mb-4 tracking-tight
              ${isHighlighted ? "text-slate-900" : "text-slate-800"}
            `.trim();

            const descClasses = `
              text-[0.95rem] leading-relaxed mb-8
              ${isHighlighted ? "text-slate-700" : "text-slate-500"}
            `.trim();

            const linkClasses = `
              inline-flex items-center text-sm font-bold group transition-colors
              ${isHighlighted ? "text-slate-900 hover:opacity-70" : "text-slate-600 hover:text-slate-900"}
            `.trim();

            const imageContainerClasses = "p-5";
            const imageClasses = "w-full h-56 object-cover rounded-[1.5rem] grayscale hover:grayscale-0 transition-all duration-500";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className={cardClasses}
              >
                {isMiddleColumn ? (
                  <>
                    {/* Text Content Top */}
                    <div className="p-10 flex-grow flex flex-col">
                      {item.title && <h3 className={titleClasses}>{item.title}</h3>}
                      {item.description && <p className={descClasses}>{item.description}</p>}
                      <div className="mt-auto">
                        {item.linkText && (
                          <a href={item.linkUrl || '#'} className={linkClasses}>
                            {item.linkText}
                            {arrowIcon && (
                              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                                {arrowIcon}
                              </span>
                            )}
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Image Bottom */}
                    {item.image && (
                      <div className={imageContainerClasses}>
                        <img
                          src={item.image}
                          alt={item.title || ""}
                          className={imageClasses}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Image Top */}
                    {item.image && (
                      <div className={imageContainerClasses}>
                        <img
                          src={item.image}
                          alt={item.title || ""}
                          className={imageClasses}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    {/* Text Content Bottom */}
                    <div className="p-10 pt-5 flex-grow flex flex-col">
                      {item.title && <h3 className={titleClasses}>{item.title}</h3>}
                      {item.description && <p className={descClasses}>{item.description}</p>}
                      <div className="mt-auto">
                        {item.linkText && (
                          <a href={item.linkUrl || '#'} className={linkClasses}>
                            {item.linkText}
                            {arrowIcon && (
                              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                                {arrowIcon}
                              </span>
                            )}
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {loadMoreText && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 flex justify-center"
          >
            <a
              href={loadMoreUrl || '#'}
              className="bg-[#1A3A2A] text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95"
            >
              {loadMoreText}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeatureDetailDynamic;
