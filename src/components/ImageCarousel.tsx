import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import OptimizedImage from './OptimizedImage';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="w-full h-full"
    >
      {images.map((src, idx) => (
        <SwiperSlide key={idx}>
          <OptimizedImage 
            src={src} 
            alt={`Carousel image ${idx + 1}`} 
            priority={idx === 0}
            className="w-full h-full object-cover" 
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
