import React from 'react';

export interface MissionNewDynamicProps {
  badge?: string;
  title?: string;
  description?: string;
  items?: Array<{
    id: string | number;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
  imageUrl?: string;
  imageAlt?: string;
}

export function MissionNewDynamic({
  badge,
  title,
  description,
  items,
  imageUrl,
  imageAlt,
}: MissionNewDynamicProps) {
  const hasBadge = !!badge;
  const hasTitle = !!title;
  const hasDescription = !!description;
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasImage = !!imageUrl;

  if (!hasBadge && !hasTitle && !hasDescription && !hasItems && !hasImage) {
    return null;
  }

  // Clean SVG arrow with no text nodes, acts as a default design decoration from the mockup
  const defaultArrow = (
    <svg 
      width="10" 
      height="10" 
      viewBox="0 0 10 10" 
      fill="currentColor" 
      className="inline-block align-middle transition-transform duration-300"
    >
      <path d="M2,2 L8,5 L2,8 Z" />
    </svg>
  );

  return (
    <section 
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full py-16 px-4 md:py-24 md:px-8 bg-white text-neutral-900 flex justify-center"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="w-full max-w-6xl flex flex-col gap-12 md:gap-16">
        {/* Header Section */}
        {(hasBadge || hasTitle || hasDescription) && (
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
            {badge && (
              <span 
                style={{ fontWeight: 300 }}
                className="text-xs uppercase tracking-widest text-[#a3a3a3]"
              >
                {badge}
              </span>
            )}
            
            {title && (
              <h2 
                style={{ fontWeight: 500 }}
                className="text-3xl md:text-5xl leading-tight text-[#171717]"
              >
                {title}
              </h2>
            )}
            
            {description && (
              <p 
                style={{ fontWeight: 300 }}
                className="text-lg md:text-xl text-[#6b6b6b] leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content Section */}
        {(hasItems || hasImage) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Items Column */}
            {hasItems && (
              <div className="flex flex-col divide-y divide-[#eeeeee] border-t border-b border-[#eeeeee]">
                {items.map((item, index) => {
                  const itemTitle = item.title;
                  const itemDesc = item.description;
                  const hasItemTitle = !!itemTitle;
                  const hasItemDesc = !!itemDesc;

                  if (!hasItemTitle && !hasItemDesc) return null;

                  return (
                    <div 
                      key={item.id || index}
                      className="py-6 flex flex-col gap-2 group transition-all duration-300 hover:pl-2"
                    >
                      {itemTitle && (
                        <div className="flex items-start gap-2.5">
                          <div className="mt-1 flex-shrink-0 text-black">
                            {item.icon ? (
                              item.icon
                            ) : (
                              defaultArrow
                            )}
                          </div>
                          
                          <h3 
                            style={{ fontWeight: 500 }}
                            className="text-lg md:text-xl text-[#171717] leading-snug"
                          >
                            {itemTitle}
                          </h3>
                        </div>
                      )}
                      
                      {itemDesc && (
                        <p 
                          style={{ fontWeight: 300 }}
                          className={`text-[#6b6b6b] leading-relaxed text-sm md:text-base ${itemTitle ? 'pl-6' : ''}`}
                        >
                          {itemDesc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Right Image Column */}
            {hasImage && (
              <div className="w-full flex justify-center">
                <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                  <img 
                    src={imageUrl} 
                    alt={imageAlt || ""} 
                    className="w-full h-auto object-cover block transition-transform duration-500 hover:scale-[1.02]" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default MissionNewDynamic;