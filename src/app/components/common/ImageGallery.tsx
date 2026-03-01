"use client";

import React, { useCallback } from 'react';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useImageUpload, UploadedImage } from '@/hooks/useImageUpload';

interface ImageGalleryProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  showPreview?: boolean;
  allowMultiple?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  className = '',
  showPreview = true,
  allowMultiple = true,
}) => {
  const {
    isUploading,
    progress,
    error,
    uploadedImages,
    uploadFile,
    uploadMultipleFiles,
    removeImage,
    clearImages,
    clearError,
  } = useImageUpload({
    maxSize,
    acceptedTypes,
    onSuccess: () => {
      // No manejamos el estado aquí, lo hacemos en las funciones específicas
    },
    onError: (errorMessage) => {
      console.error('Upload error:', errorMessage);
    },
  });

  // Filter out empty images
  const validImages = images ? images.filter(img => img && img.url && img.url.trim() !== '') : [];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => 
      acceptedTypes.includes(file.type)
    );

    if (imageFiles.length === 0) {
      return;
    }

    if (allowMultiple) {
      const filesToUpload = imageFiles.slice(0, maxImages - validImages.length);
      const newImages = await uploadMultipleFiles(filesToUpload);
      if (newImages.length > 0) {
        const updatedImages = [...validImages, ...newImages].slice(0, maxImages);
        onImagesChange(updatedImages);
      }
    } else if (imageFiles.length > 0) {
      const newImage = await uploadFile(imageFiles[0]);
      if (newImage) {
        onImagesChange([newImage]);
      }
    }
  }, [acceptedTypes, allowMultiple, maxImages, validImages.length, uploadFile, uploadMultipleFiles, onImagesChange]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => 
      acceptedTypes.includes(file.type)
    );

    if (imageFiles.length === 0) {
      return;
    }

    if (allowMultiple) {
      const filesToUpload = imageFiles.slice(0, maxImages - images.length);
      const newImages = await uploadMultipleFiles(filesToUpload);
      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages].slice(0, maxImages);
        onImagesChange(updatedImages);
      }
    } else {
      const newImage = await uploadFile(imageFiles[0]);
      if (newImage) {
        onImagesChange([newImage]);
      }
    }
  }, [acceptedTypes, allowMultiple, maxImages, images.length, uploadFile, uploadMultipleFiles, onImagesChange]);

  const handleRemoveImage = useCallback((index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const handleClearAll = useCallback(() => {
    onImagesChange([]);
    clearImages();
  }, [onImagesChange, clearImages]);

  if (validImages.length === 0 && !isUploading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isUploading 
              ? 'border-amaranth-pink-400 bg-amaranth-pink-50' 
              : 'border-davys-gray-300 hover:border-amaranth-pink-400 hover:bg-davys-gray-50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            multiple={allowMultiple}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-3">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-400"></div>
                  <div className="w-full max-w-xs">
                    <div className="bg-davys-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amaranth-pink-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-davys-gray-600 mt-2">{progress}%</p>
                  </div>
                  <p className="text-davys-gray-600 font-medium">Subiendo imagen{allowMultiple ? 'es' : ''}...</p>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-12 w-12 text-davys-gray-400" />
                  <div>
                    <p className="text-davys-gray-700 font-medium">
                      {allowMultiple ? 'Arrastra imágenes aquí o haz clic para subir' : 'Arrastra una imagen aquí o haz clic para subir'}
                    </p>
                    <p className="text-davys-gray-500 text-sm mt-1">
                      {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} hasta {maxSize}MB
                    </p>
                    <p className="text-davys-gray-500 text-sm">
                      {validImages.length}/{maxImages} imagen{maxImages !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        <div className="text-center py-8">
          <PhotoIcon className="h-12 w-12 text-davys-gray-300 mx-auto mb-3" />
          <p className="text-davys-gray-500 text-sm">No hay imágenes subidas</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {validImages.length < maxImages && (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isUploading 
              ? 'border-amaranth-pink-400 bg-amaranth-pink-50' 
              : 'border-davys-gray-300 hover:border-amaranth-pink-400 hover:bg-davys-gray-50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            multiple={allowMultiple}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-3">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-400"></div>
                  <div className="w-full max-w-xs">
                    <div className="bg-davys-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amaranth-pink-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-davys-gray-600 mt-2">{progress}%</p>
                  </div>
                  <p className="text-davys-gray-600 font-medium">Subiendo imagen{allowMultiple ? 'es' : ''}...</p>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-12 w-12 text-davys-gray-400" />
                  <div>
                    <p className="text-davys-gray-700 font-medium">
                      {allowMultiple ? 'Arrastra imágenes aquí o haz clic para subir' : 'Arrastra una imagen aquí o haz clic para subir'}
                    </p>
                    <p className="text-davys-gray-500 text-sm mt-1">
                      {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} hasta {maxSize}MB
                    </p>
                    <p className="text-davys-gray-500 text-sm">
                      {validImages.length}/{maxImages} imagen{maxImages !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {validImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-davys-gray-700">
              Imágenes subidas ({validImages.length})
            </h3>
            {validImages.length > 1 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Eliminar todas
              </button>
            )}
          </div>
          
          <div className={`grid gap-4 ${
            validImages.length === 1 ? 'grid-cols-1' : 
            validImages.length === 2 ? 'grid-cols-2' : 
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {validImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative rounded-lg overflow-hidden border border-davys-gray-200">
                  {showPreview && image.url ? (
                    <>
                      <Image
                        src={image.url}
                        alt={`Imagen ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 opacity-0 group-hover:bg-opacity-50 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(image.url, '_blank')}
                            className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Ver imagen completa"
                          >
                            <MagnifyingGlassIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            title="Eliminar imagen"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-32 bg-davys-gray-100 flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-davys-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Image Info */}
                <div className="mt-2 text-xs text-davys-gray-500">
                  <p>{image?.format?.toUpperCase() || 'N/A'} • {image ? (image.size / 1024).toFixed(1) : '0'}KB</p>
                  <p>{image?.width || 0} × {image?.height || 0}px</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
