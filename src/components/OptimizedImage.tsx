import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'wide' | 'property' | 'car';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  aspectRatio = 'auto',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]',
    property: 'aspect-[4/5]',
    car: 'aspect-[16/10]',
  };

  return (
    <div className={cn(
      'relative overflow-hidden bg-black/5',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {/* Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/5 via-black/10 to-black/5" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-ignore - fetchpriority is a valid attribute but might not be in all React types yet
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
