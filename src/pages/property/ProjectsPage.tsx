import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { properties } from '../../data/properties';
import OptimizedImage from '../../components/OptimizedImage';

export default function ProjectsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div ref={pageRef} className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-re-bg text-re-text">
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
          {properties.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden mb-6">
                <OptimizedImage 
                  src={project.image} 
                  alt={project.name} 
                  priority={index < 2}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">{project.name}</h2>
              <p className="text-re-gray">{project.location} • {project.completionDate}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
