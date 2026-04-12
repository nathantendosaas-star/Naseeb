import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe } from 'lucide-react';
import ShowroomPage from './ShowroomPage';

export default function CarLandingPage() {
  return (
    <div className="flex-grow flex flex-col bg-white text-black pt-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0 opacity-20">
          <video 
            src="/videoplayback.webm" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-6"
          >
            Excellence in Motion
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]"
          >
            Grid <br /> <span className="text-red-600">Motors</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/cars/inventory"
              className="px-12 py-5 border-2 border-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Inventory
            </Link>
            <Link 
              to="/cars/import"
              className="px-12 py-5 border-2 border-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Import
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Showroom Integration */}
      <ShowroomPage />

      {/* Stats/Features */}
      <section className="py-24 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto w-full">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Certified Quality</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Every vehicle in our collection undergoes a rigorous 150-point inspection by our master technicians.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Performance First</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            We specialize in high-performance and luxury vehicles that redefine the driving experience.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Global Sourcing</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Can't find it here? Our global network allows us to source the rarest automobiles from around the world.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-white py-32 px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">Ready to find your <br /> next masterpiece?</h2>
        <Link 
          to="/cars/inventory"
          className="inline-block px-16 py-6 bg-red-600 text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          View Full Collection
        </Link>
      </section>
    </div>
  );
}
