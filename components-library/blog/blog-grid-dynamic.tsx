import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface BlogItem {
  id?: string | number;
  image?: string;
  category?: string;
  readTime?: string;
  readTimeIcon?: React.ReactNode;
  title?: string;
  excerpt?: string;
  authorName?: string;
  authorAvatar?: string;
  date?: string;
}

interface PaginationItem {
  label?: string;
  isActive?: boolean;
  isEllipsis?: boolean;
}

export interface BlogGridDynamicProps {
  sectionTitle?: string;
  articleCount?: string | number;
  sortLabel?: string;
  sortIcon?: React.ReactNode;
  filterIcon?: React.ReactNode;
  items?: BlogItem[];
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  paginationItems?: PaginationItem[];
}

export const BlogGridDynamic: React.FC<BlogGridDynamicProps> = ({
  sectionTitle,
  articleCount,
  sortLabel,
  sortIcon,
  filterIcon,
  items,
  prevIcon,
  nextIcon,
  paginationItems,
}) => {
  return (
    <section className="w-full py-12 px-4 md:px-8 lg:px-12 bg-white font-open-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            {sectionTitle && (
              <h2 className="text-3xl font-bold text-[#3d475c] tracking-tight">
                {sectionTitle}
              </h2>
            )}
            {articleCount !== undefined && articleCount !== null && articleCount !== '' && (
              <span className="px-2.5 py-0.5 bg-[#eef0f4] text-[#7c8ba1] text-sm font-semibold rounded-full">
                {articleCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {sortLabel && (
              <div className="relative">
                <button className="flex items-center gap-8 px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-[#3d475c] font-medium hover:bg-gray-50 transition-colors">
                  <span>{sortLabel}</span>
                  {sortIcon && <span className="text-[#7c8ba1]">{sortIcon}</span>}
                </button>
              </div>
            )}
            {filterIcon && (
              <button className="p-2.5 bg-[#eff3ff] text-[#4f46e5] rounded-xl hover:bg-[#e0e7ff] transition-colors">
                {filterIcon}
              </button>
            )}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items?.map((item, index) => (
            <article
              key={item.id || index}
              className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f1f5f9] transition-transform hover:translate-y-[-4px]"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || ''}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                {item.category && (
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[#3d475c] text-xs font-bold rounded-lg shadow-sm">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3 text-[#94a3b8] text-xs font-medium">
                  {item.readTimeIcon && <span>{item.readTimeIcon}</span>}
                  {item.readTime && <span>{item.readTime}</span>}
                </div>

                {item.title && (
                  <h3 className="text-lg font-bold text-[#3d475c] mb-3 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                )}

                {item.excerpt && (
                  <p className="text-[#64748b] text-sm leading-relaxed mb-6 line-clamp-3">
                    {item.excerpt}
                  </p>
                )}

                {/* Author Footer */}
                <div className="mt-auto pt-4 flex items-center gap-3">
                  {item.authorAvatar && (
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName || ''}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="flex flex-col">
                    {item.authorName && (
                      <span className="text-sm font-bold text-[#3d475c]">
                        {item.authorName}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-xs text-[#94a3b8]">
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Section */}
        {(paginationItems || prevIcon || nextIcon) && (
          <div className="mt-16 flex items-center justify-center gap-2">
            {prevIcon && (
              <button className="p-2 text-[#6366f1] hover:bg-[#eff3ff] rounded-lg transition-colors">
                {prevIcon}
              </button>
            )}
            
            <div className="flex items-center gap-1">
              {paginationItems?.map((page, idx) => (
                <React.Fragment key={idx}>
                  {page.isEllipsis ? (
                    <span className="px-3 py-2 text-[#94a3b8]">...</span>
                  ) : (
                    <button
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                        page.isActive
                          ? 'bg-[#eff3ff] text-[#4f46e5]'
                          : 'text-[#64748b] hover:bg-gray-50'
                      }`}
                    >
                      {page.label}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {nextIcon && (
              <button className="p-2 text-[#6366f1] hover:bg-[#eff3ff] rounded-lg transition-colors">
                {nextIcon}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGridDynamic;
