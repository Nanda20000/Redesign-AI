import React from 'react';
import { motion } from 'motion/react';

interface GalleryItem {
  image?: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface GalleryElegantDynamicProps {
  label?: string;
  heading?: string;
  subheading?: string;
  items?: GalleryItem[];
}

export const GalleryElegantDynamic = ({
  label,
  heading,
  subheading,
  items,
}: GalleryElegantDynamicProps) => {
  if (!label && !heading && !subheading && (!items || items.length === 0)) {
    return null;
  }

  // Define grid span logic based on index to mimic the "bento" layout in the screenshot
  // Item 0: Square
  // Item 1: Square
  // Item 2: Tall (span 2 rows)
  // Item 3: Square/Wide
  // Item 4: Square
  const getGridClasses = (index: number) => {
    switch (index) {
      case 2:
        return 'md:row-span-2 md:col-start-3';
      default:
        return '';
    }
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          {label && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 text-[10px] font-medium tracking-widest uppercase text-gray-500 bg-gray-100 rounded-full"
            >
              {label}
            </motion.span>
          )}
          {heading && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900"
            >
              {heading}
            </motion.h2>
          )}
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed"
            >
              {subheading}
            </motion.p>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {items?.map((item, index) => {
            if (!item.image) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl bg-gray-100 ${getGridClasses(index)}`}
              >
                <img
                  src={item.image}
                  alt={item.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay with Title/Description if provided */}
                {(item.title || item.description) && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                    {item.title && (
                      <h3 className="text-xl font-semibold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-200 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GalleryElegantDynamic;
