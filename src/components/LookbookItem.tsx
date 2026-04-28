import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Car } from '@/data/cars';
import OptimizedImage from './OptimizedImage';
import { cn } from '@/lib/utils';

interface LookbookItemProps {
  car: Car;
  isReversed?: boolean;
  onClick: () => void;
}

export default function LookbookItem({ car, isReversed, onClick }: LookbookItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center", "end start"]
  });

  // Scale and Opacity transforms
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);
  
  // Smooth out the motion
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const opacity = useSpring(opacityRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Facts visibility - appear when scale is near maximum
  const factsOpacity = useTransform(scale, [1.0, 1.05], [0, 1]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative min-h-[60vh] flex items-center justify-center py-20 px-6 overflow-hidden",
        isReversed ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      {/* Background Text (Watermark style) */}
      <motion.div 
        style={{ opacity: useTransform(opacity, [0.4, 1], [0, 0.05]) }}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0"
      >
        <h2 className="text-[20vw] font-black uppercase tracking-tighter text-black">
          {car.make}
        </h2>
      </motion.div>

      {/* Main Content Card */}
      <motion.div 
        style={{ scale, opacity }}
        onClick={onClick}
        className="relative z-10 w-full max-w-4xl cursor-pointer group"
      >
        <div className={cn(
          "flex flex-col items-center gap-12",
          isReversed ? "md:flex-row-reverse" : "md:flex-row"
        )}>
          {/* Car Image Container */}
          <div className="w-full md:w-3/5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl bg-white/50 backdrop-blur-sm border border-black/5">
              <OptimizedImage 
                src={car.image} 
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Car Facts */}
          <motion.div 
            style={{ opacity: factsOpacity }}
            className={cn(
              "w-full md:w-2/5 space-y-6",
              isReversed ? "md:text-left" : "md:text-right"
            )}
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-2">
                {car.year}
              </p>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                {car.make} <br /> {car.model}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={cn(isReversed ? "" : "text-right")}>
                <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Power</p>
                <p className="text-xl font-black uppercase tracking-tighter">{car.hp} HP</p>
              </div>
              <div className={cn(isReversed ? "" : "text-right")}>
                <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Price</p>
                <p className="text-xl font-black uppercase tracking-tighter text-red-600">{car.price}</p>
              </div>
            </div>

            <p className="text-sm text-black/60 font-medium leading-relaxed">
              {car.specs?.engine || "Premium Performance Engine"} • {car.specs?.driveType || "Precision Handling"}
            </p>

            <div className={cn("pt-4 flex", isReversed ? "justify-start" : "justify-end")}>
              <span className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                View Details
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
