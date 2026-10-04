import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DesignImage } from '../data';

interface ImageGalleryProps {
  images: DesignImage[];
  designName: string;
}

export default function ImageGallery({ images, designName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Main Image */}
        <div className="relative img-zoom bg-cream aspect-[4/5] mb-4 cursor-pointer" onClick={() => setIsFullscreen(true)}>
          <img
            src={images[activeIndex]?.url}
            alt={images[activeIndex]?.alt || designName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            aria-label="View fullscreen"
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
          >
            <ZoomIn size={18} className="text-espresso" />
          </button>
          <div className="absolute bottom-4 left-4 bg-espresso/70 text-ivory text-xs px-2 py-1 rounded-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`w-20 h-24 overflow-hidden border-2 transition-all ${
                idx === activeIndex ? 'border-light-gold' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Layout - Swipeable */}
      <div className="lg:hidden">
        <div className="relative bg-cream aspect-[4/5] overflow-hidden" onClick={() => setIsFullscreen(true)}>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={images[activeIndex]?.url}
              alt={images[activeIndex]?.alt || designName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </AnimatePresence>
          <div className="absolute bottom-4 left-4 bg-espresso/70 text-ivory text-xs px-2 py-1 rounded-sm">
            {activeIndex + 1} / {images.length}
          </div>
          {/* Nav Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} className="text-espresso" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full"
                aria-label="Next image"
              >
                <ChevronRight size={18} className="text-espresso" />
              </button>
            </>
          )}
        </div>
        {/* Mobile Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex-shrink-0 w-14 h-18 overflow-hidden border-2 transition-all ${
                  idx === activeIndex ? 'border-light-gold' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-espresso/95 flex items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-ivory p-2 hover:text-light-gold transition-colors z-10"
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>
            <div className="relative w-full max-w-4xl mx-auto px-4">
              <img
                src={images[activeIndex]?.url}
                alt={images[activeIndex]?.alt || designName}
                className="w-full max-h-[85vh] object-contain"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-ivory/10 hover:bg-ivory/20 p-3 rounded-full text-ivory transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-ivory/10 hover:bg-ivory/20 p-3 rounded-full text-ivory transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-ivory/60 text-sm">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
