import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'wide' | 'property' | 'car';
  fallbackText?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  aspectRatio = 'auto',
  fallbackText,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]',
    property: 'aspect-[4/5]',
    car: 'aspect-[16/10]',
  };

  if (hasError) {
    return (
      <div className={cn(
        'relative overflow-hidden bg-black/10 flex flex-col items-center justify-center gap-2',
        aspectRatioClasses[aspectRatio],
        className
      )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {fallbackText && (
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'relative overflow-hidden bg-black/5',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/5 via-black/10 to-black/5" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-ignore
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
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
