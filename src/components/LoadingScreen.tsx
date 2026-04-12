import { motion } from 'motion/react';
import { useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M 20 80 L 20 20 L 50 60 L 80 20 L 80 80"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.0, ease: "easeInOut" }}
          />
        </svg>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1.0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-xs tracking-[0.3em] uppercase whitespace-nowrap"
        >
          Masembe Group
        </motion.div>
      </div>
    </motion.div>
  );
}
