import React from 'react';
import { motion } from 'motion/react';

export interface BlogPost {
  image?: string;
  title?: string;
  author?: string;
  date?: string;
  summary?: string;
  readMoreText?: string;
}

export interface BlogElegantDynamicProps {
  tagline?: string;
  title?: string;
  description?: string;
  posts?: BlogPost[];
  readMoreIcon?: React.ReactNode;
}

export const BlogElegantDynamic = ({
  tagline,
  title,
  description,
  posts,
  readMoreIcon,
}: BlogElegantDynamicProps) => {
  if (!tagline && !title && !description && (!posts || posts.length === 0)) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {tagline && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-100 rounded-full"
            >
              {tagline}
            </motion.span>
          )}
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Posts Grid */}
        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Image Container */}
                {post.image && (
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title || ''}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col flex-grow p-8">
                  {post.title && (
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                      {post.title}
                    </h3>
                  )}

                  {(post.author || post.date) && (
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-6">
                      {post.author && <span>{post.author}</span>}
                      {post.author && post.date && <span className="mx-1"></span>}
                      {post.date && <span>{post.date}</span>}
                    </div>
                  )}

                  {post.summary && (
                    <p className="text-gray-500 mb-8 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  )}

                  <div className="mt-auto">
                    {post.readMoreText && (
                      <button className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group">
                        {post.readMoreText}
                        {readMoreIcon && (
                          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                            {readMoreIcon}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogElegantDynamic;
