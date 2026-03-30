'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Props = {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
  };
  images?: string[];
};

export const HeroSlide: React.FC<Props> = ({ content, images = [] }) => {
  const { title, subtitle, description, buttonText } = content;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1600585154340-be6199f7a009?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1600607687940-4e524cb35d5a?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1920'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideImages.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slideImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="relative w-full overflow-hidden">
        {/* Carousel Track */}
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {slideImages.map((img, idx) => (
            <div key={idx} className="min-w-full px-2 md:px-4">
              <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-lg bg-zinc-900 shadow-2xl">
                <img
                  src={img}
                  alt={`${title} slide ${idx}`}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                {/* Text Content (Right Aligned) - Only show on active slide for clarity or keep on all */}
                <div className="absolute top-1/2 right-8 md:right-20 -translate-y-1/2 text-right max-w-md md:max-w-2xl">
                  {title && (
                    <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight mb-4 leading-[0.9]">
                      {title}
                    </h1>
                  )}
                  {(subtitle || description) && (
                    <p className="text-base md:text-xl text-zinc-100 font-light opacity-80 tracking-wide">
                      {subtitle || description}
                    </p>
                  )}
                </div>

                {/* CTA Button (Bottom Left) */}
                {buttonText && (
                  <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16">
                    <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm md:text-base hover:bg-zinc-100 transition-all duration-300 shadow-2xl active:scale-95 group/btn border border-white/20">
                      {buttonText}
                      <div className="bg-black text-white rounded-full p-1 transition-transform duration-300 group-hover/btn:rotate-45">
                        <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-8 flex items-center z-10">
          <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 shadow-xl">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-8 flex items-center z-10">
          <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 shadow-xl">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Carousel Indicators (Outside the hero section) */}
      <div className="flex items-center justify-center gap-3">
        {slideImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-12 bg-zinc-900' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
