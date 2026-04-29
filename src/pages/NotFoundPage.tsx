import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-black tracking-[0.6em] uppercase text-white/30 mb-6">
          Error 404
        </p>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-8">
          Lost?
        </h1>
        <p className="text-white/50 text-lg mb-16 max-w-md leading-relaxed">
          This page doesn't exist. Head back to find what you're looking for.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-10 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/cars"
            className="px-10 py-4 border border-white/20 text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
          >
            Grid Motors
          </Link>
          <Link
            to="/property"
            className="px-10 py-4 border border-white/20 text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
          >
            Real Estate
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
