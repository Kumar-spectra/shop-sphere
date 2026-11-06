'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  );

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 rounded border-2 overflow-hidden transition-all shrink-0 bg-gray-50 ${
                selectedImage === img
                  ? 'border-amazon-orange shadow-sm ring-1 ring-amazon-orange'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative flex-1 h-80 sm:h-96 md:h-[480px] bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-4">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-contain p-4 hover:scale-110 transition-transform duration-300 cursor-crosshair"
        />
      </div>
    </div>
  );
}

