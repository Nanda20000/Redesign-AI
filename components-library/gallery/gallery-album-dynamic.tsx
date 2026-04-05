import React from 'react';
import { motion } from 'motion/react';

interface GalleryImage {
  url: string;
  alt: string;
}

interface GalleryAlbumDynamicProps {
  title?: string;
  images?: GalleryImage[];
}

export const GalleryAlbumDynamic: React.FC<GalleryAlbumDynamicProps> = ({
  title,
  images = [],
}) => {
  if (!title && (!images || images.length === 0)) return null;

  const renderImage = (image?: GalleryImage, className?: string) => {
    if (!image?.url) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`overflow-hidden bg-gray-100 ${className}`}
      >
        <img
          src={image.url}
          alt={image.alt || ''}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    );
  };

  return (
    <section className="py-16 px-4 bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="h-px bg-gray-200 flex-1 max-w-[100px]" />
            <h2 className="text-2xl md:text-3xl font-light text-gray-500 tracking-widest uppercase">
              {title}
            </h2>
            <div className="h-px bg-gray-200 flex-1 max-w-[100px]" />
          </div>
        )}

        <div className="space-y-4">
          {/* Top Row: 2 Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderImage(images[0], "aspect-[4/3]")}
            {renderImage(images[1], "aspect-[4/3]")}
          </div>

          {/* Middle Row: 1 Large + 2 Small Stacked */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              {renderImage(images[2], "aspect-square md:aspect-[4/3] h-full")}
            </div>
            <div className="flex flex-col gap-4">
              {renderImage(images[3], "aspect-square md:aspect-[4/3] flex-1")}
              {renderImage(images[4], "aspect-square md:aspect-[4/3] flex-1")}
            </div>
          </div>

          {/* Bottom Row: 2 Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderImage(images[5], "aspect-[4/3]")}
            {renderImage(images[6], "aspect-[4/3]")}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryAlbumDynamic;
