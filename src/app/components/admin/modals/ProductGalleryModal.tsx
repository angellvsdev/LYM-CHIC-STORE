"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ProductGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
  initialIndex?: number;
}

const ProductGalleryModal: React.FC<ProductGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  productName,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Ensure currentIndex stays within bounds when images change
  useEffect(() => {
    if (images && images.length > 0) {
      const validImages = images.filter(img => img && img !== '');
      if (initialIndex >= validImages.length) {
        setCurrentIndex(0);
      } else if (initialIndex < 0) {
        setCurrentIndex(Math.max(0, validImages.length - 1));
      }
    }
  }, [images, initialIndex]);

  if (!isOpen || !images || images.length === 0 || images.every(img => !img || img === '')) return null;

  // Filter out empty images
  const validImages = images.filter(img => img && img !== '');
  if (validImages.length === 0) return null;

  const currentImage = validImages[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        title="Cerrar"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {validImages.length}
      </div>

      {/* Main Image Container */}
      <div 
        className="relative max-w-4xl max-h-[80vh] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImage}
          alt={`${productName} - Imagen ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-[80vh] object-contain"
          priority
        />
      </div>

      {/* Navigation Buttons */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            title="Imagen anterior"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            title="Siguiente imagen"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-white scale-110'
                  : 'border-gray-400 hover:border-gray-300'
              }`}
              title={`Imagen ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
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

export default ProductGalleryModal;
