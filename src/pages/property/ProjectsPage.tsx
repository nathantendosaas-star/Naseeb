import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { properties as staticProperties } from '../../data/properties';
import type { Property } from '../../data/properties';
import OptimizedImage from '../../components/OptimizedImage';
import SEO from '../../components/SEO';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ProjectSectionProps {
  project: Property;
  index: number;
  dedicatedPath: string;
}

function ProjectSection({ project, index, dedicatedPath }: ProjectSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center", "end start"]
  });

  // Dynamic Scale and Opacity (matching LookbookItem)
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.05, 0.8]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  
  // Horizontal offset for zigzag entry/exit
  const xOffset = isEven ? 80 : -80;
  const xRaw = useTransform(scrollYProgress, [0, 0.5, 1], [xOffset, 0, xOffset]);

  // Smooth out the motion with springs
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const opacity = useSpring(opacityRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const x = useSpring(xRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Map scroll progress to image index (0 to 3) during the center portion of the scroll
  const imageIndex = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.55, 0.65],
    [0, 1, 2, 3],
    { clamp: true }
  );

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    return imageIndex.onChange((v) => {
      const rounded = Math.round(v);
      if (rounded !== currentIdx) {
        setCurrentIdx(rounded);
      }
    });
  }, [imageIndex, currentIdx]);

  // Opacity for the "See More" button - visible when scaled up
  const buttonOpacity = useTransform(scale, [0.95, 1.0], [0, 1]);

  const images = project.gallery.slice(0, 4);

  return (
    <div 
      ref={sectionRef} 
      className={cn(
        "relative min-h-[120vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden",
        isEven ? "items-end md:items-center" : "items-start md:items-center"
      )}
    >
      {/* Watermark background text */}
      <motion.div 
        style={{ opacity: useTransform(opacity, [0.4, 1], [0, 0.05]) }}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0"
      >
        <h2 className="text-[25vw] md:text-[20vw] font-black uppercase tracking-tighter text-white">
          {project.watermarkText}
        </h2>
      </motion.div>

      <motion.div 
        style={{ scale, opacity, x }}
        className="relative z-10 w-full max-w-7xl cursor-default"
      >
        <div className={cn(
          "flex flex-col gap-12 md:gap-24",
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        )}>
          {/* Content Side */}
          <div className={cn(
            "w-full md:w-1/3 flex flex-col justify-center",
            isEven ? "text-left" : "text-right"
          )}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                    {project.name}
                </h2>
                <p className="text-xl text-re-gray mb-8 font-light italic tracking-widest uppercase">
                    {project.location}
                </p>
                <div className={cn(
                    "flex items-center gap-4 text-sm font-bold tracking-[0.3em] uppercase opacity-50",
                    isEven ? "justify-start" : "justify-end"
                )}>
                    <span>0{index + 1}</span>
                    <div className="w-12 h-px bg-current" />
                    <span>04</span>
                </div>
            </motion.div>
          </div>

          {/* Visual Side (The Card) */}
          <div className="w-full md:w-2/3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${project.id}-${currentIdx}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                >
                  <OptimizedImage 
                    src={images[currentIdx] || project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              </AnimatePresence>

              {/* "See More" Button Overlay */}
              <motion.div 
                style={{ opacity: buttonOpacity }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-30"
              >
                <Link 
                  to={dedicatedPath}
                  className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-re-accent hover:text-white transition-all flex items-center gap-3 group"
                >
                  See More <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>

              {/* Progress Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                  {images.map((_, i) => (
                      <div 
                          key={i} 
                          className={cn(
                              "w-12 h-1 transition-all duration-500",
                              currentIdx === i ? "bg-white" : "bg-white/20"
                          )} 
                      />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    <div ref={containerRef} className="relative bg-[#0a0a0a] text-white">
      <SEO 
        title="Our Projects | Masembe Real Estate"
        description="A cinematic journey through our landmark developments in Kampala."
        canonical="/property/projects"
      />

      {/* Hero Intro */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none"
        >
          Our <span className="text-re-accent">Projects</span>
        </motion.h1>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-24 h-1 bg-re-accent mt-8 mb-8"
        />
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase opacity-50"
        >
            Vertical Innovation & Urban Density
        </motion.p>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 text-xs font-black uppercase tracking-widest opacity-30"
        >
            Scroll to Explore
        </motion.div>
      </section>

      {/* Zigzag Content */}
      <div className="pb-48">
        {displayProjects.map((project, index) => (
          <ProjectSection 
            key={project.id} 
            project={project} 
            index={index} 
            dedicatedPath={project.path}
          />
        ))}
      </div>
    </div>
  );
}
