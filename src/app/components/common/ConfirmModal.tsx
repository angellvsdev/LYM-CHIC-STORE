'use client';

import React from 'react';
import BaseModal from '../admin/modals/BaseModal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIconAndColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />,
          bgClass: 'bg-red-50',
          borderClass: 'border-red-200',
          confirmClass: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          icon: <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />,
          bgClass: 'bg-yellow-50',
          borderClass: 'border-yellow-200',
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'info':
      default:
        return {
          icon: <ExclamationTriangleIcon className="h-12 w-12 text-blue-500" />,
          bgClass: 'bg-blue-50',
          borderClass: 'border-blue-200',
          confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const { icon, bgClass, borderClass, confirmClass } = getIconAndColors();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className={`${bgClass} sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto max-h-[100vh] sm:max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="p-6 sm:p-8 text-center border-b border-gray-200">
          <div className="mx-auto mb-4">
            {icon}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 sm:p-8 bg-white sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onClose}
              className="cursor-pointer w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`cursor-pointer w-full sm:w-auto px-6 py-3 rounded-lg transition-colors font-medium ${confirmClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
