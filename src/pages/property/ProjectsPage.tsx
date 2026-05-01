import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { properties as staticProperties } from '../../data/properties';
import type { Property } from '../../data/properties';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import OptimizedImage from '../../components/OptimizedImage';
import SEO from '../../components/SEO';
import FloatingControls from '../../components/FloatingControls';

const parsePrice = (priceStr: string) => {
  const numeric = priceStr.replace(/[^0-9]/g, '');
  return parseInt(numeric) || 0;
};

export default function ProjectsPage() {
  const { data: firestoreProperties } = useFirestoreCollection<Property>('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const pageRef = useRef<HTMLDivElement>(null);

  // Merge static and firestore properties, ensuring unique IDs (Firestore takes precedence)
  const properties = useMemo(() => {
    const propertyMap = new Map<string, Property>();
    staticProperties.forEach(prop => propertyMap.set(prop.id, prop));
    firestoreProperties.forEach(prop => propertyMap.set(prop.id, prop));
    return Array.from(propertyMap.values());
  }, [firestoreProperties]);

  const availableLocations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(properties.map(p => p.location)));
    return uniqueLocations.sort();
  }, [properties]);

  const absoluteMaxPrice = useMemo(() => {
    const max = Math.max(...properties.map(p => parsePrice(p.price)), 0);
    return max > 0 ? max : 5000000;
  }, [properties]);

  // Update filter limits when properties load
  useEffect(() => {
    setMaxPrice(absoluteMaxPrice);
  }, [absoluteMaxPrice]);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prop.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(prop.location);
    const matchesPrice = parsePrice(prop.price) <= maxPrice;
    
    return matchesSearch && matchesLocation && matchesPrice;
  });

  return (
    <div ref={pageRef} className="relative min-h-screen pt-32 pb-48 px-6 md:px-12 bg-re-bg text-re-text overflow-x-hidden">
      <SEO 
        title="Our Projects | Masembe Real Estate"
        description="Explore our current and upcoming real estate projects across Kampala's most prestigious locations."
        canonical="/property/projects"
      />
      
      <FloatingControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={selectedLocations}
        setSelectedCategories={setSelectedLocations}
        availableCategories={availableLocations}
        categoryLabel="Locations"
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        absoluteMaxPrice={absoluteMaxPrice}
      />

      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: yTitle }}
          className="text-4xl md:text-8xl font-black tracking-tighter uppercase mb-4 text-center"
        >
          Our Projects
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-re-gray mb-16 text-center"
        >
          Building landmarks across the skyline.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12">
          {filteredProperties.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden mb-6 rounded-sm">
                <OptimizedImage 
                  src={project.image} 
                  alt={project.name} 
                  priority={index < 2}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">{project.name}</h2>
                  <p className="text-re-gray">{project.location} • {project.completionDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-mono font-bold text-white">{project.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-32 border border-dashed border-white/10">
            <p className="text-white/20 text-xl uppercase tracking-widest font-black">No projects found.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedLocations([]);
                setMaxPrice(absoluteMaxPrice);
              }}
              className="mt-6 text-re-accent font-black uppercase tracking-widest text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
