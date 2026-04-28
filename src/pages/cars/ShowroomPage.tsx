import { useState, useMemo, useEffect } from 'react';
import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import ParallaxShowroom from '../../components/ParallaxShowroom';
import type { ShowroomItem } from '../../components/ParallaxShowroom';
import CarModalContent from '../../components/CarModalContent';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import SEO from '../../components/SEO';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ShowroomPage() {
  const { data: firestoreCars } = useFirestoreCollection<Car>('cars');
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

  const items: ShowroomItem[] = filteredCars.map(car => ({
    id: car.id,
    title: `${car.make} ${car.model}`,
    watermark: car.watermarkText,
    image: car.image,
    stats: [
      { label: 'Make', value: car.make },
      { label: 'Model', value: car.model },
      { label: 'Power', value: car.hp, suffix: ' HP' },
      { label: 'Price', value: car.price }
    ],
    detailComponent: <CarModalContent car={car} />
  }));

  return (
    <>
      <SEO 
        title="Luxury Showroom | Grid Motors"
        description="Explore our exclusive collection of luxury vehicles, including Mercedes-Benz, BMW, and more at the Grid Motors showroom."
        canonical="/cars/showroom"
      />
      
      {/* Search & Filter Overlay */}
      <div className="fixed top-24 left-0 right-0 z-[60] px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-end bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-black/5 pointer-events-auto">
          <div className="flex-grow w-full">
            <div className="flex items-center gap-2 mb-2 opacity-40">
              <Search size={10} />
              <p className="text-[8px] uppercase tracking-widest font-black">Search</p>
            </div>
            <input
              type="text"
              placeholder="Model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-black/10 pb-1 focus:outline-none focus:border-red-600 transition-colors text-sm font-bold"
            />
          </div>
          
          <div className="w-full md:w-48">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 opacity-40">
                <SlidersHorizontal size={10} />
                <p className="text-[8px] uppercase tracking-widest font-black">Max HP</p>
              </div>
              <p className="text-[8px] font-black text-red-600">{maxHp} HP</p>
            </div>
            <input 
              type="range"
              min="0"
              max={absoluteMaxHp}
              value={maxHp}
              onChange={(e) => setMaxHp(parseInt(e.target.value))}
              className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          {(searchQuery !== '' || maxHp !== absoluteMaxHp) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setMaxHp(absoluteMaxHp);
              }}
              className="text-[8px] uppercase tracking-widest font-black text-red-600 hover:scale-110 transition-transform pb-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <ParallaxShowroom items={items} theme="auto" />
    </>
  );
}
