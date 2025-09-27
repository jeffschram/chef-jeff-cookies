import React, { useEffect, useState } from 'react';
import { generateCookieImage, cookieVariations, CookieImageOptions } from '../utils/imageGenerator';

interface CookieImageProps {
  packageType: 'nibbler' | 'family' | 'pro';
  variant?: number;
  size?: number;
  className?: string;
}

export default function CookieImage({ 
  packageType, 
  variant = 0, 
  size = 120,
  className = '' 
}: CookieImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const variations = cookieVariations[packageType];
    const options: CookieImageOptions = {
      ...variations[variant % variations.length],
      size
    };
    
    const url = generateCookieImage(options);
    setImageUrl(url);
  }, [packageType, variant, size]);

  if (!imageUrl) {
    return (
      <div 
        className={`bg-gray-200 rounded-full flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        🍪
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={`${packageType} cookie`}
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
