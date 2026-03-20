import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    secondaryButtonText?: string;
  };
  images?: string[];
  logos?: { name: string; icon?: React.ReactNode }[];
};

export default function HeroSection({ content, images = [], logos = [] }: Props) {
  const { title, subtitle, description, buttonText, secondaryButtonText } = content;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (images.length <= 3) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Helper to get image at index with wrapping
  const getImage = (offset: number) => {
    if (images.length === 0) return null;
    return images[(currentIndex + offset) % images.length];
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Logo Cloud */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-end gap-8 opacity-40 grayscale transition-all hover:grayscale-0">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              {logo.icon}
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="z-10 flex flex-col items-start space-y-8"
          >
            {subtitle && (
              <div className="inline-flex items-center rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-900">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-zinc-900" />
                {subtitle}
              </div>
            )}

            {title && (
              <h1 className="max-w-xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
                {title}
              </h1>
            )}

            {description && (
              <p className="max-w-md text-lg leading-relaxed text-zinc-500">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {secondaryButtonText && (
                <button className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-all hover:border-zinc-900 hover:bg-zinc-50 active:scale-95">
                  {secondaryButtonText}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
              {buttonText && (
                <button className="group flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-95">
                  {buttonText}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Right Image Gallery Carousel */}
          <div className="relative flex w-full items-center justify-center lg:justify-end">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Slot 1 */}
              <div className="relative h-[300px] w-[140px] overflow-hidden rounded-[2.5rem] bg-zinc-100 sm:h-[400px] sm:w-[180px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex + "0"}
                    src={getImage(0) || ""}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>

              {/* Slot 2 - Taller */}
              <div className="relative h-[350px] w-[160px] overflow-hidden rounded-[3rem] bg-zinc-100 sm:h-[500px] sm:w-[220px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex + "1"}
                    src={getImage(1) || ""}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>

              {/* Slot 3 */}
              <div className="hidden h-[280px] w-[130px] overflow-hidden rounded-[2.5rem] bg-zinc-100 sm:block sm:h-[380px] sm:w-[170px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex + "2"}
                    src={getImage(2) || ""}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute -bottom-16 right-0 flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 transition-all hover:border-zinc-900 hover:bg-zinc-50 active:scale-90"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 transition-all hover:border-zinc-900 hover:bg-zinc-50 active:scale-90"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute -bottom-16 left-0 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    i === currentIndex ? "w-4 bg-zinc-900" : "bg-zinc-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
