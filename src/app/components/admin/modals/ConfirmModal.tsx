'use client';
import React from 'react';
import BaseModal from './BaseModal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description?: string;
    variant?: 'success' | 'warning' | 'danger';
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const variantStyles = {
    success: {
        iconBg: 'bg-green-50 border border-green-200',
        iconColor: 'text-green-600',
        confirm: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl',
    },
    warning: {
        iconBg: 'bg-yellow-50 border border-yellow-200',
        iconColor: 'text-yellow-600',
        confirm: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl',
    },
    danger: {
        iconBg: 'bg-red-50 border border-red-200',
        iconColor: 'text-red-600',
        confirm: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl',
    }
} as const;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    variant = 'danger',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isLoading = false
}) => {
    const styles = variantStyles[variant];

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className="rounded-2xl bg-white shadow-2xl border border-davys-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-davys-gray-200 bg-gradient-to-r from-davys-gray-50 to-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
                                <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-davys-gray-100">{title}</h3>
                                {description && (
                                    <p className="text-sm text-davys-gray-600 mt-1 leading-relaxed">{description}</p>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="p-2 rounded-lg hover:bg-davys-gray-200 text-davys-gray-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            aria-label="Cerrar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-5 sm:py-6">
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                        <button 
                            onClick={onClose} 
                            disabled={isLoading} 
                            className="flex-1 bg-davys-gray-100 hover:bg-davys-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-davys-gray-700 rounded-xl h-11 sm:h-12 px-4 font-medium transition-all duration-200 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 rounded-xl h-11 sm:h-12 px-4 font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${styles.confirm}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando…
                                </div>
                            ) : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default ConfirmModal;
