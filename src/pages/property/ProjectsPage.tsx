import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
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
    offset: ["start end", "end start"]
  });

  // Map scroll progress to image index (0 to 3)
  // We use a tighter range in the middle of the scroll for the swiping effect
  const imageIndex = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.6, 0.75],
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

  // Opacity for the "See More" button - only visible when centered
  const buttonOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.6, 0.65],
    [0, 1, 1, 0]
  );

  const images = project.gallery.slice(0, 4);

  return (
    <div ref={sectionRef} className="relative h-[150vh] flex items-center justify-center">
      {/* Watermark background */}
      <motion.div 
        style={{ 
            x: isEven ? 100 : -100,
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.1, 0])
        }}
        className={cn(
            "absolute text-[20vw] font-black uppercase tracking-tighter pointer-events-none select-none",
            isEven ? "right-0 text-right" : "left-0 text-left"
        )}
      >
        {project.watermarkText}
      </motion.div>

      <div className={cn(
        "container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-24",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        {/* Content Side */}
        <motion.div 
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/3 z-20"
        >
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            {project.name}
          </h2>
          <p className="text-xl text-re-gray mb-8 font-light italic tracking-widest uppercase">
            {project.location}
          </p>
          <div className="flex items-center gap-4 text-sm font-bold tracking-[0.3em] uppercase opacity-50">
            <span>0{index + 1}</span>
            <div className="w-12 h-px bg-current" />
            <span>04</span>
          </div>
        </motion.div>

        {/* Visual Side (The Card) */}
        <motion.div 
          className="relative w-full md:w-2/3 aspect-[16/9] z-10"
        >
          <div className="relative w-full h-full overflow-hidden rounded-sm group">
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
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-30 pointer-events-auto"
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
        </motion.div>
      </div>
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
