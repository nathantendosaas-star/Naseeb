import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';

export default function WorkshopPage() {
  const [sliderPos, setSliderPos] = useState(50);
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div ref={pageRef} className="relative min-h-screen bg-[#111] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: yTitle }}
          className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4"
        >
          Grid Workshop
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-16"
        >
          Premium Wraps, Body Kits & Performance Tuning.
        </motion.p>

        {/* Section A: Before/After Slider */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">Vehicle Wrapping</h2>
          <div 
            className="relative h-[400px] md:h-[600px] w-full rounded-xl overflow-hidden cursor-ew-resize select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
              setSliderPos((x / rect.width) * 100);
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
              setSliderPos((x / rect.width) * 100);
            }}
          >
            {/* After Image (Bottom) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            
            {/* Before Image (Top, Clipped) */}
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale"
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            />

            {/* Slider Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-auto-accent"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-auto-accent rounded-full flex items-center justify-center shadow-lg">
                <div className="w-1 h-4 bg-white rounded-full" />
              </div>
            </div>
            
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 text-sm font-bold tracking-widest uppercase rounded">Before</div>
            <div className="absolute top-4 right-4 bg-auto-accent/80 backdrop-blur-md px-4 py-2 text-sm font-bold tracking-widest uppercase rounded">After</div>
          </div>
        </div>

        {/* Section B: Body Kit Gallery */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">Body Kits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative h-[300px] rounded-xl overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop&sig=${i}`} 
                  alt="Body Kit" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <h3 className="text-xl font-bold uppercase">Aero Kit 0{i}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Performance Tuning */}
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">Performance Tuning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-auto-accent transition-colors">
              <h3 className="text-2xl font-bold uppercase mb-4">Stage 1 ECU Remap</h3>
              <p className="text-gray-400 mb-6">Optimize your engine's software for better fuel efficiency and a noticeable bump in horsepower and torque.</p>
              <p className="font-mono text-auto-accent text-xl font-bold">+40 HP / +60 NM</p>
            </div>
            <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-auto-accent transition-colors">
              <h3 className="text-2xl font-bold uppercase mb-4">Stage 2 + Exhaust</h3>
              <p className="text-gray-400 mb-6">Aggressive ECU tuning combined with a high-flow exhaust system for maximum performance and sound.</p>
              <p className="font-mono text-auto-accent text-xl font-bold">+80 HP / +110 NM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
