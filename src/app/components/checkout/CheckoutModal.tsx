'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import BaseModal from '../admin/modals/BaseModal';
import { 
  XMarkIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import PaymentMethodSelector from './PaymentMethodSelector';
import OrderSummary from './OrderSummary';
import WhatsAppButton from './WhatsAppButton';
import WhatsAppService from './WhatsAppService';
import { OrderData } from './WhatsAppService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentDetails {
  method: 'cash' | 'mobile_payment';
  bank?: string;
  phoneNumber?: string;
  reference?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'cash'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDataForWhatsApp, setOrderDataForWhatsApp] = useState<OrderData | null>(null);
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);

  const totalPrice = getTotalPrice();

  const handlePaymentMethodChange = (details: PaymentDetails) => {
    setPaymentDetails(details);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Debes estar logueado para realizar una compra');
      return;
    }

    setIsProcessing(true);

    try {
      // Generar número de pedido único
      const orderNumber = `PED-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      // Preparar datos del pedido
      const orderData = {
        orderNumber,
        userId: user.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,
        paymentMethod: paymentDetails.method,
        paymentDetails: paymentDetails,
        customerInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone_number || 'No especificado'
        }
      };

      // Guardar datos del pedido para el botón WhatsApp
      setOrderDataForWhatsApp(orderData);
      setShowWhatsAppButton(true);
      
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppComplete = () => {
    // Limpiar carrito y cerrar modal después de usar WhatsApp
    clearCart();
    setShowWhatsAppButton(false);
    onClose();
  };

  if (!user) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} closeOnOverlay={!isProcessing}>
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full sm:h-auto max-h-[100vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amaranth-pink-300 to-amaranth-pink-200 p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <ShoppingCartIcon className="h-6 w-6 sm:h-8 sm:w-8 text-amaranth-pink-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Finalizar Compra</h2>
                <p className="text-amaranth-pink-100 text-sm sm:text-base">Confirma tu pedido y método de pago</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-white hover:text-amaranth-pink-100 transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Información del cliente */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-amaranth-pink-300" />
                Información del Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="font-medium">{user.phone_number || 'No especificado'}</span>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <OrderSummary items={items} totalPrice={totalPrice} />

            {/* Método de pago */}
            <PaymentMethodSelector 
              onPaymentMethodChange={handlePaymentMethodChange}
              disabled={isProcessing}
            />

            {/* Información importante */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Proceso de Compra</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Al hacer clic en "Realizar Compra", se abrirá WhatsApp</li>
                <li>• Enviarás un mensaje automático con los detalles de tu pedido</li>
                <li>• La gerente te contactará para confirmar y procesar el pago</li>
                <li>• Una vez confirmado el pago, tu pedido aparecerá en tu historial</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 sm:p-6 rounded-b-2xl">
          {!showWhatsAppButton ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <PhoneIcon className="h-4 w-4" />
                    <span>Realizar Compra</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orderDataForWhatsApp && (
                <WhatsAppButton 
                  orderData={orderDataForWhatsApp} 
                  disabled={isProcessing}
                />
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWhatsAppButton(false)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Volver
                </button>
                <button
                  onClick={handleWhatsAppComplete}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-amaranth-pink-300 hover:bg-amaranth-pink-200 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default CheckoutModal;
