import { motion, useScroll, useTransform } from 'motion/react';
import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import { useRef, useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import Modal from '../../components/Modal';
import CarModalContent from '../../components/CarModalContent';
import SEO from '../../components/SEO';

import OptimizedImage from '../../components/OptimizedImage';

export default function InventoryPage() {
  const { data: firestoreCars } = useFirestoreCollection<Car>('cars');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [maxHp, setMaxHp] = useState<number>(1000);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Merge static and firestore cars, ensuring unique IDs (Firestore takes precedence)
  const cars = (() => {
    const carMap = new Map<string, Car>();
    staticCars.forEach(car => carMap.set(car.id, car));
    firestoreCars.forEach(car => carMap.set(car.id, car));
    return Array.from(carMap.values());
  })();

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(cars.map(car => car.make)));
    return ['All Brands', ...uniqueBrands.sort()];
  }, [cars]);

  const absoluteMaxHp = useMemo(() => {
    return Math.max(...cars.map(car => car.hp), 1000);
  }, [cars]);

  // Update maxHp filter limit when cars load
  useState(() => {
    setMaxHp(absoluteMaxHp);
  });

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All Brands' || car.make === selectedBrand;
    const matchesHp = car.hp <= maxHp;
    
    return matchesSearch && matchesBrand && matchesHp;
  });

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleNextCar = () => {
    if (!selectedCar) return;
    const currentIndex = filteredCars.findIndex(c => c.id === selectedCar.id);
    const nextIndex = (currentIndex + 1) % filteredCars.length;
    setSelectedCar(filteredCars[nextIndex]);
  };

  const handlePrevCar = () => {
    if (!selectedCar) return;
    const currentIndex = filteredCars.findIndex(c => c.id === selectedCar.id);
    const prevIndex = (currentIndex - 1 + filteredCars.length) % filteredCars.length;
    setSelectedCar(filteredCars[prevIndex]);
  };

  return (
    <div ref={pageRef} className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-auto-bg text-auto-text">
      <SEO 
        title="Vehicle Inventory | Grid Motors"
        description="Browse our current stock of certified high-performance and luxury automobiles available for immediate purchase in Kampala."
        canonical="/cars/inventory"
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedCar && (
          <CarModalContent 
            car={selectedCar} 
            onNext={filteredCars.length > 1 ? handleNextCar : undefined}
            onPrev={filteredCars.length > 1 ? handlePrevCar : undefined}
          />
        )}
      </Modal>

      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: yTitle }}
          className="text-3xl md:text-6xl font-black tracking-tighter uppercase mb-8 md:mb-12"
        >
          Inventory
        </motion.h1>

        {/* Filters Section */}
        <div className="mb-12 flex flex-col md:flex-row gap-8 items-end">
          {/* Search */}
          <div className="w-full md:w-80">
            <p className="text-[10px] uppercase tracking-widest font-black mb-2 opacity-40">Search</p>
            <input
              type="text"
              placeholder="Model name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-auto-text/20 pb-2 focus:outline-none focus:border-auto-accent transition-colors text-auto-text placeholder-gray-500 text-sm"
            />
          </div>

          {/* Brand Filter */}
          <div className="w-full md:w-60">
            <p className="text-[10px] uppercase tracking-widest font-black mb-2 opacity-40">Manufacturer</p>
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-transparent border-b border-auto-text/20 pb-2 focus:outline-none focus:border-auto-accent transition-colors text-auto-text text-sm cursor-pointer appearance-none"
            >
              {brands.map(brand => (
                <option key={brand} value={brand} className="bg-white text-black">{brand}</option>
              ))}
            </select>
          </div>

          {/* HP Filter */}
          <div className="w-full md:w-60">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] uppercase tracking-widest font-black opacity-40">Max Power</p>
              <p className="text-[10px] font-black">{maxHp} HP</p>
            </div>
            <input 
              type="range"
              min="0"
              max={absoluteMaxHp}
              value={maxHp}
              onChange={(e) => setMaxHp(parseInt(e.target.value))}
              className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          {/* Reset Filters */}
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedBrand('All Brands');
              setMaxHp(absoluteMaxHp);
            }}
            className="text-[10px] uppercase tracking-widest font-black text-red-600 hover:text-black transition-colors pb-2"
          >
            Reset
          </button>
        </div>

        {/* Updated grid with better spacing and vertical stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 pb-12">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white border border-black/5 rounded-3xl p-6 md:p-10 min-h-[480px] md:min-h-[540px] flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2"
              onClick={() => handleCarClick(car)}
            >
              <div className="z-10">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-1 md:mb-2">{car.make}</h3>
                <p className="text-black/40 font-bold text-[10px] md:text-sm tracking-widest uppercase">{car.model}</p>
              </div>

              <div className="flex-grow flex items-center justify-center relative my-4 md:my-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full blur-3xl scale-150" />
                <OptimizedImage 
                  src={car.image} 
                  alt={car.model} 
                  priority={index < 3}
                  className="w-full h-full max-h-[200px] md:max-h-[280px] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2 drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div className="z-10 flex justify-between items-end border-t border-black/5 pt-6 md:pt-8">
                <div>
                  <p className="text-[8px] md:text-[10px] text-black/30 uppercase tracking-[0.2em] font-black mb-1 md:mb-2">Investment</p>
                  <p className="font-sans text-xl md:text-2xl font-black text-[#dc2626]">{car.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] md:text-[10px] text-black/30 uppercase tracking-[0.2em] font-black mb-1 md:mb-2">Output</p>
                  <p className="font-sans text-xl md:text-2xl font-black">{car.hp} HP</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg uppercase tracking-widest font-bold">No matching vehicles found.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-auto-accent font-bold uppercase tracking-widest text-sm hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
