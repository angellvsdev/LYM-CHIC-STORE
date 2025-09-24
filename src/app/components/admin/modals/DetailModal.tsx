"use client";

import React from 'react';
import BaseModal from './BaseModal';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DetailItem {
    label: string;
    value: string;
}

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: DetailItem[];
}

const DetailModal: React.FC<DetailModalProps> = ({
    isOpen,
    onClose,
    title,
    data
}) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md lg:max-w-lg w-full mx-4 border border-davys-gray-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-davys-gray-200 bg-gradient-to-r from-davys-gray-50 to-white">
                    <h3 className="text-lg sm:text-xl font-bold text-davys-gray-100 pr-4">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-davys-gray-200 text-davys-gray-600 transition-colors flex-shrink-0"
                        aria-label="Cerrar"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                    <div className="space-y-3 sm:space-y-4">
                        {data.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-davys-gray-600 flex-shrink-0 sm:w-2/5">
                                    {item.label}:
                                </span>
                                <span className="text-sm sm:text-base text-davys-gray-100 sm:text-right flex-1 break-words">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 sm:p-6 border-t border-davys-gray-200 bg-davys-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white bg-gradient-to-r from-amaranth-pink-400 to-amaranth-pink-500 hover:from-amaranth-pink-500 hover:to-amaranth-pink-600 rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default DetailModal;
