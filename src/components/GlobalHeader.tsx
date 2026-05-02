import { Link, useLocation } from 'react-router-dom';
import IdentitySwitcher from './IdentitySwitcher';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';

import OptimizedImage from './OptimizedImage';

export default function GlobalHeader() {
  const location = useLocation();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuto = location.pathname.startsWith('/cars');
  const isHome = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 100);
    });
  }, [scrollY]);

  if (isHome) return null;

  const isDark = !isScrolled && isAuto;

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
    { name: 'Projects', path: '/property/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const links = isAuto ? autoLinks : reLinks;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-40 px-4 md:px-12 py-4 md:py-6 flex items-center justify-between transition-colors duration-300",
        isDark ? "text-white" : (isAuto ? "text-auto-text" : "text-re-text")
      )}>
        <div className={cn(
          "flex items-center z-50 p-2 md:p-3 rounded-2xl transition-all duration-300",
          isDark ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl" : ""
        )}>
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter hover:scale-110 transition-transform mr-4 md:mr-8 border-r border-current pr-4 md:pr-6">
            M
          </Link>
          <Link to={isAuto ? "/cars" : "/property"} className="flex items-center">
            {isAuto ? (
              <OptimizedImage 
                src="/GRID_LOGO.jpg" 
                alt="Grid Motors" 
                priority 
                className={cn("h-6 md:h-10 w-18 md:w-32 bg-transparent transition-all", isDark && "brightness-0 invert")} 
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <span className="text-lg md:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Masembe Group</span>
            )}
          </Link>
        </div>
        
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-50">
          <IdentitySwitcher isDark={isDark} />
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
              <IdentitySwitcher isDark={false} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
