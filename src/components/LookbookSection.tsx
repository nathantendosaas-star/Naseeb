import { useState, useMemo, useEffect } from 'react';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import { cars as staticCars } from '@/data/cars';
import type { Car } from '@/data/cars';
import { useFirestoreCollection } from '@/hooks/useFirestore';
import LookbookItem from './LookbookItem';
import CarModalContent from './CarModalContent';
import Modal from './Modal';

export default function LookbookSection() {
  const { data: firestoreCars } = useFirestoreCollection<Car>('cars');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxHp, setMaxHp] = useState<number>(1000);

  // Merge static and firestore cars
  const allCars = useMemo(() => {
    const carMap = new Map<string, Car>();
    staticCars.forEach(car => carMap.set(car.id, car));
    firestoreCars.forEach(car => carMap.set(car.id, car));
    return Array.from(carMap.values());
  }, [firestoreCars]);

  const absoluteMaxHp = useMemo(() => {
    const max = Math.max(...allCars.map(car => car.hp || 0), 0);
    return max > 0 ? max : 1000;
  }, [allCars]);

  // Sync maxHp with absoluteMaxHp on initial load
  useEffect(() => {
    if (absoluteMaxHp > 0) {
      setMaxHp(absoluteMaxHp);
    }
  }, [absoluteMaxHp]);

  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesHp = (car.hp || 0) <= maxHp;
      return matchesSearch && matchesHp;
    });
  }, [allCars, searchQuery, maxHp]);

  const selectedCar = useMemo(() => 
    allCars.find(car => car.id === selectedCarId), 
    [allCars, selectedCarId]
  );

  return (
    <section className="bg-[#f8f8f8] py-24 relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-4">
          The Grid Lookbook
        </p>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
          Excellence <br /> <span className="text-red-600">Defined</span>
        </h2>
      </div>

      {/* Filters Bar */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row gap-12 items-end bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-black/5">
          {/* Search */}
          <div className="flex-grow w-full">
            <div className="flex items-center gap-2 mb-3 opacity-40">
              <Search size={12} />
              <p className="text-[10px] uppercase tracking-widest font-black">Search Collection</p>
            </div>
            <input
              type="text"
              placeholder="Filter by make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-black/10 pb-2 focus:outline-none focus:border-red-600 transition-colors text-lg font-bold placeholder-gray-300"
            />
          </div>
          
          {/* HP Slider */}
          <div className="w-full md:w-72">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 opacity-40">
                <SlidersHorizontal size={12} />
                <p className="text-[10px] uppercase tracking-widest font-black">Max Power</p>
              </div>
              <p className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md">{maxHp} HP</p>
            </div>
            <input 
              type="range"
              min="0"
              max={absoluteMaxHp}
              value={maxHp}
              onChange={(e) => setMaxHp(parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/5 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between mt-2 opacity-20 text-[8px] font-black uppercase tracking-tighter">
              <span>0 HP</span>
              <span>{absoluteMaxHp} HP</span>
            </div>
          </div>

          {/* Reset */}
          {(searchQuery !== '' || maxHp !== absoluteMaxHp) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setMaxHp(absoluteMaxHp);
              }}
              className="text-[10px] uppercase tracking-widest font-black text-red-600 hover:scale-110 transition-transform pb-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Lookbook Items */}
      <div className="flex flex-col gap-12 overflow-hidden min-h-[400px]">
        {filteredCars.length > 0 ? (
          filteredCars.map((car, index) => (
            <LookbookItem 
              key={car.id} 
              car={car} 
              isReversed={index % 2 !== 0}
              onClick={() => setSelectedCarId(car.id)}
            />
          ))
        ) : (
          <div className="py-32 text-center">
            <p className="text-xl font-bold text-black/20 uppercase tracking-widest">No vehicles match your criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setMaxHp(absoluteMaxHp);
              }}
              className="mt-4 text-red-600 font-black uppercase tracking-widest text-xs hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Expansion Overlay (Integrated Modal) */}
      <Modal 
        isOpen={!!selectedCarId} 
        onClose={() => setSelectedCarId(null)}
      >
        {selectedCar && (
          <div className="relative">
            <button 
              onClick={() => setSelectedCarId(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <CarModalContent car={selectedCar} />
          </div>
        )}
      </Modal>

      {/* Decorative Bottom Text */}
      <div className="mt-32 text-center opacity-5 select-none pointer-events-none">
        <h3 className="text-[15vw] font-black uppercase tracking-tighter">
          Grid Motors
        </h3>
      </div>
    </section>
  );
}
