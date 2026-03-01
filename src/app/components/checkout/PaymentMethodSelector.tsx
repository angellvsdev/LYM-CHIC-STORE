'use client';

import React, { useState } from 'react';
import { CreditCardIcon, BanknotesIcon, BuildingOfficeIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface PaymentDetails {
  method: 'cash' | 'mobile_payment';
  bank?: string;
  phoneNumber?: string;
  reference?: string;
}

interface PaymentMethodSelectorProps {
  onPaymentMethodChange: (details: PaymentDetails) => void;
  disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  onPaymentMethodChange, 
  disabled = false 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'mobile_payment'>('cash');
  const [mobilePaymentDetails, setMobilePaymentDetails] = useState({
    bank: '',
    phoneNumber: '',
    reference: ''
  });

  const banks = [
    'Mercantil',
    'Banesco',
    'Provincial',
    'Venezuela',
    'BOD',
    'Banco del Tesoro',
    '100% Banco',
    'Banplus',
    'Otro'
  ];

  const handleMethodChange = (method: 'cash' | 'mobile_payment') => {
    setSelectedMethod(method);
    const details: PaymentDetails = { method };
    
    if (method === 'mobile_payment') {
      details.bank = mobilePaymentDetails.bank || 'Mercantil';
      details.phoneNumber = mobilePaymentDetails.phoneNumber;
      details.reference = mobilePaymentDetails.reference;
    }
    
    onPaymentMethodChange(details);
  };

  const handleMobilePaymentChange = (field: keyof typeof mobilePaymentDetails, value: string) => {
    const updatedDetails = { ...mobilePaymentDetails, [field]: value };
    setMobilePaymentDetails(updatedDetails);
    
    onPaymentMethodChange({
      method: 'mobile_payment',
      bank: updatedDetails.bank || 'Mercantil',
      phoneNumber: updatedDetails.phoneNumber,
      reference: updatedDetails.reference
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <CreditCardIcon className="h-5 w-5 mr-2 text-amaranth-pink-300" />
        Método de Pago
      </h3>

      {/* Métodos de pago */}
      <div className="space-y-3 mb-4">
        {/* Efectivo */}
        <label className="flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={selectedMethod === 'cash'}
            onChange={() => handleMethodChange('cash')}
            disabled={disabled}
            className="mr-3 text-amaranth-pink-300 focus:ring-amaranth-pink-300"
          />
          <BanknotesIcon className="h-5 w-5 mr-2 text-green-600" />
          <div className="flex-1">
            <span className="font-medium text-gray-800">Efectivo</span>
            <p className="text-sm text-gray-600">Paga en efectivo al recibir tu pedido</p>
          </div>
        </label>

        {/* Pago Móvil */}
        <label className="flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="mobile_payment"
            checked={selectedMethod === 'mobile_payment'}
            onChange={() => handleMethodChange('mobile_payment')}
            disabled={disabled}
            className="mr-3 text-amaranth-pink-300 focus:ring-amaranth-pink-300"
          />
          <PhoneIcon className="h-5 w-5 mr-2 text-blue-600" />
          <div className="flex-1">
            <span className="font-medium text-gray-800">Pago Móvil</span>
            <p className="text-sm text-gray-600">Transferencia bancaria desde tu móvil</p>
          </div>
        </label>
      </div>

      {/* Detalles de Pago Móvil */}
      {selectedMethod === 'mobile_payment' && (
        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-blue-800 mb-2">Detalles del Pago Móvil</h4>
          
          {/* Banco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banco
            </label>
            <select
              value={mobilePaymentDetails.bank}
              onChange={(e) => handleMobilePaymentChange('bank', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-300 focus:border-amaranth-pink-300"
            >
              <option value="">Selecciona un banco</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono para Pago Móvil
            </label>
            <input
              type="tel"
              value={mobilePaymentDetails.phoneNumber}
              onChange={(e) => handleMobilePaymentChange('phoneNumber', e.target.value)}
              placeholder="Ej: 0414-1234567"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-300 focus:border-amaranth-pink-300"
            />
          </div>

          {/* Referencia (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Referencia (opcional)
            </label>
            <input
              type="text"
              value={mobilePaymentDetails.reference}
              onChange={(e) => handleMobilePaymentChange('reference', e.target.value)}
              placeholder="Últimos 6 dígitos del comprobante"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-300 focus:border-amaranth-pink-300"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Una vez realizado el pago, envía el comprobante con el número de referencia para confirmar tu pedido.
            </p>
          </div>
        </div>
      )}

      {/* Información de Efectivo */}
      {selectedMethod === 'cash' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>Pago en efectivo:</strong> Pagarás al momento de recibir tu pedido. Ten listo el monto exacto para facilitar la transacción.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
