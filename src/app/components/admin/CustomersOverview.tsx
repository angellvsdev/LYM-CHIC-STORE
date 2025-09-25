'use client';
import React, { useState } from 'react';
import { 
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    EyeIcon,
    PencilIcon,
    ShoppingBagIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import FormModal from './modals/FormModal';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    registeredAt: string;
    status: 'active' | 'inactive';
}

const CustomersOverview: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [customers] = useState<Customer[]>([
        {
            id: '1',
            name: 'Laura García',
            email: 'laura.garcia@email.com',
            phone: '+1 555-123-4567',
            totalOrders: 5,
            totalSpent: 234.50,
            lastOrder: '2024-10-27',
            registeredAt: '2024-09-15',
            status: 'active'
        },
        {
            id: '2',
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@email.com',
            phone: '+1 555-987-6543',
            totalOrders: 3,
            totalSpent: 156.75,
            lastOrder: '2024-10-25',
            registeredAt: '2024-10-01',
            status: 'active'
        },
        {
            id: '3',
            name: 'María López',
            email: 'maria.lopez@email.com',
            phone: '+1 555-456-7890',
            totalOrders: 8,
            totalSpent: 445.20,
            lastOrder: '2024-10-20',
            registeredAt: '2024-08-20',
            status: 'active'
        },
        {
            id: '4',
            name: 'Juan Pérez',
            email: 'juan.perez@email.com',
            phone: '+1 555-321-6540',
            totalOrders: 1,
            totalSpent: 28.75,
            lastOrder: '2024-10-15',
            registeredAt: '2024-10-10',
            status: 'inactive'
        }
    ]);

    const getStatusInfo = (status: Customer['status']) => {
        switch (status) {
            case 'active':
                return { label: 'Activo', color: 'bg-green-100 text-green-800' };
            case 'inactive':
                return { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' };
            default:
                return { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
        }
    };

    const getCustomerTier = (totalSpent: number) => {
        if (totalSpent >= 400) return { label: 'VIP', color: 'text-purple-600' };
        if (totalSpent >= 200) return { label: 'Regular', color: 'text-blue-600' };
        return { label: 'Nuevo', color: 'text-green-600' };
    };

    const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Lógica para agregar cliente
        setTimeout(() => {
            setIsSubmitting(false);
            setShowAddModal(false);
        }, 1000);
    };

    const handleEditCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Lógica para editar cliente
        setTimeout(() => {
            setIsSubmitting(false);
            setShowEditModal(false);
            setSelectedCustomer(null);
        }, 1000);
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowEditModal(true);
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg lg:w-3/4 xl:w-11/12 xl:mx-auto">
            <div className="p-4 sm:p-6 border-b border-davys-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-davys-gray-100">Clientes</h2>
                    <div className="flex items-center space-x-3">
                        <button 
                            className="flex items-center space-x-2 bg-amaranth-pink-400 hover:bg-amaranth-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors"
                            onClick={() => setShowAddModal(true)}
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm font-medium">Agregar</span>
                        </button>
                        <button className="text-amaranth-pink-400 hover:text-amaranth-pink-500 text-sm font-medium">
                            Ver todos
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Vista de tarjetas para móviles */}
            <div className="block lg:hidden p-4 space-y-4">
                {customers.map((customer) => {
                    const statusInfo = getStatusInfo(customer.status);
                    const tierInfo = getCustomerTier(customer.totalSpent);
                    
                    return (
                        <div key={customer.id} className="bg-white rounded-2xl shadow-lg border-l-4 border-amaranth-pink-400 p-4 relative">
                            {/* Badge de estado en la esquina superior derecha */}
                            <div className="absolute top-4 right-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                </span>
                            </div>
                            
                            {/* Contenido principal */}
                            <div className="pr-20">
                                {/* Título principal */}
                                <h3 className="text-lg font-bold text-davys-gray-100 mb-2">
                                    {customer.name}
                                </h3>
                                
                                {/* Información de contacto */}
                                <div className="space-y-1 mb-2">
                                    <div className="flex items-center text-sm text-davys-gray-600">
                                        <EnvelopeIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                        <span className="truncate">{customer.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-davys-gray-600">
                                        <PhoneIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                        <span>{customer.phone}</span>
                                    </div>
                                </div>
                                
                                {/* Información de pedidos */}
                                <div className="flex items-center text-sm text-davys-gray-600 mb-2">
                                    <ShoppingBagIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                    <span>{customer.totalOrders} pedidos</span>
                                    <span className="ml-2 text-xs text-davys-gray-500">
                                        (Último: {customer.lastOrder})
                                    </span>
                                </div>
                                
                                {/* Fecha de registro */}
                                <div className="flex items-center text-sm text-davys-gray-600 mb-3">
                                    <CalendarIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                    <span>Registrado: {customer.registeredAt}</span>
                                </div>
                                
                                {/* Total gastado */}
                                <div className="text-lg font-bold text-davys-gray-100 mb-3">
                                    ${customer.totalSpent}
                                    <span className={`ml-2 text-sm font-medium ${tierInfo.color}`}>
                                        ({tierInfo.label})
                                    </span>
                                </div>
                                
                                {/* Botones de acción */}
                                <div className="flex space-x-2">
                                    <button 
                                        className="flex-1 bg-amaranth-pink-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amaranth-pink-500 transition-colors"
                                        onClick={() => console.log('Ver cliente:', customer.id)}
                                    >
                                        <EyeIcon className="w-4 h-4 inline mr-2" />
                                        Ver Perfil
                                    </button>
                                    <button 
                                        className="px-4 py-2 border border-davys-gray-300 text-davys-gray-600 rounded-lg text-sm font-medium hover:bg-davys-gray-50 transition-colors"
                                        onClick={() => openEditModal(customer)}
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Vista de tabla para desktop */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-davys-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Contacto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Pedidos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Total Gastado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-davys-gray-200">
                        {customers.map((customer) => {
                            const statusInfo = getStatusInfo(customer.status);
                            const tierInfo = getCustomerTier(customer.totalSpent);
                            
                            return (
                                <tr key={customer.id} className="hover:bg-davys-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-amaranth-pink-400 to-pink-lavender-400 rounded-full flex items-center justify-center mr-3">
                                                <UserIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-davys-gray-100">
                                                    {customer.name}
                                                </div>
                                                <div className={`text-xs font-medium ${tierInfo.color}`}>
                                                    {tierInfo.label}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-davys-gray-600">
                                                <EnvelopeIcon className="w-3 h-3 mr-1" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center text-sm text-davys-gray-600">
                                                <PhoneIcon className="w-3 h-3 mr-1" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-davys-gray-100">
                                                {customer.totalOrders}
                                            </div>
                                            <div className="text-xs text-davys-gray-600">
                                                Último: {customer.lastOrder}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-davys-gray-100">
                                            ${customer.totalSpent}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                className="text-amaranth-pink-400 hover:text-amaranth-pink-500"
                                                onClick={() => console.log('Ver cliente:', customer.id)}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="text-davys-gray-400 hover:text-davys-gray-600"
                                                onClick={() => openEditModal(customer)}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modales */}
            <FormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddCustomer}
                title="Agregar Cliente"
                description="Completa la información del nuevo cliente"
                isSubmitting={isSubmitting}
            >
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        placeholder="Ej: Laura García"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        placeholder="cliente@email.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        placeholder="+1 555-123-4567"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Estado
                    </label>
                    <select className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent">
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>
            </FormModal>

            <FormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCustomer(null);
                }}
                onSubmit={handleEditCustomer}
                title="Editar Cliente"
                description="Modifica la información del cliente"
                isSubmitting={isSubmitting}
            >
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        defaultValue={selectedCustomer?.name}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        defaultValue={selectedCustomer?.email}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        defaultValue={selectedCustomer?.phone}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Estado
                    </label>
                    <select 
                        defaultValue={selectedCustomer?.status}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                    >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>
            </FormModal>
        </div>
    );
};

export default CustomersOverview;