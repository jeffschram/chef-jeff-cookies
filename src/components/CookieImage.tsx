import React from 'react';

interface CookieImageProps {
  product: {
    defaultImage: string;
    images: { [key: number]: string };
  };
  quantity?: number;
  className?: string;
}

export default function CookieImage({ 
  product, 
  quantity = 0, 
  className = '' 
}: CookieImageProps) {
  // Use the image for the specific quantity, or fall back to the default image
  const imagePath = quantity > 0 && product.images[quantity] 
    ? `/images/${product.images[quantity]}`
    : `/images/${product.defaultImage}`;

  return (
    <img 
      src={imagePath} 
      alt="Cookie"
      className={`cookie-image ${className}`}
    />
  );
}
