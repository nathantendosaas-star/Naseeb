import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { cars as staticCars } from '@/data/cars';
import type { Car } from '@/data/cars';
import { useFirestoreCollection } from '@/hooks/useFirestore';
import LookbookItem from './LookbookItem';
import CarModalContent from './CarModalContent';
import Modal from './Modal';
import FloatingControls from './FloatingControls';

const parsePrice = (priceStr: string) => {
  const numeric = priceStr.replace(/[^0-9]/g, '');
  return parseInt(numeric) || 0;
};

export default function LookbookSection() {
  const { data: firestoreCars = [] } = useFirestoreCollection<Car>('cars');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [maxHp, setMaxHp] = useState<number>(1000);

  // Merge static and firestore cars
  const allCars = useMemo(() => {
    const carMap = new Map<string, Car>();
    staticCars.forEach(car => carMap.set(car.id, car));
    firestoreCars.forEach(car => carMap.set(car.id, car));
    return Array.from(carMap.values());
  }, [firestoreCars]);

  const availableBrands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(allCars.map(car => car.make)));
    return uniqueBrands.sort();
  }, [allCars]);

  const absoluteMaxPrice = useMemo(() => {
    const max = Math.max(...allCars.map(car => parsePrice(car.price)), 0);
    return max > 0 ? max : 1000000;
  }, [allCars]);

  const absoluteMaxHp = useMemo(() => {
    const max = Math.max(...allCars.map(car => car.hp || 0), 0);
    return max > 0 ? max : 1000;
  }, [allCars]);

  // Sync limits on load
  useEffect(() => {
    setMaxPrice(absoluteMaxPrice);
    setMaxHp(absoluteMaxHp);
  }, [absoluteMaxPrice, absoluteMaxHp]);

  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.make);
      const matchesPrice = parsePrice(car.price) <= maxPrice;
      const matchesHp = (car.hp || 0) <= maxHp;
      return matchesSearch && matchesBrand && matchesPrice && matchesHp;
    });
  }, [allCars, searchQuery, selectedBrands, maxPrice, maxHp]);

  const selectedCar = useMemo(() => 
    allCars.find(car => car.id === selectedCarId), 
    [allCars, selectedCarId]
  );

  return (
    <section className="bg-[#f8f8f8] py-24 relative min-h-screen">
      <FloatingControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={selectedBrands}
        setSelectedCategories={setSelectedBrands}
        availableCategories={availableBrands}
        categoryLabel="Manufacturers"
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        absoluteMaxPrice={absoluteMaxPrice}
        maxHp={maxHp}
        setMaxHp={setMaxHp}
        absoluteMaxHp={absoluteMaxHp}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-4">
          The Grid Lookbook
        </p>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
          Excellence <br /> <span className="text-red-600">Defined</span>
        </h2>
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
            <p className="text-xl font-bold text-black/20 uppercase tracking-widest">No matching masterpieces</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedBrands([]);
                setMaxHp(absoluteMaxHp);
              }}
              className="mt-4 text-red-600 font-black uppercase tracking-widest text-xs hover:underline"
            >
              Reset Search
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
