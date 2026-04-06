import React from 'react';
import { motion } from 'motion/react';

interface BlogPost {
  id: string | number;
  image?: string;
  category?: string;
  title?: string;
  ctaText?: string;
  ctaIcon?: React.ReactNode;
}

interface BlogFeedDynamicProps {
  title?: string;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  posts?: BlogPost[];
}

/**
 * BlogFeedDynamic - A clean, minimalist blog feed section with a header and post grid.
 * Features a large light-weight heading, navigation buttons, and responsive post cards.
 */
export const BlogFeedDynamic: React.FC<BlogFeedDynamicProps> = ({
  title,
  prevIcon,
  nextIcon,
  posts,
}) => {
  if (!title && !posts?.length) return null;

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto font-open-sans bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        {title && (
          <h2 className="text-5xl md:text-7xl font-light text-gray-900 leading-[1.05] max-w-md tracking-tight whitespace-pre-line">
            {title}
          </h2>
        )}
        
        {(prevIcon || nextIcon) && (
          <div className="flex gap-2 shrink-0">
            {prevIcon && (
              <button 
                className="w-14 h-14 border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all duration-300 active:scale-95"
                aria-label="Previous"
              >
                {prevIcon}
              </button>
            )}
            {nextIcon && (
              <button 
                className="w-14 h-14 bg-[#222222] flex items-center justify-center text-white hover:bg-black transition-all duration-300 active:scale-95"
                aria-label="Next"
              >
                {nextIcon}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {posts?.map((post, index) => (
          <motion.div
            key={post.id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="group flex flex-col h-full"
          >
            {/* Image Container */}
            {post.image && (
              <div className="aspect-[4/3] overflow-hidden mb-8 bg-gray-50 relative">
                <img
                  src={post.image}
                  alt={post.title || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
            )}
            
            {/* Content Container */}
            <div className="flex flex-col flex-grow">
              {post.category && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 font-bold">
                  {post.category}
                </span>
              )}
              
              {post.title && (
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-[1.4] line-clamp-2 group-hover:text-gray-600 transition-colors duration-300">
                  {post.title}
                </h3>
              )}
              
              {/* CTA Link */}
              <div className="mt-auto flex items-center gap-2 text-xs font-bold text-gray-900 group-hover:gap-3 transition-all duration-300 border-b border-transparent group-hover:border-gray-900 w-fit pb-1">
                {post.ctaText && <span>{post.ctaText}</span>}
                {post.ctaIcon && <span className="flex items-center justify-center">{post.ctaIcon}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BlogFeedDynamic;
