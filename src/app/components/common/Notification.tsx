'use client';

import React, { useEffect } from 'react';
import { CheckCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

interface NotificationProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  show,
  message,
  type = 'success',
  duration = 3000,
  onHide
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!show) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgClass: 'bg-green-500',
          icon: <CheckCircleIcon className="h-6 w-6" />
        };
      case 'error':
        return {
          bgClass: 'bg-red-500',
          icon: <CheckCircleIcon className="h-6 w-6" />
        };
      case 'info':
      default:
        return {
          bgClass: 'bg-blue-500',
          icon: <ShoppingCartIcon className="h-6 w-6" />
        };
    }
  };

  const { bgClass, icon } = getStyles();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[200] animate__animated animate__fadeInDown">
      <div className={`${bgClass} text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 min-w-[300px] max-w-md`}>
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm sm:text-base">{message}</p>
        </div>
        <button
          onClick={onHide}
          className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
