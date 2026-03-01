"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showNavigation?: boolean;
  onImageClick?: (imageUrl: string) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  alt,
  className = '',
  size = 'medium',
  showNavigation = true,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Filter out empty images
  const validImages = images.filter(img => img && img !== '');

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, validImages.length]);

  // Touch navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0].clientX;
    setTouchStart(touch);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // Swipe left - next image
      } else {
        handlePrevious(); // Swipe right - previous image
      }
    }
    
    setTouchStart(null);
  };

  if (!images || images.length === 0 || images.every(img => !img || img === '')) {
    return (
      <div className={`${className} bg-davys-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <svg className="w-12 h-12 text-davys-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-davys-gray-500">Sin imagen</p>
        </div>
      </div>
    );
  }

  const currentImage = validImages[currentIndex];
  
  const sizeClasses = {
    small: 'h-16 w-16',
    medium: 'h-32 w-32',
    large: 'h-full w-full' // Cambiado para que ocupe todo el contenedor
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentImage);
    } else {
      window.open(currentImage, '_blank');
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image */}
      <div 
        className={`${sizeClasses[size]} relative rounded-lg overflow-hidden border border-davys-gray-200 cursor-pointer`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentImage}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={handleImageClick}
        />
        
        {/* Overlay with actions - Solo si hay múltiples imágenes */}
        {validImages.length > 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <MagnifyingGlassIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        )}

        {/* Navigation - Solo si hay múltiples imágenes */}
        {showNavigation && validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
              title="Imagen anterior"
            >
              <ChevronLeftIcon className="w-3 h-3 text-davys-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
              title="Siguiente imagen"
            >
              <ChevronRightIcon className="w-3 h-3 text-davys-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1}/{validImages.length}
        </div>
      )}

      {/* Thumbnail Strip */}
      {validImages.length > 1 && size !== 'small' && (
        <div className="flex gap-1 mt-2 overflow-x-auto">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-8 h-8 rounded overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-amaranth-pink-400 scale-110'
                  : 'border-davys-gray-300 hover:border-davys-gray-400'
              }`}
            >
              <Image
                src={image}
                alt={`${alt} - Imagen ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
