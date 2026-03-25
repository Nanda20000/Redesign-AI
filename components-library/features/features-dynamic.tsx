import React from 'react';

export interface FeatureItem {
  title: string;
  description: string;
  image?: string;
}

export interface FeaturesDynamicProps {
  title: string;
  description?: string;
  items: FeatureItem[];
}

export function FeaturesDynamic({
  title,
  description,
  items,
}: FeaturesDynamicProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Optional Image */}
              {item.image && (
                <div className="mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Title */}
              {item.title && (
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
              )}

              {/* Description */}
              {item.description && (
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesDynamic;
