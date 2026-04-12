import React from 'react';
import { motion } from 'motion/react';
// Remove unused import

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    location: string;
    image: string;
    images?: string[];
  };
  onClick: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group relative h-[500px] overflow-hidden rounded-sm cursor-pointer"
      onClick={() => onClick(property.id)}
    >
      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/20" />
      <img
        src={property.image}
        alt={`${property.name} – ${property.location}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 text-white">
        <p className="text-[#d4af37] text-sm font-bold uppercase mb-2">{property.location}</p>
        <h3 className="text-2xl font-bold">{property.name}</h3>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
