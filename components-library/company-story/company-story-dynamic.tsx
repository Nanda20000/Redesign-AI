import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Milestone {
  year?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface CompanyStoryDynamicProps {
  title?: string;
  subtitle?: string;
  intro?: string;
  milestones?: Milestone[];
}

export function CompanyStoryDynamic({
  title,
  subtitle,
  intro,
  milestones,
}: CompanyStoryDynamicProps) {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        {(title || subtitle || intro) && (
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            {title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-6">
                {subtitle}
              </p>
            )}
            {intro && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {intro}
              </p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />

          {/* Milestones */}
          <div className="space-y-8 md:space-y-12">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex items-start gap-4 md:gap-8 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 mt-1.5 md:mt-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-4 border-white shadow-lg z-10" />

                  {/* Content */}
                  <div className={`flex-1 ml-8 md:ml-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                      {milestone.image && (
                        <div className="relative h-48 md:h-56 overflow-hidden">
                          <img
                            src={milestone.image}
                            alt={milestone.title || `Milestone ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {milestone.year && (
                          <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                            {milestone.year}
                          </span>
                        )}
                        {milestone.title && (
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                            {milestone.title}
                          </h3>
                        )}
                        {milestone.description && (
                          <p className={`text-gray-600 leading-relaxed ${isEven ? 'md:ml-auto' : ''} max-w-lg`}>
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyStoryDynamic;
