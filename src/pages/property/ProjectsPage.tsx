import { motion, AnimatePresence } from 'motion/react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { properties as staticProperties } from '../../data/properties';
import type { Property } from '../../data/properties';
import OptimizedImage from '../../components/OptimizedImage';
import SEO from '../../components/SEO';
import { cn } from '@/lib/utils';
import { ArrowRight, Info } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectSectionProps {
  project: Property;
  index: number;
  dedicatedPath: string;
}

function ProjectSection({ project, index, dedicatedPath }: ProjectSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const isEven = index % 2 === 0;

  const images = useMemo(() => project.gallery.slice(0, 4), [project.gallery]);

  // Preload all images in this section's gallery
  useEffect(() => {
    images.forEach(src => {
      if (!src.endsWith('.mp4')) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [images]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          // Map scroll progress (0 to 1) to image index (0 to 3)
          const progress = self.progress;
          const idx = Math.min(Math.floor(progress * images.length), images.length - 1);
          setCurrentIdx(idx);
        }
      });
    });

    return () => ctx.revert();
  }, [images.length]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[250vh] w-full bg-[#0a0a0a]"
    >
      {/* Sticky Content Container */}
      <div 
        ref={stickyRef}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6 md:px-12"
      >
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <h2 className="text-[22vw] font-black uppercase tracking-tighter text-white opacity-[0.03] leading-none whitespace-nowrap">
            {project.watermarkText}
          </h2>
        </div>

        <div className={cn(
          "relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center gap-12 lg:gap-24",
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        )}>
          {/* Content Info */}
          <div className={cn(
            "w-full md:w-1/3 flex flex-col",
            isEven ? "text-left items-start" : "text-right items-end"
          )}>
            <div className="space-y-4">
                <span className="text-re-accent font-black tracking-[0.4em] uppercase text-xs">
                    Project 0{index + 1}
                </span>
                <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] break-words max-w-full">
                    {project.name}
                </h2>
                <p className="text-lg lg:text-xl text-re-gray font-light italic tracking-widest uppercase">
                    {project.location}
                </p>
                <div className={cn(
                    "flex items-center gap-4 text-xs font-bold tracking-[0.3em] uppercase opacity-30 pt-4",
                    isEven ? "justify-start" : "justify-end"
                )}>
                    <span>Viewed 0{currentIdx + 1}</span>
                    <div className="w-12 h-px bg-current" />
                    <span>04</span>
                </div>
            </div>
          </div>

          {/* Visual Showcase (The Pinned Card) */}
          <div className="w-full md:w-2/3 group relative">
            <div 
                onClick={() => setShowButton(!showButton)}
                className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${project.id}-${currentIdx}`}
                  initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                >
                  <OptimizedImage 
                    src={images[currentIdx] || project.image} 
                    alt={project.name} 
                    priority={true}
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              </AnimatePresence>

              {/* Click-to-show "See More" Button Overlay */}
              <AnimatePresence>
                {showButton && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30"
                    >
                        <h3 className="text-white text-2xl font-black uppercase tracking-tighter mb-8">
                            Detailed Overview
                        </h3>
                        <Link 
                            to={dedicatedPath}
                            className="px-12 py-5 bg-re-accent text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center gap-3 shadow-2xl"
                        >
                            Explore Section <ArrowRight size={18} />
                        </Link>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowButton(false); }}
                            className="mt-8 text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Back to Gallery
                        </button>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Hint Overlay (First Image Only) */}
              {!showButton && currentIdx === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10"
                  >
                    <Info size={14} className="text-re-accent" /> Click to see more
                  </motion.div>
              )}

              {/* Progress Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-30">
                  {images.map((_, i) => (
                      <div 
                          key={i} 
                          className={cn(
                              "h-1 rounded-full transition-all duration-700 ease-out",
                              currentIdx === i ? "w-16 bg-re-accent" : "w-8 bg-white/20"
                          )} 
                      />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  const categories = [
    { id: 'luxury-apartments', path: '/property/luxury' },
    { id: 'construction-portfolio', path: '/property/ongoing' },
    { id: 'commercial-plaza', path: '/property/commercial' },
    { id: 'innovation-plans', path: '/property/future' }
  ];

  const displayProjects = useMemo(() => {
    return categories.map(cat => {
        const prop = staticProperties.find(p => p.id === cat.id);
        return prop ? { ...prop, path: cat.path } : null;
    }).filter(Boolean) as (Property & { path: string })[];
  }, []);

  return (
    <div className="relative bg-[#0a0a0a] text-white">
      <SEO 
        title="Our Projects | Masembe Real Estate"
        description="A cinematic journey through our landmark developments in Kampala."
        canonical="/property/projects"
      />

      {/* Intro Hero - Simple & Bold */}
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6 border-b border-white/5">
        <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-xs font-black uppercase tracking-[0.5em] mb-8"
        >
            The Collection
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none"
        >
          Signature <br /> <span className="text-re-accent">Projects</span>
        </motion.h1>
      </section>

      {/* Zigzag Content with Pinning */}
      <div className="relative">
        {displayProjects.map((project, index) => (
          <ProjectSection 
            key={project.id} 
            project={project} 
            index={index} 
            dedicatedPath={project.path}
          />
        ))}
      </div>

      {/* Footer-like CTA */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 bg-white text-black">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">
            Build Your <br /> Future Today
          </h2>
          <Link 
            to="/contact"
            className="px-16 py-6 bg-re-accent text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl"
          >
            Start a Consultation
          </Link>
      </section>
    </div>
  );
}
