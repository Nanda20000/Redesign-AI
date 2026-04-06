import React from 'react';
import { motion } from 'motion/react';

interface AboutBrandDynamicProps {
  badge?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
}

export const AboutBrandDynamic: React.FC<AboutBrandDynamicProps> = ({
  badge,
  title,
  description,
  image,
  imageAlt,
  ctaText,
  ctaLink,
  items,
}) => {
  // If no content is provided, render nothing
  if (!badge && !title && !description && !image && !ctaText && (!items || items.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
              <div className="relative z-10 aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={image}
                  alt={imageAlt || ""}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative Background Elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-50 rounded-full -z-10" />
              <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-24 h-48 border-l-2 border-y-2 border-blue-200 rounded-l-full -z-10 opacity-50" />
            </motion.div>
          )}

          {/* Content Column */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              {badge && (
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100"
                >
                  {badge}
                </motion.span>
              )}

              {title && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight"
                >
                  {title}
                </motion.h2>
              )}

              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl"
                >
                  {description}
                </motion.p>
              )}
            </div>

            {items && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col space-y-3"
                  >
                    {item.icon && (
                      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-blue-600 shadow-sm border border-gray-100">
                        {item.icon}
                      </div>
                    )}
                    <div className="space-y-1">
                      {item.title && (
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-gray-500 leading-snug">{item.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <a
                  href={ctaLink || "#"}
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-blue-200 hover:-translate-y-1 focus:ring-4 focus:ring-blue-100"
                >
                  {ctaText}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrandDynamic;
