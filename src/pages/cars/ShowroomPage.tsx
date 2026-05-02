import { useState, useMemo, useEffect } from 'react';
import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import ParallaxShowroom from '../../components/ParallaxShowroom';
import type { ShowroomItem } from '../../components/ParallaxShowroom';
import CarModalContent from '../../components/CarModalContent';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import SEO from '../../components/SEO';
import FloatingControls from '../../components/FloatingControls';

const parsePrice = (priceStr: string) => {
  const numeric = priceStr.replace(/[^0-9]/g, '');
  return parseInt(numeric) || 0;
};

export default function ShowroomPage() {
  const { data: firestoreCars } = useFirestoreCollection<Car>('cars');
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

  const items: ShowroomItem[] = filteredCars.map(car => ({
    id: car.id,
    title: `${car.make} ${car.model}`,
    watermark: car.watermarkText,
    image: car.image,
    rotation: car.rotation,
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

      <ParallaxShowroom items={items} theme="auto" />
    </>
  );
}

