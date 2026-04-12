import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

interface WatermarkLayerProps {
  key?: React.Key;
  text: string;
  theme: 'auto' | 're';
}

export default function WatermarkLayer({ text, theme }: WatermarkLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We use useScroll to track window scroll and move the text up
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (value) => value * -0.5);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-10 flex items-center justify-center"
      style={{ mixBlendMode: 'soft-light' }}
    >
      <motion.div
        style={{ y, willChange: 'transform' }}
        className={cn(
          "whitespace-nowrap text-center opacity-60 dark:opacity-80",
          theme === 'auto' 
            ? "font-black uppercase tracking-[-0.04em] text-[clamp(150px,20vw,300px)]" 
            : "font-serif italic tracking-[-0.02em] text-[clamp(150px,20vw,300px)]"
        )}
      >
        {text}
      </motion.div>
    </div>
  );
}
