"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TestimonialItem {
  name?: string;
  text?: string;
  avatar?: string;
}

export interface TestimonialsElegantDynamicProps {
  title?: string;
  testimonials?: TestimonialItem[];
  plusIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
}

export const TestimonialsElegantDynamic: React.FC<TestimonialsElegantDynamicProps> = ({
  title,
  testimonials,
  plusIcon,
  prevIcon,
  nextIcon,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Title */}
        {title && (
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-20 tracking-tight">
            {title}
          </h2>
        )}

        {/* Carousel Container */}
        <div className="relative w-full max-w-4xl">
          {/* Corner Plus Icons */}
          {plusIcon && (
            <>
              <div className="absolute -top-3 -left-3 z-10 text-gray-400">
                {plusIcon}
              </div>
              <div className="absolute -top-3 -right-3 z-10 text-gray-400">
                {plusIcon}
              </div>
              <div className="absolute -bottom-3 -left-3 z-10 text-gray-400">
                {plusIcon}
              </div>
              <div className="absolute -bottom-3 -right-3 z-10 text-gray-400">
                {plusIcon}
              </div>
            </>
          )}

          {/* Dashed Border Box */}
          <div className="border border-dashed border-gray-200 rounded-sm p-12 md:p-20 min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center text-center space-y-8"
              >
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  {currentTestimonial.avatar && (
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name || ""}
                      className="w-10 h-10 rounded-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {currentTestimonial.name && (
                    <span className="text-lg font-bold text-gray-900">
                      {currentTestimonial.name}
                    </span>
                  )}
                </div>

                {/* Testimonial Text */}
                {currentTestimonial.text && (
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                    {currentTestimonial.text}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-12 mt-12">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            {prevIcon}
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            aria-label="Next testimonial"
          >
            {nextIcon}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsElegantDynamic;
