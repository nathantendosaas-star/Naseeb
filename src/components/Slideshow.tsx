import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

// Dynamically import all jpg images from the public assets folder, excluding any with "logo" in the name
const importImages = import.meta.glob('/assets/new_re/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const images = Object.entries(importImages)
  .filter(([path]) => !/logo/i.test(path))
  .map(([, url]) => url);

interface SlideshowProps {
  /** Autoplay delay in milliseconds */
  delay?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ delay = 3500 }) => {
  return (
    <Swiper
      modules={[Autoplay, EffectFade, Navigation]}
      effect="fade"
      autoplay={{ delay, disableOnInteraction: false }}
      loop
      navigation
      className="w-full h-[60vh]"
    >
      {images.map((src, idx) => (
        <SwiperSlide key={idx}>
          <img
            src={src}
            alt={`Slideshow image ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slideshow;
