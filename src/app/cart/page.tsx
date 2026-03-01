'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShoppingCartIcon, TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import ConfirmModal from '@/app/components/common/ConfirmModal';
import CheckoutModal from '@/app/components/checkout/CheckoutModal';

const CartPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Redirigir administradores away del carrito
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin');
      return;
    }
  }, [user, router]);

  const handleBackToProfile = () => {
    router.push('/profile');
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    if (!user) {
      // Redirigir a login si no está autenticado
      router.push('/login');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-amaranth-pink-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amaranth-pink-300 to-amaranth-pink-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToProfile}
                className="text-white hover:text-amaranth-pink-100 transition-colors cursor-pointer"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-full p-2">
                  <ShoppingCartIcon className="h-8 w-8 text-amaranth-pink-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Mi Carrito</h1>
                  <p className="text-amaranth-pink-100">
                    {items.length} {items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="cursor-pointer text-white hover:text-amaranth-pink-100 transition-colors flex items-center space-x-2"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Vaciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Contenido del carrito */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center py-12">
              <ShoppingCartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-500 mb-6">Parece que aún no has agregado productos a tu carrito</p>
              <button
                onClick={() => router.push('/catalog')}
                className="cursor-pointer bg-amaranth-pink-300 hover:bg-amaranth-pink-200 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Explorar Productos
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Imagen del producto */}
                    <div className="relative w-full sm:w-24 h-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <p className="text-xl font-bold text-amaranth-pink-300">${item.price}</p>
                      </div>

                      {/* Controles de cantidad y eliminar */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-400 cursor-pointer hover:bg-gray-500 flex items-center justify-center transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium text-amaranth-pink-300">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-400 hover:bg-gray-500 cursor-pointer flex items-center justify-center transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="cursor-pointer text-red-500 hover:text-red-600 transition-colors flex items-center space-x-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="text-sm">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
                <h2 className="text-xl font-semibold text-amaranth-pink-300 mb-4">Resumen del Pedido</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-medium">Gratis</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-amaranth-pink-300">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="cursor-pointer w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Realizar Compra
                </button>
                <button
                  onClick={handleBackToProfile}
                  className="cursor-pointer w-full mt-3 border border-amaranth-pink-300 text-amaranth-pink-300 hover:bg-amaranth-pink-500 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación para vaciar carrito */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmClearCart}
        title="¿Vaciar Carrito?"
        message="¿Estás seguro de que quieres vaciar todo el carrito? Esta acción no se puede deshacer."
        confirmText="Vaciar Carrito"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de checkout */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
};

export default CartPage;
