import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Key } from 'lucide-react';

export default function PropertyLandingPage() {
  return (
    <div className="flex-grow flex flex-col bg-[#0a0a0a] text-white pt-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0 opacity-30">
          <video 
            src="/re-bg.mp4" 
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
            className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-6"
          >
            Luxury Living Reimagined
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]"
          >
            Masembe <br /> <span className="text-[#d4af37]">Real Estate</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/property/portfolio"
              className="px-12 py-5 border-2 border-[#d4af37] text-[#d4af37] text-sm font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all"
            >
              Portfolio
            </Link>
            <Link
              to="/property/projects"
              className="px-12 py-5 border-2 border-[#d4af37] text-[#d4af37] text-sm font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all"
            >
              Projects
            </Link>          </motion.div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-24 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto w-full">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] rounded-full">
            <Building2 size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Iconic Developments</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            We build landmarks that reshape the skyline, combining modern innovation with structural excellence.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] rounded-full">
            <MapPin size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Prime Locations</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Strategically positioning our commercial and residential projects in the most high-value zones across the city.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] rounded-full">
            <Key size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Integrated Construction</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Mastering the development lifecycle from initial design to final realization of world-class commercial plazas.
          </p>
        </div>
      </section>

      {/* The Masembe Standard */}
      <section className="py-24 px-6 md:px-12 bg-white/5 border-y border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-8 block">The Masembe Standard</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Smart Density <br />Development</h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-12">
                By recognizing that land is a finite resource while the economy continues to expand, we focus on maximizing the utility of small land parcels (e.g., 100x100) to create high-value, sustainable urban environments.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-4">Vertical Integration</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Utilizing multi-story designs like 4-story commercial hubs and 12-unit apartment blocks to increase density without sacrificing quality.</p>
                </div>
                <div>
                  <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-4">Eco-Density</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Integrating LED lighting, modern glass holdings, and green urbanism to ensure high-density areas remain breathable and aesthetic.</p>
                </div>
                <div>
                  <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-4">Precision Engineering</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Maximizing foundation strength and structural integrity to support vertical growth on smaller footprints.</p>
                </div>
                <div>
                  <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-4">Economic Catalyst</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Turning underutilized small plots into profitable commercial centers directly supporting Uganda’s economic trajectory.</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 relative">
                <div className="aspect-[4/5] bg-white/10 rounded-sm overflow-hidden relative">
                    <img 
                        src="/assets/new_re/IMG-20260408-WA0011.jpg" 
                        alt="Smart Density" 
                        className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-[#d4af37]/30 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Call to Action */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Interior" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 italic">"Architecture should speak of its time and place, but yearn for timelessness."</h2>
          <Link 
            to="/property/portfolio"
            className="inline-block px-16 py-6 bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-[#d4af37] transition-colors"
          >
            Discover Your Next Investment
          </Link>
        </div>
      </section>
    </div>
  );
}
