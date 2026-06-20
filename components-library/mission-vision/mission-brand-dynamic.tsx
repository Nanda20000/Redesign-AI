import React from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MissionBrandDynamicItem {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface MissionBrandDynamicProps {
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: Array<MissionBrandDynamicItem>;
}

export function MissionBrandDynamic({
  title,
  imageUrl,
  imageAlt,
  items,
}: MissionBrandDynamicProps) {
  // Guard the entire render if everything is empty
  const hasItems = items && items.some((item) => item.title || item.description || item.icon);
  if (!title && !imageUrl && !hasItems) {
    return null;
  }

  return (
    <section
      id="mission-brand-dynamic-section"
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="w-full bg-[#f4f5f7] py-16 md:py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');`}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left column: Title */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          {title && (
            <h2
              style={{ fontWeight: 500 }}
              className="text-3xl md:text-4xl lg:text-5xl text-slate-700 tracking-tight leading-tight uppercase whitespace-pre-line"
            >
              {title}
            </h2>
          )}
        </div>

        {/* Center column: Slanted Graphic Banner */}
        <div className="lg:col-span-5 flex items-center justify-center">
          {imageUrl && (
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">
              {/* Thin grey line accent */}
              <div className="absolute left-[12%] sm:left-[18%] md:left-[22%] top-[12%] w-[1px] h-20 sm:h-28 md:h-36 bg-slate-300 opacity-60 transform -skew-x-[36deg]" />

              {/* Orange accent bar */}
              <div className="absolute left-[6%] sm:left-[10%] md:left-[14%] top-[28%] w-3 h-16 sm:h-24 md:h-28 bg-[#ec5a38] rounded-xs transform -skew-x-[36deg]" />

              {/* Slanted main image container */}
              <div className="absolute left-[18%] top-0 w-[64%] h-full overflow-hidden transform -skew-x-[36deg]">
                <img
                  src={imageUrl}
                  alt={imageAlt || ""}
                  className="w-full h-full object-cover transform skew-x-[36deg] scale-150"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Light grey thick accent bar */}
              <div className="absolute right-[6%] sm:right-[10%] md:right-[14%] bottom-[12%] w-5 h-12 sm:h-18 md:h-24 bg-[#d0d3d9] rounded-xs transform -skew-x-[36deg]" />
            </div>
          )}
        </div>

        {/* Right column: Dynamic Items List */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          {items && items.length > 0 && (
            <div className="space-y-8 md:space-y-10">
              {items.map((item, idx) => {
                if (!item.title && !item.description && !item.icon) return null;

                return (
                  <div key={idx} className="flex items-start gap-4 md:gap-5">
                    {item.icon && (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center flex-shrink-0 shadow-2xs text-slate-500">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {item.title && (
                        <h4
                          style={{ fontWeight: 500 }}
                          className="text-base md:text-lg text-slate-700 tracking-wide mb-1"
                        >
                          {item.title}
                        </h4>
                      )}
                      {item.description && (
                        <p
                          style={{ fontWeight: 300 }}
                          className="text-sm md:text-base text-slate-500 leading-relaxed break-words"
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
        </div>
      </div>
    </section>
  );
}

export default MissionBrandDynamic;
