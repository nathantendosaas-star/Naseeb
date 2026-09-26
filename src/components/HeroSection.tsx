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
    <section ref={ref} className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#070709] text-white">
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-blue-900/20 via-slate-800/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {shouldLoadVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-40 mix-blend-luminosity"
        >
          {resolvedCdnUrl && <source src={resolvedCdnUrl} />}
          {videoSrc && <source src={videoSrc.startsWith('/') ? videoSrc : `/${videoSrc}`} />}
        </video>
      )}

      {/* Solid dark gradient overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/80 via-[#070709]/40 to-[#070709] pointer-events-none" />

      <motion.div
        style={{ y }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
      >
        {subtitle && (
          <div className="mb-6">
            <div className="bg-[#121216]/90 border border-white/15 px-4 py-1.5 rounded-full text-xs text-white/90 backdrop-blur-md shadow-2xl inline-flex items-center gap-3">
              <span className="bg-[#2563eb] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                New
              </span>
              <span className="text-white/90 font-medium tracking-wide">
                {subtitle}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1 pl-1 border-l border-white/10">
                Read More ↗
              </span>
            </div>
          </div>
        )}

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-serif font-normal tracking-tight leading-[1.02] text-[#f8f8f8] mb-6">
          {title}
        </h1>

        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed font-light tracking-wide mb-8">
          We turn ideas into unforgettable experiences. Your next chapter starts here.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="bg-[#2563eb] hover:bg-blue-600 text-white font-medium px-8 py-3.5 rounded-full text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
            Book A Call
          </button>
          <button className="bg-[#222226]/90 hover:bg-[#2d2d33] border border-white/10 text-white font-medium px-8 py-3.5 rounded-full text-sm transition-all hover:scale-105">
            View Pricing
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
