import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import ParallaxShowroom from '../../components/ParallaxShowroom';
import type { ShowroomItem } from '../../components/ParallaxShowroom';
import CarModalContent from '../../components/CarModalContent';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import SEO from '../../components/SEO';

export default function ShowroomPage() {
  const { data: firestoreCars } = useFirestoreCollection<Car>('cars');
  
  const carsList = firestoreCars.length > 0 ? firestoreCars : staticCars;

  const items: ShowroomItem[] = carsList.map(car => ({
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
      <ParallaxShowroom items={items} theme="auto" />
    </>
  );
}
