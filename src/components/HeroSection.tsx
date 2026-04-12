import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  videoSrc: string; // path to video in public/assets
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, videoSrc }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={ref} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        style={{ y }}
        className="relative z-10 text-center text-white"
      >
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6" style={{ color: '#d4af37' }}>{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl">{subtitle}</p>}
      </motion.div>
    </section>
  );
};

export default HeroSection;
