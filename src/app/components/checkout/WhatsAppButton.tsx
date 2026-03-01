'use client';

import React, { useState } from 'react';
import { PhoneIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import WhatsAppService, { OrderData } from './WhatsAppService';

interface WhatsAppButtonProps {
  orderData: OrderData;
  className?: string;
  disabled?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  orderData, 
  className = '', 
  disabled = false 
}) => {
  const [copied, setCopied] = useState(false);

  const handleOpenWhatsApp = () => {
    try {
      WhatsAppService.openWhatsApp(orderData);
    } catch (error) {
      console.error('Error abriendo WhatsApp:', error);
      // Fallback: mostrar el link manualmente
      const link = WhatsAppService.getWhatsAppLink(orderData);
      alert(`Link de WhatsApp: ${link}`);
    }
  };

  const handleCopyLink = async () => {
    try {
      const link = WhatsAppService.getWhatsAppLink(orderData);
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando link:', error);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleOpenWhatsApp}
        disabled={disabled}
        className={`w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <PhoneIcon className="h-5 w-5" />
        <span>Abrir WhatsApp</span>
      </button>
      
      <button
        onClick={handleCopyLink}
        disabled={disabled}
        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span className="text-green-600">¡Link copiado!</span>
          </>
        ) : (
          <>
            <ClipboardDocumentIcon className="h-4 w-4" />
            <span>Copiar link de WhatsApp</span>
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;
