import { useState, useCallback } from 'react';

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

interface UseImageUploadOptions {
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onSuccess?: (image: UploadedImage) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedImages: UploadedImage[];
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const {
    maxSize = 5,
    acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedImages: [],
  });

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Only ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} are allowed.`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSize}MB.`;
    }

    return null;
  }, [acceptedTypes, maxSize]);

  const uploadFile = useCallback(async (file: File): Promise<UploadedImage | null> => {
    const validationError = validateFile(file);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      onError?.(validationError);
      return null;
    }

    setState(prev => ({ ...prev, isUploading: true, progress: 0, error: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress (in a real implementation, you'd use XMLHttpRequest for progress tracking)
      const progressInterval = setInterval(() => {
        setState(prev => {
          if (prev.progress < 90) {
            return { ...prev, progress: prev.progress + 10 };
          }
          return prev;
        });
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setState(prev => ({ ...prev, progress: 100 }));

      const result = await response.json();

      if (result.success) {
        const uploadedImage: UploadedImage = result.data;
        setState(prev => ({
          ...prev,
          uploadedImages: [...prev.uploadedImages, uploadedImage],
          isUploading: false,
          error: null,
        }));
        onSuccess?.(uploadedImage);
        return uploadedImage;
      } else {
        const errorMessage = result.error || 'Upload failed';
        setState(prev => ({
          ...prev,
          isUploading: false,
          error: errorMessage,
        }));
        onError?.(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = 'Upload failed. Please try again.';
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
      return null;
    }
  }, [validateFile, maxSize, onSuccess, onError]);

  const uploadMultipleFiles = useCallback(async (files: File[]): Promise<UploadedImage[]> => {
    const results: UploadedImage[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  }, [uploadFile]);

  const removeImage = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index),
    }));
  }, []);

  const clearImages = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadedImages: [],
      error: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      uploadedImages: [],
    });
  }, []);

  return {
    ...state,
    uploadFile,
    uploadMultipleFiles,
    removeImage,
    clearImages,
    clearError,
    reset,
    validateFile,
  };
};

export type { UploadedImage, UseImageUploadOptions };
