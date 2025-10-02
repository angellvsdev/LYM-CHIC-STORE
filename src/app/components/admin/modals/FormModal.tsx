'use client';
import React, { useState } from 'react';
import BaseModal from './BaseModal';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox';
    required?: boolean;
    options?: { value: string; label: string }[];
}

interface FormModalProps {
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
}

const FormModal: React.FC<FormModalProps> = ({
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
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const isFirstRender = React.useRef(true);

    // Initialize form data when modal opens
    React.useEffect(() => {
        if (isOpen) {
            // Only set initial data on first open or when opening after close
            setFormData(initialData || {});
        }
        // Cleanup on unmount or when modal closes
        return () => {
            if (!isOpen && !isFirstRender.current) {
                setFormData({});
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleInputChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const renderField = (field: FormField) => {
        const value = formData[field.name] || '';
        
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
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
                    <div className="flex items-center">
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
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={value}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={field.required}
                        step={field.type === 'number' ? '0.01' : undefined}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-davys-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent text-sm sm:text-base text-davys-gray-100 bg-white transition-all duration-200"
                    />
                );
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className="rounded-xl sm:rounded-2xl bg-white shadow-2xl border border-davys-gray-200 overflow-hidden w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-davys-gray-200 bg-gradient-to-r from-davys-gray-50 to-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <h3 className="text-lg sm:text-xl font-bold text-davys-gray-100">{title}</h3>
                            {description && (
                                <p className="text-sm text-davys-gray-600 mt-1 leading-relaxed">{description}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-davys-gray-200 text-davys-gray-600 transition-colors cursor-pointer flex-shrink-0"
                            aria-label="Cerrar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 sm:py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-h-[60vh] overflow-y-auto">
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
                    <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 bg-davys-gray-100 hover:bg-davys-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-davys-gray-700 rounded-xl h-11 sm:h-12 px-4 font-medium transition-all duration-200 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-amaranth-pink-400 to-amaranth-pink-500 hover:from-amaranth-pink-500 hover:to-amaranth-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl h-11 sm:h-12 px-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando…
                                </div>
                            ) : submitText}
                        </button>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
};

export default FormModal;
