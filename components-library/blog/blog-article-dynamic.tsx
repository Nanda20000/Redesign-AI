import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogPostItem {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  date?: string;
  category?: string;
  dateIcon?: React.ReactNode;
  style?: 'image' | 'content';
}

export interface BlogArticleDynamicProps {
  tagline?: string;
  heading?: string;
  posts?: BlogPostItem[];
}

export const BlogArticleDynamic: React.FC<BlogArticleDynamicProps> = ({
  tagline,
  heading,
  posts,
}) => {
  if (!tagline && !heading && (!posts || posts.length === 0)) return null;

  return (
    <section className="py-16 px-4 md:px-8 bg-white font-open-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          {tagline && (
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {tagline}
            </span>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {heading}
            </h2>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post, index) => {
            const isImageStyle = post.style === 'image';
            
            return (
              <div
                key={post.id || index}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                {isImageStyle ? (
                  /* Style 1: Image + Title */
                  <div className="space-y-6 flex flex-col h-full">
                    {post.image && (
                      <div className="aspect-[16/10] overflow-hidden rounded-xl">
                        <img
                          src={post.image}
                          alt={post.title || ''}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    {post.title && (
                      <h3 className="text-xl font-bold text-gray-900 leading-snug mt-auto">
                        {post.title}
                      </h3>
                    )}
                  </div>
                ) : (
                  /* Style 2: Meta + Title + Description */
                  <div className="space-y-6 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      {post.date && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          {post.dateIcon}
                          <span>{post.date}</span>
                        </div>
                      )}
                      {post.category && (
                        <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {post.title && (
                        <h3 className="text-xl font-bold text-gray-900 leading-snug">
                          {post.title}
                        </h3>
                      )}
                      {post.description && (
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogArticleDynamic;
