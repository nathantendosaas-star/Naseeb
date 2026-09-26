import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { getCdnVideoUrl } from '../lib/cdnVideo';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  videoSrc: string; // path to video in public/assets
  posterSrc?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, videoSrc, posterSrc }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const resolvedCdnUrl = getCdnVideoUrl(videoSrc);

  return (
    <section ref={ref} className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#0A0A0C]">
      {shouldLoadVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-80"
        >
          {resolvedCdnUrl && <source src={resolvedCdnUrl} />}
          {videoSrc && <source src={videoSrc.startsWith('/') ? videoSrc : `/${videoSrc}`} />}
        </video>
      )}

      {/* Solid dark gradient overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80 pointer-events-none" />

      <motion.div
        style={{ y }}
        className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
      >
        <h1 className="text-5xl md:text-8xl font-light tracking-[0.15em] uppercase mb-6 text-[#F7F7F5] font-serif">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#C5A880] font-sans font-medium">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default HeroSection;
