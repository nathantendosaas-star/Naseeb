import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';

interface StatNodeProps {
  key?: React.Key;
  label: string;
  value: string | number;
  suffix?: string;
  index: number;
  isActive: boolean;
}

export default function StatNode({ label, value, suffix = '', index, isActive }: StatNodeProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(typeof value === 'number' ? 0 : value);
  const valueRef = useRef({ val: 0 });

  useEffect(() => {
    if (isActive && typeof value === 'number') {
      const delay = 0.4 + (index * 0.15);
      gsap.to(valueRef.current, {
        val: value,
        duration: 1.5,
        delay: delay,
        ease: "power2.out",
        onUpdate: () => {
          setDisplayValue(Math.round(valueRef.current.val));
        }
      });
    } else if (!isActive && typeof value === 'number') {
      valueRef.current.val = 0;
      // Using requestAnimationFrame to defer state update avoids cascading render errors
      requestAnimationFrame(() => setDisplayValue(0));
    } else {
      setDisplayValue(value);
    }
  }, [isActive, value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.6, 
        delay: isActive ? 0.4 + (index * 0.15) : 0,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="flex flex-col"
    >
      <span className="text-xs md:text-sm font-bold tracking-widest uppercase opacity-50 mb-1">
        {label}
      </span>
      <span className="text-2xl md:text-4xl font-light tracking-tight">
        {displayValue}{suffix}
      </span>
    </motion.div>
  );
}
