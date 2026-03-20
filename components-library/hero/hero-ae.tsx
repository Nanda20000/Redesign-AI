import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

type Props = {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    secondaryButtonText?: string;
  };
  images?: string[];
};

export const HeroSection: React.FC<Props> = ({ content, images }) => {
  const { title, subtitle, description, buttonText, secondaryButtonText } = content;
  const imageUrl = images?.[0] || 'https://picsum.photos/seed/tech/1200/800';

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center overflow-hidden bg-white px-6 py-12 md:px-12 lg:px-24">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col space-y-8 z-10"
        >
          {subtitle && (
            <span id="hero-subtitle" className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase leading-relaxed max-w-md">
              {subtitle}
            </span>
          )}
          
          {title && (
            <h1 id="hero-title" className="text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight">
              {title}
            </h1>
          )}
          
          {description && (
            <p id="hero-description" className="text-lg md:text-xl text-zinc-600 max-w-lg leading-relaxed">
              {description}
            </p>
          )}
          
          <div id="hero-actions" className="flex flex-wrap gap-4 pt-4">
            {buttonText && (
              <button 
                id="hero-primary-cta"
                className="group flex items-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95"
              >
                {buttonText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
            
            {secondaryButtonText && (
              <button 
                id="hero-secondary-cta"
                className="px-8 py-4 rounded-full font-medium text-zinc-900 bg-zinc-100 transition-all hover:bg-zinc-200 active:scale-95"
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </motion.div>

        {/* Right Image Column */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative h-[400px] md:h-[600px] lg:h-[700px] w-full"
        >
          <div 
            id="hero-image-container"
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{
              borderRadius: '300px 0 0 300px', // Large rounded left side as seen in screenshot
            }}
          >
            <img 
              id="hero-image"
              src={imageUrl} 
              alt={title || "Hero Image"} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Subtle overlay to match the dark aesthetic of the screenshot image if needed */}
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
