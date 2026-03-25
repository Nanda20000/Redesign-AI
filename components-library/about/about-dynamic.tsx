import React from 'react';

export interface StatItem {
  label: string;
  value: string;
}

export interface AboutDynamicProps {
  title: string;
  description: string;
  stats?: StatItem[];
  companies?: string[];
  image?: string;
}

export function AboutDynamic({
  title,
  description,
  stats,
  companies,
  image,
}: AboutDynamicProps) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT COLUMN: Text Content */}
          <div>
            {/* Title */}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {description}
              </p>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Companies */}
            {companies && companies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Trusted by
                </h3>
                <div className="flex flex-wrap gap-3">
                  {companies.map((company, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white rounded-md text-gray-700 text-sm font-medium shadow-sm"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Image */}
          {image && (
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutDynamic;
