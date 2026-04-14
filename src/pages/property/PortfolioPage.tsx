import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import OptimizedImage from '../../components/OptimizedImage';

// Dynamically import all images from new_re folder
const allNewReImages = import.meta.glob('/public/assets/new_re/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const galleryImages = Object.values(allNewReImages).filter(src => !src.toLowerCase().includes('logo'));

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 text-center"
        >
          Portfolio Lookbook
        </motion.h1>

        <Swiper
          modules={[EffectCards, Autoplay, Navigation]}
          effect={'cards'}
          grabCursor={true}
          navigation
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          className="w-full max-w-[400px] md:max-w-[500px] mt-12"
        >
          {galleryImages.map((src, index) => (
            <SwiperSlide key={index} className="rounded-2xl overflow-hidden border border-white/10">
              <OptimizedImage 
                src={src} 
                alt={`Portfolio slide ${index}`} 
                priority={index < 3}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        <p className="text-center text-white/50 text-sm mt-16 tracking-widest uppercase italic">Swipe to Explore</p>
      </div>
    </div>
  );
}
