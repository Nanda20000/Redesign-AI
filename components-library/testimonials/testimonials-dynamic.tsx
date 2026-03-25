import React from 'react';

export interface TestimonialItem {
  name?: string;
  role?: string;
  text: string;
  image?: string;
}

export interface TestimonialsDynamicProps {
  title: string;
  description?: string;
  testimonials: TestimonialItem[];
}

export function TestimonialsDynamic({
  title,
  description,
  testimonials,
}: TestimonialsDynamicProps) {
  if (!testimonials || testimonials.length === 0) {
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Optional Image */}
              {testimonial.image && (
                <div className="mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name || 'Testimonial author'}
                    className="w-16 h-16 rounded-full object-cover mx-auto"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Testimonial Text */}
              {testimonial.text && (
                <blockquote className="mb-4">
                  <p className="text-gray-700 italic leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </blockquote>
              )}

              {/* Name and Role - only show if name exists */}
              {testimonial.name && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsDynamic;
