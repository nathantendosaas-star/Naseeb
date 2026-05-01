import React from 'react';
import { motion } from 'motion/react';
import { properties } from '../../data/properties';
import OptimizedImage from '../../components/OptimizedImage';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function FutureConceptsPage() {
  const collection = properties.find(p => p.id === 'innovation-plans');

  if (!collection) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6 md:px-12">
      <SEO 
        title="Future Concepts | Masembe Real Estate"
        description="Visionary architectural renders and urban development plans for the future."
      />
      
      <div className="max-w-7xl mx-auto">
        <Link to="/property/projects" className="inline-flex items-center gap-2 text-re-accent mb-12 hover:underline">
          <ArrowLeft size={20} /> Back to Projects
        </Link>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-8xl font-black tracking-tighter uppercase mb-8"
        >
          Future Concepts
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collection.gallery.map((src, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/3] rounded-sm overflow-hidden group"
            >
              {src.endsWith('.mp4') ? (
                <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <OptimizedImage src={src} alt="Future Concepts Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
