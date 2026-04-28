import { useState, useMemo, useEffect } from 'react';
import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import ParallaxShowroom from '../../components/ParallaxShowroom';
import type { ShowroomItem } from '../../components/ParallaxShowroom';
import CarModalContent from '../../components/CarModalContent';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import SEO from '../../components/SEO';
import FloatingControls from '../../components/FloatingControls';

export default function ShowroomPage() {
  const { data: firestoreCars } = useFirestoreCollection<Car>('cars');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
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
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.make);
      const matchesHp = (car.hp || 0) <= maxHp;
      return matchesSearch && matchesBrand && matchesHp;
    });
  }, [allCars, searchQuery, selectedBrands, maxHp]);

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
      
      <FloatingControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        availableBrands={availableBrands}
        maxHp={maxHp}
        setMaxHp={setMaxHp}
        absoluteMaxHp={absoluteMaxHp}
      />

      <ParallaxShowroom items={items} theme="auto" />
    </>
  );
}
