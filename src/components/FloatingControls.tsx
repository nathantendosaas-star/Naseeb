import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  availableBrands: string[];
  maxHp: number;
  setMaxHp: (hp: number) => void;
  absoluteMaxHp: number;
}

export default function FloatingControls({
  searchQuery,
  setSearchQuery,
  selectedBrands,
  setSelectedBrands,
  availableBrands,
  maxHp,
  setMaxHp,
  absoluteMaxHp
}: FloatingControlsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <>
      {/* Floating Bottom Search Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-auto flex items-center gap-4 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-full p-2 pl-6 shadow-2xl"
        >
          <div className="flex-grow flex items-center gap-3">
            <Search size={18} className="text-white/60" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 font-bold py-2"
            />
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
          >
            <SlidersHorizontal size={14} />
            Filters
            {selectedBrands.length > 0 && (
              <span className="bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">
                {selectedBrands.length}
              </span>
            )}
          </button>
        </motion.div>
      </div>

      {/* Side Filter Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white/20 backdrop-blur-3xl border-r border-white/20 z-[120] p-8 flex flex-col text-white"
            >
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-xl font-black uppercase tracking-tighter">Refine Results</h3>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Brands List (Amazon-style) */}
              <div className="mb-12 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-6 opacity-60">Manufacturers</p>
                <div className="space-y-3">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="group flex items-center gap-4 cursor-pointer py-1 select-none"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded bg-white/5 checked:bg-white checked:border-white transition-all cursor-pointer"
                        />
                        <Check 
                          size={14} 
                          strokeWidth={4}
                          className="absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
                        />
                      </div>
                      <span className={cn(
                        "text-[11px] font-black uppercase tracking-[0.15em] transition-colors",
                        selectedBrands.includes(brand) ? "text-white" : "text-white/40 group-hover:text-white"
                      )}>
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* HP Slider (Special Feature) */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-60">Performance</p>
                    <h4 className="text-sm font-bold uppercase">Max Horsepower</h4>
                  </div>
                  <span className="text-xl font-black text-red-500">{maxHp} HP</span>
                </div>
                <div className="px-2">
                  <input 
                    type="range"
                    min="0"
                    max={absoluteMaxHp}
                    value={maxHp}
                    onChange={(e) => setMaxHp(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600 mb-4"
                  />
                  <div className="flex justify-between text-[8px] font-black uppercase opacity-40">
                    <span>0 HP</span>
                    <span>{absoluteMaxHp} HP</span>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button 
                onClick={() => {
                  setSelectedBrands([]);
                  setSearchQuery('');
                  setMaxHp(absoluteMaxHp);
                }}
                className="mt-12 w-full py-4 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Reset All Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
