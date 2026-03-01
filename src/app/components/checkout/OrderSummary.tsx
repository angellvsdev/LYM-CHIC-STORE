'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { CartItem } from '@/hooks/useCart';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalPrice }) => {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No hay productos en tu carrito</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ShoppingCartIcon className="h-5 w-5 mr-2 text-amaranth-pink-300" />
        Resumen del Pedido
      </h3>

      {/* Lista de productos */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
            {/* Imagen del producto */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
              <p className="text-sm text-gray-600">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="font-semibold text-amaranth-pink-300">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de totales */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío:</span>
          <span className="font-medium text-green-600">Gratis</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Impuestos:</span>
          <span className="font-medium">Incluidos</span>
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-800">Total:</span>
            <span className="text-amaranth-pink-300">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>📦 Entrega:</strong> Retiro en tienda disponible. 
          Para envío a domicilio, coordina con la gerente vía WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
