import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import OptimizedImage from '../../components/OptimizedImage';

type BrandFilter = 'All' | string;

function normalizeMake(make: unknown) {
  const value = typeof make === 'string' ? make.trim() : '';
  return value.length > 0 ? value : 'Other';
}

export default function BrandShowroomSection() {
  const { data: firestoreCars = [], isLoading: loading } = useFirestoreCollection<Car>('cars');
  const [activeBrand, setActiveBrand] = useState<BrandFilter>('All');

  const cars = useMemo(() => {
    const carMap = new Map<string, Car>();
    staticCars.forEach((car: Car) => carMap.set(car.id, car));
    firestoreCars.forEach((car: Car) => carMap.set(car.id, car));
    return Array.from(carMap.values());
  }, [firestoreCars]);

  const brands = useMemo(() => {
    const makeSet = new Set<string>();
    cars.forEach((car: Car) => makeSet.add(normalizeMake(car.make)));
    return Array.from(makeSet).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  const groupedByBrand = useMemo(() => {
    const groups = new Map<string, Car[]>();
    cars.forEach((car) => {
      const make = normalizeMake(car.make);
      if (activeBrand !== 'All' && make !== activeBrand) return;
      const existing = groups.get(make);
      if (existing) existing.push(car);
      else groups.set(make, [car]);
    });

    // Keep a stable group order matching the brand list (plus any late "Other" group)
    const ordered = new Map<string, Car[]>();
    brands.forEach((brand) => {
      const brandCars = groups.get(brand);
      if (brandCars && brandCars.length > 0) ordered.set(brand, brandCars);
    });
    groups.forEach((value, key) => {
      if (!ordered.has(key)) ordered.set(key, value);
    });

    return ordered;
  }, [activeBrand, brands, cars]);

  const brandChips: BrandFilter[] = useMemo(() => ['All', ...brands], [brands]);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-4">
            Browse by Brand
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
            Find your next <span className="text-red-600">drive</span>
          </h2>
        </div>
        <div className="text-sm text-gray-500 max-w-xl leading-relaxed">
          Pick a brand to see what’s available right now — no slideshow, just a clean list by make.
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {brandChips.map((brand) => {
          const isActive = brand === activeBrand;
          return (
            <button
              key={brand}
              type="button"
              onClick={() => setActiveBrand(brand)}
              className={[
                'px-5 py-2 border-2 text-xs font-black uppercase tracking-widest transition-colors',
                isActive ? 'bg-black text-white border-black' : 'bg-white text-black border-black/20 hover:border-black',
              ].join(' ')}
            >
              {brand}
            </button>
          );
        })}
      </div>

      <div className="mt-12 space-y-16">
        {loading && cars.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-black/20">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-black/50">
              Loading inventory…
            </p>
          </div>
        ) : groupedByBrand.size === 0 ? (
          <div className="py-24 text-center border border-dashed border-black/20">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-black/50">
              No cars found for this brand.
            </p>
            <button
              type="button"
              onClick={() => setActiveBrand('All')}
              className="mt-4 text-red-600 font-black uppercase tracking-widest text-xs hover:underline"
            >
              Show all brands
            </button>
          </div>
        ) : (
          Array.from(groupedByBrand.entries()).map(([make, makeCars]) => (
            <div key={make}>
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                  {make}
                </h3>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-black/40">
                  {makeCars.length} {makeCars.length === 1 ? 'car' : 'cars'}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {makeCars.map((car, index) => (
                  <Link
                    key={car.id}
                    to={`/cars/inventory/${car.id}`}
                    className="group block bg-white border border-black/10 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.2)] hover:-translate-y-1"
                  >
                    <div className="p-5 md:p-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-black/40">
                          {car.year}
                        </p>
                        <p className="mt-2 text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                          {car.model}
                        </p>
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.35em] text-red-600">
                          {car.price}
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1 border border-black/15 rounded-full text-black/60">
                        {car.status ?? 'Available'}
                      </span>
                    </div>

                    <div className="px-5 md:px-6 pb-6">
                      <OptimizedImage
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        priority={index < 3 && activeBrand !== 'All'}
                        aspectRatio="car"
                        className="rounded-2xl bg-black/5"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
