"use client";

import React, { useState, useCallback, useRef } from 'react';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void;
  onImageRemove: () => void;
  currentImage?: string;
  className?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  currentImage,
  className = '',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  multiple = false,
  maxImages = 1,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Only ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} are allowed.`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB.`);
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadedImage: UploadedImage = result.data;
        
        if (multiple) {
          const newImages = [...uploadedImages, uploadedImage].slice(0, maxImages);
          setUploadedImages(newImages);
          onImageUpload(uploadedImage);
        } else {
          setUploadedImages([uploadedImage]);
          onImageUpload(uploadedImage);
        }
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (multiple) {
      const filesToUpload = files.slice(0, maxImages - uploadedImages.length);
      filesToUpload.forEach(file => uploadFile(file));
    } else if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, [multiple, maxImages, uploadedImages.length]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (multiple) {
      const filesToUpload = Array.from(files).slice(0, maxImages - uploadedImages.length);
      filesToUpload.forEach(file => uploadFile(file));
    } else {
      uploadFile(files[0]);
    }
  }, [multiple, maxImages, uploadedImages.length]);

  const handleRemoveImage = (index?: number) => {
    if (multiple && index !== undefined) {
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      if (newImages.length === 0) {
        onImageRemove();
      }
    } else {
      setUploadedImages([]);
      onImageRemove();
    }
  };

  const handleClick = () => {
    if (!isUploading && (!multiple || uploadedImages.length < maxImages)) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {(!multiple || uploadedImages.length < maxImages) && (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-amaranth-pink-400 bg-amaranth-pink-50' 
              : 'border-davys-gray-300 hover:border-amaranth-pink-400 hover:bg-davys-gray-50'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            multiple={multiple}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center space-y-3">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-400"></div>
                <p className="text-davys-gray-600 font-medium">Subiendo...</p>
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="h-12 w-12 text-davys-gray-400" />
                <div>
                  <p className="text-davys-gray-700 font-medium">
                    {multiple ? 'Drop images here or click to upload' : 'Drop image here or click to upload'}
                  </p>
                  <p className="text-davys-gray-500 text-sm mt-1">
                    {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {maxSize}MB
                  </p>
                  {multiple && (
                    <p className="text-davys-gray-500 text-sm">
                      {uploadedImages.length}/{maxImages} imagenes
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Current Image Display */}
      {currentImage && uploadedImages.length === 0 && (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border border-davys-gray-200">
            <Image
              src={currentImage}
              alt="Current image"
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={() => onImageRemove()}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-davys-gray-500 mt-2">Current image</p>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative rounded-lg overflow-hidden border border-davys-gray-200">
                <Image
                  src={image.url}
                  alt={`Uploaded image ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-davys-gray-500">
                <p>{image.format.toUpperCase()} • {(image.size / 1024).toFixed(1)}KB</p>
                <p>{image.width} × {image.height}px</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!currentImage && uploadedImages.length === 0 && !isUploading && (
        <div className="text-center py-8">
          <PhotoIcon className="h-12 w-12 text-davys-gray-300 mx-auto mb-3" />
          <p className="text-davys-gray-500 text-sm">No image uploaded</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
