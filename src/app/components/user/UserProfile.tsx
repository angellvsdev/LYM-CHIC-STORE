'use client';

import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
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
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>

              {user.age && (
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="font-medium">{user.age} años</p>
                  </div>
                </div>
              )}

              {user.gender && (
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-500">Género</p>
                    <p className="font-medium capitalize">{user.gender}</p>
                  </div>
                </div>
              )}

              {user.phone_number && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-6 w-6 text-amaranth-pink-300" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{user.phone_number}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-amaranth-pink-300 mb-6">Acciones</h2>

            <div className="space-y-4">
              <button className="w-full bg-amaranth-pink-300 hover:bg-amaranth-pink-200 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Editar Perfil
              </button>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
                Mis Pedidos
              </button>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
                Lista de Deseos
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional para usuarios básicos */}
        {user.role === 'user' && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-amaranth-pink-300 mb-4">Beneficios de Usuario</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amaranth-pink-50 rounded-lg">
                <div className="text-2xl mb-2">🎁</div>
                <h3 className="font-medium text-gray-800 mb-2">Ofertas Exclusivas</h3>
                <p className="text-sm text-gray-600">Accede a promociones especiales solo para usuarios registrados.</p>
              </div>

              <div className="text-center p-4 bg-amaranth-pink-50 rounded-lg">
                <div className="text-2xl mb-2">📦</div>
                <h3 className="font-medium text-gray-800 mb-2">Seguimiento de Pedidos</h3>
                <p className="text-sm text-gray-600">Realiza seguimiento detallado de tus compras.</p>
              </div>

              <div className="text-center p-4 bg-amaranth-pink-50 rounded-lg">
                <div className="text-2xl mb-2">❤️</div>
                <h3 className="font-medium text-gray-800 mb-2">Lista de Deseos</h3>
                <p className="text-sm text-gray-600">Guarda tus productos favoritos para comprarlos después.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
