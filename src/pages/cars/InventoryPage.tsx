import { motion, useScroll, useTransform } from 'motion/react';
import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import { useRef, useState, useMemo, useEffect } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import { useDebounce } from '../../hooks/useDebounce';
import Modal from '../../components/Modal';
import CarModalContent from '../../components/CarModalContent';
import SEO from '../../components/SEO';
import FloatingControls from '../../components/FloatingControls';
import OptimizedImage from '../../components/OptimizedImage';

const parsePrice = (priceStr: string) => {
  const numeric = priceStr.replace(/[^0-9]/g, '');
  return parseInt(numeric) || 0;
};

export default function InventoryPage() {
  const { data: firestoreCars = [] } = useFirestoreCollection<Car>('cars');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [maxHp, setMaxHp] = useState<number>(1000);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Merge static and firestore cars, ensuring unique IDs (Firestore takes precedence)
  const cars = useMemo(() => {
    const carMap = new Map<string, Car>();
    staticCars.forEach((car: Car) => carMap.set(car.id, car));
    firestoreCars.forEach((car: Car) => carMap.set(car.id, car));
    return Array.from(carMap.values());
  }, [firestoreCars]);

  const availableBrands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(cars.map(car => car.make)));
    return uniqueBrands.sort();
  }, [cars]);

  const absoluteMaxPrice = useMemo(() => {
    const max = Math.max(...cars.map(car => parsePrice(car.price)), 0);
    return max > 0 ? max : 1000000;
  }, [cars]);

  const absoluteMaxHp = useMemo(() => {
    const max = Math.max(...cars.map(car => car.hp || 0), 0);
    return max > 0 ? max : 1000;
  }, [cars]);

  // Update filter limits when cars load
  useEffect(() => {
    setMaxPrice(absoluteMaxPrice);
    setMaxHp(absoluteMaxHp);
  }, [absoluteMaxPrice, absoluteMaxHp]);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = car.make.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                           car.model.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.make);
      const matchesPrice = parsePrice(car.price) <= maxPrice;
      const matchesHp = (car.hp || 0) <= maxHp;
      
      return matchesSearch && matchesBrand && matchesPrice && matchesHp;
    });
  }, [cars, debouncedSearchQuery, selectedBrands, maxPrice, maxHp]);

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
    <div ref={pageRef} className="relative min-h-screen pt-32 pb-48 px-6 md:px-12 bg-auto-bg text-auto-text overflow-x-hidden">
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

      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: yTitle }}
          className="text-3xl md:text-6xl font-black tracking-tighter uppercase mb-16 md:mb-24"
        >
          Inventory
        </motion.h1>

        {/* Updated grid with better spacing and vertical stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 pb-12">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 6) * 0.1 }}
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
                  rotation={car.rotation}
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
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-black/10">
            <p className="text-black/20 text-xl uppercase tracking-widest font-black">No vehicles found.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedBrands([]);
                setMaxHp(absoluteMaxHp);
              }}
              className="mt-6 text-red-600 font-black uppercase tracking-widest text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
