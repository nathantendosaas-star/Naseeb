import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function IdentitySwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuto = location.pathname.startsWith('/cars');
  const isRe = location.pathname.startsWith('/property');
  const isHome = location.pathname === '/';
  const [transitionTarget, setTransitionTarget] = useState<'auto' | 're' | null>(null);

  const handleSwitch = (target: 'auto' | 're') => {
    if ((target === 'auto' && isAuto) || (target === 're' && isRe)) return;
    
    setTransitionTarget(target);
    
    setTimeout(() => {
      navigate(target === 'auto' ? '/cars' : '/property');
      setTimeout(() => setTransitionTarget(null), 100);
    }, 600);
  };

  return (
    <>
      <div className="flex items-center bg-black/90 backdrop-blur-2xl rounded-full p-1.5 border border-white/10 relative z-50 shadow-2xl">
        <div className="relative flex">
          <button
            onClick={() => handleSwitch('auto')}
            className={cn(
              "relative px-6 py-3 flex items-center justify-center transition-colors z-10 min-w-[140px]",
              isAuto ? "text-white" : "text-white/40 hover:text-white"
            )}
          >
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Grid Motors</span>
          </button>
          <button
            onClick={() => handleSwitch('re')}
            className={cn(
              "relative px-6 py-3 flex items-center justify-center transition-colors z-10 min-w-[140px]",
              isRe ? "text-black" : "text-white/40 hover:text-white"
            )}
          >
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Real Estate</span>
          </button>
          
          {!isHome && (
            <motion.div
              className={cn(
                "absolute top-0 bottom-0 rounded-full z-0 min-w-[140px]",
                isAuto ? "bg-[#dc2626] left-0" : "bg-[#d4af37] left-[140px]"
              )}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {transitionTarget && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, originY: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed inset-0 z-[100] origin-bottom",
              transitionTarget === 're' ? "bg-re-bg" : "bg-auto-bg"
            )}
          />
        )}
      </AnimatePresence>
    </>
  );
}
