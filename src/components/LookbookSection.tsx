import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cars as staticCars, Car } from '@/data/cars';
import { useFirestoreCollection } from '@/hooks/useFirestore';
import LookbookItem from './LookbookItem';
import CarModalContent from './CarModalContent';
import Modal from './Modal';

export default function LookbookSection() {
  const { data: firestoreCars } = useFirestoreCollection<Car>('cars');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  // Merge static and firestore cars
  const allCars = useMemo(() => {
    const carMap = new Map<string, Car>();
    staticCars.forEach(car => carMap.set(car.id, car));
    firestoreCars.forEach(car => carMap.set(car.id, car));
    return Array.from(carMap.values());
  }, [firestoreCars]);

  const selectedCar = useMemo(() => 
    allCars.find(car => car.id === selectedCarId), 
    [allCars, selectedCarId]
  );

  return (
    <section className="bg-[#f8f8f8] py-24 relative">
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
      <div className="flex flex-col gap-12 overflow-hidden">
        {allCars.map((car, index) => (
          <LookbookItem 
            key={car.id} 
            car={car} 
            isReversed={index % 2 !== 0}
            onClick={() => setSelectedCarId(car.id)}
          />
        ))}
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
