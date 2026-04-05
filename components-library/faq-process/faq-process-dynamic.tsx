'use client';

import React, { useState } from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FaqItem {
  question?: string;
  answer?: string;
}

export interface ProcessStep {
  stepNumber?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface FaqProcessDynamicProps {
  title?: string;
  subtitle?: string;
  type?: 'faq' | 'process';
  faqItems?: FaqItem[];
  processSteps?: ProcessStep[];
}

export function FaqProcessDynamic({
  title,
  subtitle,
  type = 'faq',
  faqItems,
  processSteps,
}: FaqProcessDynamicProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const isFaq = type === 'faq';
  const hasContent = isFaq ? (faqItems && faqItems.length > 0) : (processSteps && processSteps.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            {title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* FAQ Accordion */}
        {isFaq && faqItems && (
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg md:text-xl font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Steps */}
        {!isFaq && processSteps && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600" />
                )}
                
                {/* Step Card */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center border border-gray-100 group-hover:border-blue-200">
                  {/* Step Number */}
                  {step.stepNumber && (
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      {step.stepNumber}
                    </div>
                  )}
                  
                  {/* Title */}
                  {step.title && (
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                  )}
                  
                  {/* Description */}
                  {step.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FaqProcessDynamic;
