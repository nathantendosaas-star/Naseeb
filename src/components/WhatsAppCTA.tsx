import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function WhatsAppCTA() {
  const location = useLocation();
  const isAuto = location.pathname.startsWith('/cars');
  const isHome = location.pathname === '/';

  if (isHome) return null;

  const message = isAuto 
    ? "Hi Grid Motors, I'm interested in your luxury fleet."
    : "Hi Masembe Group, I'm interested in your real estate portfolio.";

  const whatsappUrl = `https://wa.me/256750508658?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className={cn(
        "fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110",
        isAuto ? "bg-auto-accent text-white" : "bg-re-accent text-black"
      )}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 rounded-full opacity-50"
        style={{ backgroundColor: isAuto ? '#dc2626' : '#d4af37' }}
      />
      <MessageCircle size={28} className="relative z-10" />
    </motion.a>
  );
}
