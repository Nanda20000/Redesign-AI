import * as React from 'react';

/**
 * StoryEventItem represents each metric/achievement card displayed at the bottom.
 */
export interface StoryEventItem {
  id?: string | number;
  value?: string;
  label?: string;
  isFeatured?: boolean;
}

/**
 * Props for the StoryEventDynamic component.
 */
export interface StoryEventDynamicProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  items?: StoryEventItem[];
  onButtonClick?: () => void;
}

export function StoryEventDynamic({
  title,
  description,
  buttonText,
  buttonIcon,
  imageUrl,
  imageAlt,
  items,
  onButtonClick,
}: StoryEventDynamicProps) {
  // If no content props are passed, render null to satisfy safety and empty rules
  if (!title && !description && !buttonText && !imageUrl && (!items || items.length === 0)) {
    return null;
  }

  return (
    <section 
      id="story-event-dynamic-section" 
      className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden relative"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
        {/* Upper Grid Layout: Content & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Story Content Block */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {title ? (
              <h2 
                style={{ fontWeight: 500 }} 
                className="text-4xl lg:text-5xl text-[#0d3b3c] tracking-tight leading-tight"
              >
                {title}
              </h2>
            ) : null}
            
            {title ? (
              <div className="h-1 w-20 bg-[#e7b83d] mt-3 mb-6" />
            ) : null}
            
            {description ? (
              <p 
                style={{ fontWeight: 300 }} 
                className="text-slate-600 text-lg leading-relaxed mb-8"
              >
                {description}
              </p>
            ) : null}
            
            {buttonText ? (
              <button 
                onClick={onButtonClick}
                style={{ fontWeight: 300 }}
                className="inline-flex items-center gap-3 bg-[#0d3b3c] hover:bg-[#072425] text-white px-6 py-3.5 rounded shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-base uppercase tracking-wider"
              >
                <span style={{ fontWeight: 300 }}>{buttonText}</span>
                {buttonIcon ? (
                  <span style={{ fontWeight: 300 }} className="flex items-center justify-center">
                    {buttonIcon}
                  </span>
                ) : null}
              </button>
            ) : null}
          </div>

          {/* Visual Image Block */}
          <div className="lg:col-span-5 w-full flex justify-center">
            {imageUrl ? (
              <div className="w-full max-w-lg lg:max-w-none relative rounded overflow-hidden shadow-md border border-slate-100">
                <img 
                  src={imageUrl} 
                  alt={imageAlt ?? ''} 
                  className="w-full h-auto object-cover aspect-video md:aspect-[4/3] lg:aspect-square"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : null}
          </div>
          
        </div>

        {/* Lower Achievement Metrics Section */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
            {items.map((item, index) => {
              // Skip empty counter cards to satisfy rendering safety rules
              if (!item.value && !item.label) return null;
              
              const isFeatured = item.isFeatured ?? (index === 0);
              
              return (
                <div 
                  key={item.id ?? index}
                  className={`bg-white border border-slate-100 shadow-sm p-8 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                    isFeatured 
                      ? 'border-b-4 border-b-[#0b4845] shadow-md' 
                      : ''
                  }`}
                >
                  {item.value ? (
                    <h3 
                      style={{ fontWeight: 500 }} 
                      className="text-5xl lg:text-6xl text-[#e7b83d] mb-3"
                    >
                      {item.value}
                    </h3>
                  ) : null}
                  
                  {item.label ? (
                    <span 
                      style={{ fontWeight: 300 }} 
                      className="block text-slate-500 text-sm tracking-wide uppercase"
                    >
                      {item.label}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        
      </div>
    </section>
  );
}

export default StoryEventDynamic;
