'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { UserCircleIcon, PhoneIcon, PencilIcon, ArchiveBoxIcon, ArrowRightOnRectangleIcon, EnvelopeIcon, CalendarIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShoppingCartIcon, HomeIcon, HashtagIcon } from '@heroicons/react/24/outline';
import UserSettingsModal from './modals/UserSettingsModal';
import MyOrdersModal from './modals/MyOrdersModal';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Early return DESPUÉS de todos los hooks
  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const handleSettingsSuccess = () => {
    // Forzar recarga de datos del usuario desde la API para asegurar persistencia
    const refreshUserData = async () => {
      setIsRefreshing(true);
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            const refreshedUser = {
              id: data.user.user_id?.toString() || '1',
              name: data.user.name || 'Usuario',
              email: data.user.email_address || '',
              role: (data.user.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
              phone_number: data.user.phone_number,
              registration_date: data.user.registration_date,
              age: data.user.age,
              gender: data.user.gender,
            };
            
            // Actualizar contexto - esto automáticamente actualizará el componente
            updateUser(refreshedUser);
          }
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      } finally {
        setIsRefreshing(false);
      }
    };
    
    refreshUserData();
    console.log('Perfil actualizado exitosamente');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-amaranth-pink-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amaranth-pink-300 to-amaranth-pink-200 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center space-x-6">
            <div className="bg-white rounded-full p-4 shadow-md">
              <UserCircleIcon className="h-16 w-16 text-amaranth-pink-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-gray-200 text-lg">{user.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                user.role === 'admin'
                  ? 'bg-amaranth-pink-600 text-white'
                  : 'bg-white text-amaranth-pink-300'
              }`}>
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>
        </div>

        {/* Información del perfil */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Información personal */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-amaranth-pink-300 mb-6">Información Personal</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-6 w-6 text-amaranth-pink-300" />
                <div>
                  <p className="text-sm text-gray-500">Nombre completo</p>
                  <p className="font-medium text-gray-400">{user.name}</p>
                </div>
              </div>

              {user.age ? (
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="font-medium text-gray-400">{user.age} años</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-400">Edad</p>
                    <p className="font-medium text-gray-400">No especificada</p>
                  </div>
                </div>
              )}

              {user.gender ? (
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-400">Género</p>
                    <p className="font-medium capitalize text-gray-400">{user.gender}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-400">Género</p>
                    <p className="font-medium text-gray-400">No especificado</p>
                  </div>
                </div>
              )}

              {user.phone_number ? (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="font-medium text-gray-400">{user.phone_number}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 opacity-60">
                  <PhoneIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="font-medium text-gray-400">No especificado</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-amaranth-pink-300 mb-6">Acciones</h2>

            <div className="space-y-4">
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <PencilIcon className="h-5 w-5" />
                <span>Editar Perfil</span>
              </button>

              <button 
                onClick={() => setIsOrdersModalOpen(true)}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ArchiveBoxIcon className="h-5 w-5" />
                <span>Mis Pedidos</span>
              </button>

              <button 
                onClick={handleCartClick}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Carrito</span>
              </button>

              <button
                onClick={handleLogout}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>

              <button
                onClick={handleHomeRedirect}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Ir al Inicio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional para usuarios básicos */}
        {user.role === 'user' && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-amaranth-pink-300 mb-4">Beneficios de Usuario</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-amaranth-pink-50 rounded-lg">
                <div className="text-2xl mb-2">📦</div>
                <h3 className="font-medium text-gray-800 mb-2">Seguimiento de Pedidos</h3>
                <p className="text-sm text-gray-600">Realiza seguimiento detallado de tus compras.</p>
              </div>

              <div className="text-center p-4 bg-amaranth-pink-50 rounded-lg">
                <div className="text-2xl mb-2">🛒</div>
                <h3 className="font-medium text-gray-800 mb-2">Mí Carrito</h3>
                <p className="text-sm text-gray-600">Guarda tus productos favoritos para comprarlos después.</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal de configuración */}
        <UserSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSuccess={handleSettingsSuccess}
        />

        {/* Modal de pedidos */}
        <MyOrdersModal
          isOpen={isOrdersModalOpen}
          onClose={() => setIsOrdersModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default UserProfile;
