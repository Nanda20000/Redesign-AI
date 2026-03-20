import React from 'react';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

type Props = {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
  };
  images?: string[];
  features?: string[];
};

export const HeroSection: React.FC<Props> = ({ 
  content, 
  images = [], 
  features = ["Design Subscription Monthly", "Rapid Delivery", "Flexible Subscription"] 
}) => {
  return (
    <section className="w-full bg-white text-black font-sans selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Features Row */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-x-10 gap-y-4 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="max-w-4xl">
          {content.title && (
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
              {content.title}
            </h1>
          )}
          
          {(content.subtitle || content.description) && (
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
              {content.subtitle || content.description}
            </p>
          )}

          {content.buttonText && (
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 border-2 border-black rounded-full font-semibold transition-all duration-300 hover:bg-black hover:text-white active:scale-95">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span>{content.buttonText}</span>
            </button>
          )}
        </div>

        {/* Portfolio Carousel */}
        {images && images.length > 0 && (
          <div className="mt-24 overflow-hidden -mx-6">
            <motion.div 
              className="flex gap-8 px-6 w-max"
              animate={{
                x: [0, "-50%"],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Duplicate images for infinite scroll */}
              {[...images, ...images, ...images].map((image, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[300px] md:w-[450px] group relative bg-[#F5F5F5] rounded-3xl aspect-[4/3] overflow-hidden flex items-center justify-center p-8 md:p-12 transition-transform duration-500 hover:-translate-y-2"
                >
                  <img 
                    src={image} 
                    alt={`Portfolio item ${index + 1}`}
                    className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};
