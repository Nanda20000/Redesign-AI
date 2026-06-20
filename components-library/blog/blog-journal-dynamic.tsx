import React from 'react';

export interface BlogItem {
  id?: string | number;
  image?: string;
  date?: string;
  category?: string;
  title?: string;
  description?: string;
}

export interface BlogJournalDynamicProps {
  subtitle?: string;
  title?: string;
  items?: BlogItem[];
  calendarIcon?: React.ReactNode;
}

export function BlogJournalDynamic({
  subtitle,
  title,
  items,
  calendarIcon,
}: BlogJournalDynamicProps) {
  // If no content is passed at all, we render nothing
  if (!subtitle && !title && (!items || items.length === 0)) {
    return null;
  }

  return (
    <section 
      id="blog-journal-dynamic-section" 
      className="py-16 px-4 md:px-8 bg-white max-w-7xl mx-auto w-full" 
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      {/* Header section */}
      {(subtitle || title) && (
        <div id="blog-header" className="text-center mb-12 flex flex-col items-center">
          {subtitle && (
            <span 
              id="blog-subtitle" 
              className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-3 block" 
              style={{ fontWeight: 300 }}
            >
              {subtitle}
            </span>
          )}
          {title && (
            <h2 
              id="blog-title" 
              className="text-2xl md:text-3xl text-[#111827] tracking-tight max-w-2xl leading-normal" 
              style={{ fontWeight: 500 }}
            >
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Grid section */}
      {items && items.length > 0 && (
        <div id="blog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const hasImage = !!item.image;
            const hasMeta = !!item.date || !!item.category;
            const hasTitle = !!item.title;
            const hasDesc = !!item.description;

            // Render nothing if item is completely empty
            if (!hasImage && !hasMeta && !hasTitle && !hasDesc) {
              return null;
            }

            return (
              <div 
                id={`blog-card-${item.id || index}`}
                key={item.id || index}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between transition-shadow duration-300 hover:shadow-xs h-full"
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="w-full">
                    {/* Image section */}
                    {hasImage && (
                      <div id={`blog-image-wrapper-${item.id || index}`} className="aspect-[1.58] w-full rounded-xl overflow-hidden mb-5 bg-[#F9FAFB]">
                        <img 
                          id={`blog-image-${item.id || index}`}
                          src={item.image} 
                          alt={item.title || "Blog post image"} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Metadata Section - Date and Category tag */}
                    {hasMeta && (
                      <div id={`blog-meta-${item.id || index}`} className="flex items-center justify-between mb-4 min-h-[24px]">
                        {item.date ? (
                          <div id={`blog-date-wrapper-${item.id || index}`} className="flex items-center gap-1.5 text-[#9CA3AF] text-xs">
                            {calendarIcon && (
                              <span id={`blog-calendar-icon-${item.id || index}`} className="inline-flex items-center justify-center text-[#9CA3AF]">
                                {calendarIcon}
                              </span>
                            )}
                            <span id={`blog-date-${item.id || index}`} style={{ fontWeight: 300 }}>{item.date}</span>
                          </div>
                        ) : (
                          <div />
                        )}
                        {item.category && (
                          <span 
                            id={`blog-category-${item.id || index}`}
                            className="px-3 py-1 rounded-full text-xs font-normal border border-[#E0E7FF] bg-[#EEF2F6] text-[#4F46E5]" 
                            style={{ fontWeight: 300 }}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    {hasTitle && (
                      <h3 
                        id={`blog-card-title-${item.id || index}`}
                        className="text-base md:text-lg text-[#111827] leading-snug mb-3 tracking-normal" 
                        style={{ fontWeight: 500 }}
                      >
                        {item.title}
                      </h3>
                    )}
                  </div>

                  {/* Description */}
                  {hasDesc && (
                    <p 
                      id={`blog-card-description-${item.id || index}`}
                      className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed mt-1" 
                      style={{ fontWeight: 300 }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BlogJournalDynamic;
