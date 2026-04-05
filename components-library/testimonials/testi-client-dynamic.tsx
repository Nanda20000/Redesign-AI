import React from 'react';
import { motion } from 'motion/react';

/**
 * TestimonialItem defines the structure for individual testimonial cards.
 */
export interface TestimonialItem {
  /** The testimonial text/quote */
  quote?: string;
  /** Name of the person giving the testimonial */
  authorName?: string;
  /** Role or location of the person */
  authorRole?: string;
  /** URL to the author's avatar image */
  authorImage?: string;
  /** Tailwind background color class (e.g., 'bg-red-200' or 'bg-[#ffadad]') */
  bgColor?: string;
}

/**
 * Props for the TestiClientDynamic component.
 */
export interface TestiClientDynamicProps {
  /** Main section heading */
  heading?: string;
  /** Supporting subtext below the heading */
  subtext?: string;
  /** Array of testimonial objects */
  testimonials?: TestimonialItem[];
}

/**
 * TestiClientDynamic - A testimonials section with a staggered grid of colorful cards.
 * Designed with Open Sans typography and smooth entrance animations.
 */
export const TestiClientDynamic: React.FC<TestiClientDynamicProps> = ({
  heading,
  subtext,
  testimonials,
}) => {
  // If no content is provided, render nothing
  if (!heading && !subtext && (!testimonials || testimonials.length === 0)) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-white font-open-sans overflow-hidden">
      {/* Injecting Open Sans font */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght @0,400;0,600;0,700;1,400&display=swap');
        .font-open-sans { font-family: 'Open Sans', sans-serif; }
      ` }} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {heading && (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
            >
              {heading}
            </motion.h2>
          )}
          {subtext && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              {subtext}
            </motion.p>
          )}
        </div>

        {/* Testimonials Grid/Flex Container */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {testimonials?.map((item, index) => {
            // Skip rendering if the item is empty
            if (!item.quote && !item.authorName && !item.authorImage) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className={`
                  p-8 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between
                  w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]
                  min-h-[280px] transition-transform hover:scale-[1.02]
                  ${item.bgColor || 'bg-gray-50'}
                `}
              >
                <div className="mb-8">
                  {item.quote && (
                    <p className="text-gray-800 text-lg md:text-xl font-normal italic leading-snug">
                      "{item.quote}"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-auto">
                  {item.authorImage && (
                    <div className="relative w-14 h-14 shrink-0">
                      <img 
                        src={item.authorImage} 
                        alt={item.authorName || 'Testimonial Author'} 
                        className="w-full h-full rounded-full object-cover border-2 border-white/40 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    {item.authorName && (
                      <h4 className="font-bold text-gray-900 text-lg truncate">
                        {item.authorName}
                      </h4>
                    )}
                    {item.authorRole && (
                      <p className="text-gray-600 text-sm font-medium truncate">
                        {item.authorRole}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestiClientDynamic;
