import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

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
          <img src={src} alt={`Carousel image ${idx + 1}`} className="w-full h-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
