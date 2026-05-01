import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { cn } from '@/lib/utils';

interface MediaGalleryProps {
  images: string[];
  alt?: string;
}

export default function MediaGallery({ images, alt = "Media gallery item" }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No media available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Main Viewer */}
      <div className="relative aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden group shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <OptimizedImage 
              src={images[activeIndex]} 
              alt={`${alt} ${activeIndex + 1}`} 
              priority
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button 
            onClick={() => setIsLightboxOpen(true)}
            className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all pointer-events-auto"
            title="Expand View"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full z-20">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${((activeIndex + 1) / images.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative shrink-0 w-24 md:w-32 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all duration-300",
                activeIndex === idx ? "border-white ring-2 ring-black/5 scale-105 z-10" : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              <OptimizedImage 
                src={img} 
                alt={`${alt} thumb ${idx + 1}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal (Simulated simple version) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X size={40} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <motion.img 
                key={activeIndex}
                src={images[activeIndex]} 
                alt={`${alt} full`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />

              <button 
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all"
              >
                <ChevronLeft size={60} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all"
              >
                <ChevronRight size={60} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { X } from 'lucide-react';
