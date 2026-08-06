import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import StatNode from './StatNode';
import { cn } from '@/lib/utils';
import Modal from './Modal';
import OptimizedImage from './OptimizedImage';

export interface ShowroomItem {
  id: string;
  title: string;
  watermark: string;
  image: string;
  rotation?: number;
  stats: {
    label: string;
    value: string | number;
    suffix?: string;
  }[];
  detailComponent?: React.ReactNode;
}

interface ParallaxShowroomProps {
  items: ShowroomItem[];
  theme: 'auto' | 're';
}

export default function ParallaxShowroom({ items, theme }: ParallaxShowroomProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);
  
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"]
  });

  const watermarkX = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.1, 0.1, 0]);
  const carY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const carScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);

  const activeItem = items[activeIndex];

  // Reset scroll when active car changes
  useEffect(() => {
    if (outerRef.current) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [activeIndex]);

  // Filters logic
  const makes = Array.from(new Set(items.map(item => item.stats.find(s => s.label === 'Make')?.value))).filter(Boolean) as string[];
  const [selectedMake, setSelectedMake] = useState<string>('');

  const filteredItems = items.filter(item => !selectedMake || item.stats.find(s => s.label === 'Make')?.value === selectedMake);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className={cn(
        "relative w-full h-screen flex items-center justify-center",
        theme === 'auto' ? "bg-[#F7F7F5] text-black" : "bg-[#0C0C0C] text-white"
      )}>
        <p className="text-xl font-bold uppercase tracking-widest opacity-50">Coming Soon</p>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch || !containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5
    
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    if (!isTouch) {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  // Calculate tilt (max +/- 3 degrees)
  const rotateX = mousePosition.y * -6; 
  const rotateY = mousePosition.x * 6;

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    
    if (Math.abs(diff) > 50) {
      const currentFilteredIndex = filteredItems.findIndex(item => item.id === activeItem.id);
      if (diff > 0 && currentFilteredIndex < filteredItems.length - 1) {
        const nextItem = filteredItems[currentFilteredIndex + 1];
        const nextIndex = items.findIndex(item => item.id === nextItem.id);
        setActiveIndex(nextIndex);
      } else if (diff < 0 && currentFilteredIndex > 0) {
        const prevItem = filteredItems[currentFilteredIndex - 1];
        const prevIndex = items.findIndex(item => item.id === prevItem.id);
        setActiveIndex(prevIndex);
      }
    }
  };

  return (
    <div
      ref={outerRef}
      className={cn(
        "relative w-full",
        theme === 'auto' ? "bg-[#F7F7F5] text-black" : "bg-[#0C0C0C] text-white"
      )}
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {activeItem.detailComponent}
      </Modal>

      {/* Filters UI */}
      <div className="absolute top-32 left-8 md:left-16 z-40 flex flex-col md:flex-row gap-4">
        <div className="relative group">
          <select
            value={selectedMake}
            onChange={(e) => {
              setSelectedMake(e.target.value);
              // Reset to first item of this make
              if (e.target.value) {
                const firstIndex = items.findIndex(item => item.stats.find(s => s.label === 'Make')?.value === e.target.value);
                if (firstIndex !== -1) setActiveIndex(firstIndex);
              }
            }}
            className="appearance-none bg-transparent border-b border-current py-2 pl-0 pr-8 focus:outline-none text-xs font-black uppercase tracking-widest cursor-pointer"
          >
            <option value="" className="bg-white text-black">All Manufacturers</option>
            {makes.sort().map(make => (
              <option key={make} value={make} className="bg-white text-black">{make}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>

        <div className="relative group">
          <select
            value={activeItem.id}
            onChange={(e) => {
              const index = items.findIndex(item => item.id === e.target.value);
              if (index !== -1) setActiveIndex(index);
            }}
            className="appearance-none bg-transparent border-b border-current py-2 pl-0 pr-8 focus:outline-none text-xs font-black uppercase tracking-widest cursor-pointer"
          >
            {filteredItems.map(item => (
              <option key={item.id} value={item.id} className="bg-white text-black">
                {item.stats.find(s => s.label === 'Model')?.value || item.title}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>
      </div>

      {/* Make the container taller to allow scrolling for the parallax effect */}
      <div className="h-[200vh]">
        <div 
          ref={containerRef}
          className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Layer 0: The Canvas (Fixed Texture) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {theme === 'auto' ? (
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                  backgroundSize: '24px 24px'
                }}
              />
            ) : (
              <div 
                className="absolute inset-0 opacity-3 mix-blend-overlay"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                }}
              />
            )}
          </div>

          {/* Layer 0.5: Parallax Watermark Background */}
          <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none flex items-center justify-center">
            <motion.div
              style={{
                x: watermarkX,
                opacity: watermarkOpacity,
                rotate: -10
              }}
              className="text-[20vw] md:text-[30vw] font-black uppercase whitespace-nowrap select-none"
            >
              {activeItem.watermark}
            </motion.div>
          </div>

          {/* Layer 1: The Floating Subject */}
          <div className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none px-6">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`subject-${activeItem.id}`}
                initial={{ x: 400, opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ 
                  x: 0, 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  rotateX: isTouch ? 0 : rotateX,
                  rotateY: isTouch ? 0 : rotateY
                }}
                exit={{ x: -400, opacity: 0, scale: 0.9, rotate: -2 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  willChange: 'transform',
                  y: carY,
                  scale: carScale
                }}
                className="w-full md:w-[80vw] max-w-7xl h-[65vh] md:h-[75vh] flex items-center justify-center pointer-events-auto cursor-pointer"
                onClick={() => navigate(`/cars/inventory/${activeItem.id}`)}
              >
                <OptimizedImage 
                  src={activeItem.image} 
                  alt={activeItem.title}
                  priority={activeIndex === 0}
                  rotation={activeItem.rotation}
                  className="w-full h-full object-contain drop-shadow-2xl bg-transparent"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Layer 2: The Staggered Data Nodes */}
          <div className="absolute bottom-16 md:bottom-24 left-8 md:left-16 z-30 flex flex-col md:flex-row gap-6 md:gap-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`stats-${activeItem.id}`}
                className="flex flex-col md:flex-row gap-6 md:gap-16"
              >
                {activeItem.stats.map((stat, idx) => (
                  <StatNode 
                    key={`${activeItem.id}-stat-${idx}`}
                    label={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    index={idx}
                    isActive={true}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-12 right-28 md:right-32 z-30 flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => {
                const currentFilteredIndex = filteredItems.findIndex(item => item.id === activeItem.id);
                const prevItem = filteredItems[Math.max(0, currentFilteredIndex - 1)];
                const prevIndex = items.findIndex(item => item.id === prevItem.id);
                setActiveIndex(prevIndex);
              }}
              disabled={filteredItems.findIndex(item => item.id === activeItem.id) === 0}
              className="p-3 rounded-full border border-current flex items-center justify-center opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
            >
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
            <div className="text-sm font-bold tracking-widest hidden md:block">
              0{filteredItems.findIndex(item => item.id === activeItem.id) + 1} <span className="opacity-50">/ 0{filteredItems.length}</span>
            </div>
            <button 
              onClick={() => {
                const currentFilteredIndex = filteredItems.findIndex(item => item.id === activeItem.id);
                const nextItem = filteredItems[Math.min(filteredItems.length - 1, currentFilteredIndex + 1)];
                const nextIndex = items.findIndex(item => item.id === nextItem.id);
                setActiveIndex(nextIndex);
              }}
              disabled={filteredItems.findIndex(item => item.id === activeItem.id) === filteredItems.length - 1}
              className="p-3 rounded-full border border-current flex items-center justify-center opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
            >
              <ArrowRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
