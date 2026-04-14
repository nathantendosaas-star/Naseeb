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
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const cars = firestoreCars.length > 0 ? firestoreCars : staticCars;

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const filteredCars = cars.filter(car =>
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  return (
    <div ref={pageRef} className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-auto-bg text-auto-text">
      <SEO 
        title="Vehicle Inventory | Grid Motors"
        description="Browse our current stock of certified high-performance and luxury automobiles available for immediate purchase in Kampala."
        canonical="/cars/inventory"
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedCar && <CarModalContent car={selectedCar} />}
      </Modal>

      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: yTitle }}
          className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12"
        >
          Inventory
        </motion.h1>

        <div className="mb-12">
          <input
            type="text"
            placeholder="Search by make or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 bg-transparent border-b border-auto-text/20 pb-2 focus:outline-none focus:border-auto-accent transition-colors text-auto-text placeholder-gray-500"
          />
        </div>

        {/* Updated grid with better spacing and vertical stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 pb-12">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white border border-black/5 rounded-3xl p-10 h-[520px] flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2"
              onClick={() => handleCarClick(car)}
            >
              <div className="z-10">
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{car.make}</h3>
                <p className="text-black/40 font-bold text-sm tracking-widest uppercase">{car.model}</p>
              </div>

              <div className="flex-grow flex items-center justify-center relative my-8">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full blur-3xl scale-150" />
                <OptimizedImage 
                  src={car.image} 
                  alt={car.model} 
                  priority={index < 3}
                  className="w-full h-full max-h-[280px] md:max-h-[340px] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2 drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div className="z-10 flex justify-between items-end border-t border-black/5 pt-8">
                <div>
                  <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-black mb-2">Investment</p>
                  <p className="font-sans text-2xl font-black text-[#dc2626]">{car.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-black mb-2">Output</p>
                  <p className="font-sans text-2xl font-black">{car.hp} HP</p>
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
