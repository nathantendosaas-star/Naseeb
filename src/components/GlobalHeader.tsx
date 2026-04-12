import { Link, useLocation } from 'react-router-dom';
import IdentitySwitcher from './IdentitySwitcher';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function GlobalHeader() {
  const location = useLocation();
  const isAuto = location.pathname.startsWith('/cars');
  const isHome = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  if (isHome) return null;

  const autoLinks = [
    { name: 'Home', path: '/cars' },
    { name: 'Showroom', path: '/cars/showroom' },
    { name: 'Inventory', path: '/cars/inventory' },
    { name: 'Workshop', path: '/cars/workshop' },
    { name: 'Import', path: '/cars/import' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const reLinks = [
    { name: 'Home', path: '/property' },
    { name: 'Showroom', path: '/property/showroom' },
    { name: 'Portfolio', path: '/property/portfolio' },
    { name: 'Projects', path: '/property/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const links = isAuto ? autoLinks : reLinks;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-6 flex items-center justify-between",
        isAuto ? "text-auto-text" : "text-re-text"
      )}>
        <div className="flex items-center z-50">
          <Link to="/" className="text-3xl font-black tracking-tighter hover:scale-110 transition-transform mr-8 border-r border-current pr-6">
            M
          </Link>
          <Link to={isAuto ? "/cars" : "/property"} className="flex items-center">
            {isAuto ? (
              <img src="/GRID_LOGO.jpg" alt="Grid Motors" className="h-8 md:h-10 object-contain" />
            ) : (
              <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">Masembe Group</span>
            )}
          </Link>
        </div>
        
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-50">
          <IdentitySwitcher />
        </div>

        <button 
          onClick={() => setMenuOpen(true)}
          className="p-2 hover:opacity-70 transition-opacity z-50"
        >
          <Menu size={24} />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto p-8",
              isAuto ? "bg-auto-bg text-auto-text" : "bg-re-bg text-re-text"
            )}
          >
            <button 
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-6 md:right-12 p-2 hover:opacity-70 transition-opacity"
            >
              <X size={32} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {links.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl md:text-5xl font-black tracking-tighter uppercase hover:scale-105 transition-transform"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-12">
              <IdentitySwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
