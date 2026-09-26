import { motion } from 'motion/react';
import { useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-[#0A0A0C] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="relative flex flex-col items-center">
        <div className="w-24 h-24 mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M 20 80 L 20 20 L 50 60 L 80 20 L 80 80"
              fill="none"
              stroke="#C5A880"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </svg>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-[#F7F7F5] text-[10px] font-bold tracking-[0.4em] uppercase font-sans whitespace-nowrap"
        >
          Masembe Companies
        </motion.div>
      </div>
    </motion.div>
  );
}
