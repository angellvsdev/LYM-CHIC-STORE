'use client';
import React, { useState } from 'react';
import { 
    MagnifyingGlassIcon,
    BellIcon,
    Bars3Icon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

interface AdminHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications] = useState([
        { id: 1, message: 'Nuevo pedido recibido: PED-2024-0015', time: '2 min ago', read: false },
        { id: 2, message: 'Producto "Set de Tazas" agotado', time: '1 hora ago', read: false },
        { id: 3, message: 'Cliente Laura García registrado', time: '3 horas ago', read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="fixed top-0 left-0 right-0 z-70 bg-white/90 backdrop-blur border-b border-davys-gray-200">
            <div className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Botón de menú y búsqueda */}
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors lg:hidden"
                        >
                            <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-davys-gray-600" />
                        </button>

                        {/* Barra de búsqueda */}
                        <div className="relative flex-1 w-56 lg:max-w-1/2 mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-davys-gray-200" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="text-davys-gray-100 block w-full pl-8 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-davys-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amaranth-pink-200 focus:border-transparent bg-davys-gray-50"
                            />
                        </div>
                    </div>

                    {/* Notificaciones y perfil */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notificaciones */}
                        <div className="relative">
                            <button className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors relative">
                                <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-davys-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-amaranth-pink-400 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Perfil de usuario */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-davys-gray-100">Administrador</p>
                                <p className="text-xs text-davys-gray-600">admin@lym.com</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amaranth-pink-400 to-pink-lavender-400 rounded-full flex items-center justify-center">
                                <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;

