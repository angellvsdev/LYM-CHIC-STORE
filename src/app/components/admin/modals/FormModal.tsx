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
    onFieldChange?: (fieldName: string, value: any) => void;
    forceReRender?: boolean; // Para forzar re-render cuando cambian los campos
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
    onFieldChange,
    forceReRender = false,
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [reRenderKey, setReRenderKey] = useState(0); // Forzar re-render de campos
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
        // Call onFieldChange callback if provided
        if (onFieldChange) {
            onFieldChange(name, value);
        }
    };

    // Forzar re-render cuando cambian los campos dinámicamente
    React.useEffect(() => {
        if (forceReRender) {
            setReRenderKey(prev => prev + 1);
        }
    }, [fields, forceReRender]);

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
            <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl mx-auto flex flex-col absolute sm:relative inset-0 sm:inset-auto sm:m-4 overflow-hidden">
                {/* Header - Sticky en móvil */}
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

                {/* Body - Scrollable content */}
                <form onSubmit={handleSubmit} className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        {fields.map((field) => (
                            <div key={`${field.name}-${reRenderKey}`} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
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

                    {/* Footer - Sticky en móvil */}
                    <div className="sticky bottom-0 bg-white border-t border-davys-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
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

export default FormModal;
