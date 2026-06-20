import React from 'react';

export interface MissionEnhancedDynamicProps {
  title?: string;
  description?: string;
  items?: Array<{
    id: string | number;
    icon?: React.ReactNode;
    text?: string;
    label?: string;
    isFeatured?: boolean;
  }>;
}

export function MissionEnhancedDynamic({
  title,
  description,
  items,
}: MissionEnhancedDynamicProps) {
  // If no props are populated, render nothing.
  if (!title && !description && (!items || items.length === 0)) {
    return null;
  }

  return (
    <section 
      id="mission-enhanced-section"
      className="w-full bg-white py-16 px-6 md:py-24 md:px-12 flex items-center justify-center transition-all"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div id="mission-enhanced-container" className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (Content) */}
        <div id="mission-enhanced-left" className="lg:col-span-5 flex flex-col justify-start space-y-6">
          {title && (
            <h2 
              id="mission-enhanced-title"
              className="text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-neutral-950 tracking-tight leading-[1.05]"
              style={{ fontWeight: 500 }}
            >
              {title.split(' ').map((word, idx) => (
                <span key={idx} className="block">
                  {word}
                </span>
              ))}
            </h2>
          )}
          {description && (
            <p 
              id="mission-enhanced-description"
              className="text-lg md:text-xl text-neutral-500 leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Right Column (Grid of Cards) */}
        {items && items.length > 0 && (
          <div id="mission-enhanced-grid" className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {items.map((item, idx) => {
              if (!item.icon && !item.text && !item.label) return null;
              
              const isFeat = !!item.isFeatured;
              return (
                <div 
                  key={item.id || idx}
                  id={`mission-card-${item.id || idx}`}
                  className={`flex flex-col justify-between p-8 md:p-10 rounded-[2rem] aspect-square min-h-[300px] w-full transition-transform duration-300 hover:scale-[1.02] ${
                    isFeat 
                      ? 'bg-[#FF4500] text-white shadow-lg shadow-orange-600/10' 
                      : 'bg-[#F2F2F4] text-neutral-950'
                  }`}
                >
                  {/* Top: Icon container */}
                  <div className="flex items-start justify-start">
                    {item.icon && (
                      <div 
                        className={`p-3 rounded-2xl flex items-center justify-center ${
                          isFeat ? 'bg-white/10 text-white' : 'bg-white/70 text-neutral-900 border border-neutral-200/50 shadow-sm'
                        }`}
                      >
                        {item.icon}
                      </div>
                    )}
                  </div>

                  {/* Bottom Details group */}
                  <div className="flex flex-col w-full mt-6">
                    {item.text && (
                      <p 
                        className={`text-base md:text-lg leading-relaxed ${
                          isFeat ? 'text-white/95' : 'text-neutral-700'
                        }`}
                        style={{ fontWeight: 300 }}
                      >
                        {item.text}
                      </p>
                    )}
                    
                    {/* Divider line */}
                    {(item.text || item.label) && (
                      <div 
                        className={`h-[1px] w-full my-4 ${
                          isFeat ? 'bg-white/20' : 'bg-[#FF4500]/20'
                        }`}
                      />
                    )}

                    {item.label && (
                      <span 
                        className={`text-sm tracking-wide uppercase ${
                          isFeat ? 'text-white' : 'text-neutral-900'
                        }`}
                        style={{ fontWeight: 300 }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MissionEnhancedDynamic;
