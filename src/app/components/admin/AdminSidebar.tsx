'use client';
import React from 'react';
import { 
    Squares2X2Icon,
    ShoppingBagIcon,
    UsersIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    XMarkIcon,
    WrenchScrewdriverIcon,
    UserIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
    activeSection, 
    setActiveSection, 
    isOpen, 
    setIsOpen 
}) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
        { id: 'orders', label: 'Pedidos', icon: ShoppingBagIcon },
        { id: 'products', label: 'Productos', icon: DocumentTextIcon },
        { id: 'categories', label: 'Categorías', icon: DocumentTextIcon },
        { id: 'customers', label: 'Clientes', icon: UsersIcon }
    ];

    return (
        <>
            {/* Overlay para móviles */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
                w-full lg:w-64 lg:top-[0] lg:bottom-0  /* Espacio para header en desktop */
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-60'}
            `}>
                <div className="relative flex flex-col h-full">
                    {/* Botón retraíble (handle) - Solo en desktop */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
                        className={`hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full shadow-md border border-davys-gray-200 items-center justify-center bg-white text-davys-gray-600 hover:bg-davys-gray-100 transition-colors cursor-pointer translate-x-1`}
                    >
                        {/* Flecha minimalista */}
                        <span className={`inline-block transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                            {/* Chevron simple */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </span>
                    </button>

                    {/* Header del sidebar */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-davys-gray-200 flex-shrink-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amaranth-pink-400 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs sm:text-sm"><WrenchScrewdriverIcon className="w-4 h-4 sm:w-5 sm:h-5" /></span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-davys-gray-100">Panel de Control</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-davys-gray-100 transition-colors flex-shrink-0"
                            aria-label="Cerrar menú"
                        >
                            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-davys-gray-600" />
                        </button>
                    </div>

                    {/* Menú de navegación */}
                    <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto min-h-0">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        // Cerrar sidebar en móviles/tablets después de seleccionar
                                        if (window.innerWidth < 1024) {
                                            setIsOpen(false);
                                        }
                                    }}
                                    className={`
                                        w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base cursor-pointer
                                        ${isActive 
                                            ? 'bg-amaranth-pink-400 text-white shadow-lg' 
                                            : 'text-davys-gray-600 hover:bg-davys-gray-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    <span className="font-medium truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer del sidebar */}
                    <div className="p-3 sm:p-4 border-t border-davys-gray-200 flex-shrink-0">
                        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-davys-gray-900 rounded-xl">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-davys-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold"><UserIcon className="w-4 h-4 sm:w-5 sm:h-5" /></span>
                            </div>
                            <div className="min-w-0 flex-1 font-grotesk">
                                <p className="text-xs sm:text-sm font-medium text-davys-gray-100 truncate">Perfil de Administración</p>
                                <p className="text-xs text-davys-gray-600 truncate">lymchicstore@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;

