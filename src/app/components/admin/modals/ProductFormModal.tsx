'use client';
import React, { useState } from 'react';
import BaseModal from './BaseModal';
import ImageGallery from '@/app/components/common/ImageGallery';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox';
    required?: boolean;
    options?: { value: string; label: string }[];
}

interface UploadedImage {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    size: number;
}

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, any>) => void | Promise<void>;
    title: string;
    description?: string;
    submitText?: string;
    cancelText?: string;
    isSubmitting?: boolean;
    fields: FormField[];
    initialData?: Record<string, any>;
    currentImage?: string;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    submitText = 'Guardar',
    cancelText = 'Cancelar',
    isSubmitting = false,
    fields,
    initialData = {},
    currentImage,
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    // Initialize form data when modal opens or initialData changes
    React.useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {});

            // Handle existing images from product cleanly
            const imagesToLoad: UploadedImage[] = [];

            if (initialData?.images && Array.isArray(initialData.images)) {
                initialData.images.forEach(url => {
                    if (url && typeof url === 'string' && url.trim() !== '') {
                        imagesToLoad.push({
                            url,
                            publicId: '',
                            width: 1200, // Dummy fallback for existing previews
                            height: 1200,
                            format: 'jpg',
                            size: 1024
                        });
                    }
                });
            } else if (initialData?.image && typeof initialData.image === 'string' && initialData.image.trim() !== '') {
                imagesToLoad.push({
                    url: initialData.image,
                    publicId: '',
                    width: 1200,
                    height: 1200,
                    format: 'jpg',
                    size: 1024
                });
            }

            setUploadedImages(imagesToLoad);
        } else {
            // Clean up when modal closes
            setUploadedImages([]);
            setFormData({});
        }
    }, [isOpen, JSON.stringify(initialData)]);

    const handleInputChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImagesChange = (images: UploadedImage[]) => {
        setUploadedImages(images);
        // Correctly update form data with ALL images strings arrays immediately
        setFormData(prev => ({
            ...prev,
            images: images.map(img => img.url),
            // Set the fallback image for legacy structure
            image: images.length > 0 ? images[0].url : ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Include all images in the submitted data
        const submissionData = {
            ...formData,
            images: uploadedImages.map(img => img.url), // ✅ Extraer solo URLs
            // Keep image field for backward compatibility
            image: uploadedImages.length > 0 ? uploadedImages[0].url : ''
        };
        await onSubmit(submissionData);
    };

    const renderField = (field: FormField) => {
        const value = formData[field.name] || '';

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        key={field.name}
                        id={field.name}
                        name={field.name}
                        value={value}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={field.required}
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-davys-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent text-sm sm:text-base text-davys-gray-100 bg-white transition-all duration-200"
                    />
                );
            case 'select':
                return (
                    <select
                        key={field.name}
                        id={field.name}
                        name={field.name}
                        value={value}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={field.required}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-davys-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent text-sm sm:text-base text-davys-gray-100 bg-white transition-all duration-200"
                    >
                        <option value="">Seleccionar...</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <div key={field.name} className="flex items-center">
                        <input
                            type="checkbox"
                            id={field.name}
                            name={field.name}
                            checked={Boolean(value)}
                            onChange={(e) => handleInputChange(field.name, e.target.checked)}
                            className="w-4 h-4 text-amaranth-pink-400 bg-white border-davys-gray-300 rounded focus:ring-amaranth-pink-400 focus:ring-2"
                        />
                        <label htmlFor={field.name} className="ml-2 text-sm text-davys-gray-100">
                            {field.label}
                        </label>
                    </div>
                );
            default:
                return (
                    <input
                        key={field.name}
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={value || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={field.required}
                        step={field.type === 'number' ? '0' : value}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-davys-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent text-sm sm:text-base text-davys-gray-100 bg-white transition-all duration-200"
                    />
                );
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl mx-auto flex flex-col absolute sm:relative inset-0 sm:inset-auto sm:m-4 overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-davys-gray-200 bg-gradient-to-r from-davys-gray-50 to-white">
                    <h3 className="text-lg sm:text-xl font-bold text-davys-gray-100">
                        {title}
                    </h3>
                    {description && (
                        <p className="mt-1 text-sm text-davys-gray-400">
                            {description}
                        </p>
                    )}
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        {/* Image Gallery Field */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-davys-gray-600 mb-2">
                                Galería de Imágenes del Producto
                            </label>
                            <ImageGallery
                                images={uploadedImages}
                                onImagesChange={handleImagesChange}
                                maxImages={6}
                                allowMultiple={true}
                                className="w-full"
                            />
                        </div>

                        {/* Other Fields */}
                        {fields.map((field) => (
                            <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                {field.type !== 'checkbox' && (
                                    <label htmlFor={field.name} className="block text-sm font-semibold text-davys-gray-600 mb-2">
                                        {field.label}
                                        {field.required && <span className="text-amaranth-pink-500 ml-1">*</span>}
                                    </label>
                                )}
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="sticky bg-white border-t border-davys-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-davys-gray-700 rounded-lg sm:rounded-xl hover:bg-davys-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white bg-gradient-to-r from-amaranth-pink-400 to-amaranth-pink-500 rounded-lg sm:rounded-xl hover:from-amaranth-pink-500 hover:to-amaranth-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amaranth-pink-400 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            {isSubmitting ? 'Guardando...' : submitText}
                        </button>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
};

export default ProductFormModal;
