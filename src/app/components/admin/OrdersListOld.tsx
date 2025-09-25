'use client';
import React, { useState } from 'react';
import { 
    EyeIcon,
    PencilIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    UsersIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import FormModal from './modals/FormModal';
import ConfirmModal from './modals/ConfirmModal';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    product: string;
    quantity: number;
    total: number;
    status: 'received' | 'preparing' | 'ready' | 'picked' | 'completed';
    createdAt: string;
    updatedAt: string;
}

const OrdersList: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [orders] = useState<Order[]>([
        {
            id: '1',
            orderNumber: 'PED-2024-0015',
            customerName: 'Laura García',
            customerEmail: 'laura.garcia@email.com',
            customerPhone: '+1 555-123-4567',
            product: 'Set de Tazas de Cerámica',
            quantity: 1,
            total: 45.99,
            status: 'received',
            createdAt: '2024-10-27 10:00 AM',
            updatedAt: '2024-10-27 10:00 AM'
        },
        {
            id: '2',
            orderNumber: 'PED-2024-0014',
            customerName: 'Carlos Rodríguez',
            customerEmail: 'carlos.rodriguez@email.com',
            customerPhone: '+1 555-987-6543',
            product: 'Vaso de Vidrio',
            quantity: 2,
            total: 32.50,
            status: 'preparing',
            createdAt: '2024-10-27 09:30 AM',
            updatedAt: '2024-10-27 09:45 AM'
        },
        {
            id: '3',
            orderNumber: 'PED-2024-0013',
            customerName: 'María López',
            customerEmail: 'maria.lopez@email.com',
            customerPhone: '+1 555-456-7890',
            product: 'Plato de Porcelana',
            quantity: 1,
            total: 28.75,
            status: 'ready',
            createdAt: '2024-10-27 09:00 AM',
            updatedAt: '2024-10-27 09:30 AM'
        }
    ]);

    const getStatusInfo = (status: Order['status']) => {
        switch (status) {
            case 'received':
                return { label: 'Pedido Recibido', color: 'bg-blue-100 text-blue-800', icon: ClockIcon };
            case 'preparing':
                return { label: 'En Preparación', color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon };
            case 'ready':
                return { label: 'Listo para Recoger', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon };
            case 'picked':
                return { label: 'Recogido', color: 'bg-purple-100 text-purple-800', icon: CheckCircleIcon };
            case 'completed':
                return { label: 'Completado', color: 'bg-gray-100 text-gray-800', icon: CheckCircleIcon };
            default:
                return { label: 'Desconocido', color: 'bg-gray-100 text-gray-800', icon: ClockIcon };
        }
    };

    const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Lógica para agregar pedido
        setTimeout(() => {
            setIsSubmitting(false);
            setShowAddModal(false);
        }, 1000);
    };

    const handleEditOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Lógica para editar pedido
        setTimeout(() => {
            setIsSubmitting(false);
            setShowEditModal(false);
            setSelectedOrder(null);
        }, 1000);
    };

    const handleStatusChange = async () => {
        // Lógica para cambiar estado del pedido
        console.log('Cambiando estado del pedido:', selectedOrder?.id);
        setShowStatusModal(false);
        setSelectedOrder(null);
    };

    const openEditModal = (order: Order) => {
        setSelectedOrder(order);
        setShowEditModal(true);
    };

    const openStatusModal = (order: Order) => {
        setSelectedOrder(order);
        setShowStatusModal(true);
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg lg:w-2/3 xl:w-11/12 xl:mx-auto">
            <div className="p-4 sm:p-6 border-b border-davys-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-davys-gray-100">Pedidos Recientes</h2>
                    <div className="flex items-center space-x-3">
                        <button 
                            className="flex items-center space-x-2 bg-amaranth-pink-400 hover:bg-amaranth-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors"
                            onClick={() => setShowAddModal(true)}
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm font-medium">Nuevo Pedido</span>
                        </button>
                        <button className="text-amaranth-pink-400 hover:text-amaranth-pink-500 text-sm font-medium">
                            Ver todos
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Vista de tarjetas para móviles */}
            <div className="block lg:hidden p-4 space-y-4">
                {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                        <div key={order.id} className="bg-white rounded-2xl shadow-lg border-l-4 border-amaranth-pink-400 p-4 relative">
                            {/* Badge de estado en la esquina superior derecha */}
                            <div className="absolute top-4 right-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                </span>
                            </div>
                            
                            {/* Contenido principal */}
                            <div className="pr-20">
                                {/* Título principal */}
                                <h3 className="text-lg font-bold text-davys-gray-100 mb-2">
                                    {order.orderNumber}
                                </h3>
                                
                                {/* Información del cliente */}
                                <div className="flex items-center text-sm text-davys-gray-600 mb-2">
                                    <UsersIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                    <span>{order.customerName}</span>
                                </div>
                                
                                {/* Información del producto */}
                                <div className="text-sm text-davys-gray-600 mb-2">
                                    <span className="font-medium">{order.product}</span>
                                    <span className="text-davys-gray-500"> • Cantidad: {order.quantity}</span>
                                </div>
                                
                                {/* Fecha y hora */}
                                <div className="flex items-center text-sm text-davys-gray-600 mb-3">
                                    <ClockIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                    <span>{order.createdAt}</span>
                                </div>
                                
                                {/* Total */}
                                <div className="text-lg font-bold text-davys-gray-100 mb-3">
                                    ${order.total}
                                </div>
                                
                                {/* Botones de acción */}
                                <div className="flex space-x-2">
                                    <button 
                                        className="flex-1 bg-amaranth-pink-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amaranth-pink-500 transition-colors"
                                        onClick={() => console.log('Ver detalles del pedido:', order.id)}
                                    >
                                        <EyeIcon className="w-4 h-4 inline mr-2" />
                                        Ver Detalles
                                    </button>
                                    <button 
                                        className="px-4 py-2 border border-davys-gray-300 text-davys-gray-600 rounded-lg text-sm font-medium hover:bg-davys-gray-50 transition-colors"
                                        onClick={() => openEditModal(order)}
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
                                Pedido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Total
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
                        {orders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;
                            
                            return (
                                <tr key={order.id} className="hover:bg-davys-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-davys-gray-100">
                                                {order.orderNumber}
                                            </div>
                                            <div className="text-sm text-davys-gray-600">
                                                {order.createdAt}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-davys-gray-100">
                                                {order.customerName}
                                            </div>
                                            <div className="text-sm text-davys-gray-600">
                                                {order.customerEmail}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-davys-gray-100">
                                            {order.product}
                                        </div>
                                        <div className="text-sm text-davys-gray-600">
                                            Cantidad: {order.quantity}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-davys-gray-100">
                                            ${order.total}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => openStatusModal(order)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${statusInfo.color}`}
                                        >
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {statusInfo.label}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                className="text-amaranth-pink-400 hover:text-amaranth-pink-500"
                                                onClick={() => console.log('Ver detalles del pedido:', order.id)}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="text-davys-gray-400 hover:text-davys-gray-600"
                                                onClick={() => openEditModal(order)}
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
                onSubmit={handleAddOrder}
                title="Nuevo Pedido"
                description="Completa la información del nuevo pedido"
                isSubmitting={isSubmitting}
            >
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Nombre del Cliente
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
                        Email del Cliente
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
                        Producto
                    </label>
                    <select className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent">
                        <option value="">Seleccionar producto</option>
                        <option value="Set de Tazas de Cerámica">Set de Tazas de Cerámica</option>
                        <option value="Vaso de Vidrio">Vaso de Vidrio</option>
                        <option value="Plato de Porcelana">Plato de Porcelana</option>
                        <option value="Cuchara de Acero">Cuchara de Acero</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        placeholder="1"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Total
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        placeholder="0.00"
                        required
                    />
                </div>
            </FormModal>

            <FormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedOrder(null);
                }}
                onSubmit={handleEditOrder}
                title="Editar Pedido"
                description="Modifica la información del pedido"
                isSubmitting={isSubmitting}
            >
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Nombre del Cliente
                    </label>
                    <input
                        type="text"
                        defaultValue={selectedOrder?.customerName}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Email del Cliente
                    </label>
                    <input
                        type="email"
                        defaultValue={selectedOrder?.customerEmail}
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
                        defaultValue={selectedOrder?.customerPhone}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Producto
                    </label>
                    <input
                        type="text"
                        defaultValue={selectedOrder?.product}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        min="1"
                        defaultValue={selectedOrder?.quantity}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                        Total
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedOrder?.total}
                        className="w-full px-3 py-2 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent"
                        required
                    />
                </div>
            </FormModal>

            <ConfirmModal
                isOpen={showStatusModal}
                onClose={() => {
                    setShowStatusModal(false);
                    setSelectedOrder(null);
                }}
                onConfirm={handleStatusChange}
                title="Cambiar Estado del Pedido"
                description={`¿Deseas cambiar el estado del pedido ${selectedOrder?.orderNumber}?`}
                variant="success"
                confirmText="Cambiar Estado"
            />
        </div>
    );
};

export default OrdersList;

