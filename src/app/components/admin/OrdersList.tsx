"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
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
import DetailModal from './modals/DetailModal';

// Types matching the API response
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
    notes?: string;
    deliveryMethod: 'pickup' | 'delivery';
    address?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const OrdersList: React.FC = () => {
    const dateFormatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC' });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/orders');
            if (response.data.success) {
                setOrders(response.data.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch customers for order creation
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/api/admin/customers');
            if (response.data.success) {
                setCustomers(response.data.data.data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    // Fetch products for order creation
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/admin/products');
            if (response.data.success) {
                setProducts(response.data.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, []);

    const getStatusInfo = (status: Order['status']) => {
        switch (status) {
            case 'received':
                return { 
                    label: 'Recibido', 
                    color: 'bg-blue-100 text-blue-800',
                    icon: ClockIcon
                };
            case 'preparing':
                return { 
                    label: 'Preparando', 
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: ExclamationTriangleIcon
                };
            case 'ready':
                return { 
                    label: 'Listo', 
                    color: 'bg-green-100 text-green-800',
                    icon: CheckCircleIcon
                };
            case 'picked':
                return { 
                    label: 'Recogido', 
                    color: 'bg-purple-100 text-purple-800',
                    icon: UsersIcon
                };
            case 'completed':
                return { 
                    label: 'Completado', 
                    color: 'bg-gray-100 text-gray-800',
                    icon: CheckCircleIcon
                };
            default:
                return { 
                    label: 'Desconocido', 
                    color: 'bg-gray-100 text-gray-800',
                    icon: ClockIcon
                };
        }
    };

    const handleAddOrder = async (formData: Record<string, any>) => {
        try {
            setIsSubmitting(true);
            const selectedProduct = products.find(p => p.id === formData.productId);
            const body = {
                user_id: parseInt(formData.customerId),
                delivery_method: formData.deliveryMethod || 'PICKUP',
                order_details: [{
                    product_id: formData.productId,
                    quantity: parseInt(formData.quantity),
                    unit_price: selectedProduct?.price || 0
                }]
            };
            
            await axios.post('/api/admin/orders', body);
            setShowAddModal(false);
            await fetchOrders();
        } catch (error) {
            console.error('Error creating order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (formData: Record<string, any>) => {
        if (!selectedOrder) return;
        
        try {
            setIsSubmitting(true);
            const body = {
                orderId: selectedOrder.id,
                status: formData.status
            };
            
            await axios.patch('/api/admin/orders', body);
            setShowStatusModal(false);
            await fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openStatusModal = (order: Order) => {
        setSelectedOrder(order);
        setShowStatusModal(true);
    };

    const openDetailModal = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full">
            <div className="p-4 sm:p-6 border-b border-davys-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-davys-gray-100">Órdenes Recientes</h2>
                    <button 
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amaranth-pink-400 to-amaranth-pink-500 hover:from-amaranth-pink-500 hover:to-amaranth-pink-600 text-white px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium w-full sm:w-auto"
                        onClick={() => setShowAddModal(true)}
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span className="text-sm">Nueva Orden</span>
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex flex-col justify-center items-center py-16 sm:py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-400"></div>
                    <span className="mt-4 text-davys-gray-600 text-base sm:text-lg font-medium">Cargando órdenes...</span>
                </div>
            )}

            {/* Orders list */}
            {!loading && (
                <div className="p-4 sm:p-6">
                    {orders.length === 0 ? (
                        <div className="text-center text-davys-gray-500 py-16 sm:py-20">
                            <div className="mx-auto w-16 h-16 bg-davys-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-davys-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium">No hay órdenes disponibles</p>
                            <p className="text-sm text-davys-gray-400 mt-1">Las órdenes aparecerán aquí cuando se creen</p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {orders.slice(0, 5).map((order) => {
                                const statusInfo = getStatusInfo(order.status);
                                const StatusIcon = statusInfo.icon;
                                
                                return (
                                    <div key={order.id} className="border border-davys-gray-200 rounded-xl p-4 sm:p-5 hover:bg-davys-gray-50 transition-all duration-200 hover:shadow-md">
                                        {/* Mobile Layout */}
                                        <div className="block sm:hidden">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold text-davys-gray-100">{order.orderNumber}</h3>
                                                    <p className="text-sm text-davys-gray-600 mt-1">{order.customerName}</p>
                                                </div>
                                                <span className="text-sm font-bold text-davys-gray-100">
                                                    ${order.total.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-davys-gray-600 mb-3">
                                                {order.product} (x{order.quantity})
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {statusInfo.label}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                        onClick={() => openDetailModal(order)}
                                                        title="Ver detalles"
                                                    >
                                                        <EyeIcon className="w-4 h-4 text-davys-gray-600" />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                        onClick={() => openStatusModal(order)}
                                                        title="Cambiar estado"
                                                    >
                                                        <PencilIcon className="w-4 h-4 text-davys-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-davys-gray-500">
                                                {dateFormatter.format(new Date(order.createdAt))}
                                            </div>
                                        </div>

                                        {/* Desktop Layout */}
                                        <div className="hidden sm:block">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <span className="text-sm font-semibold text-davys-gray-100">
                                                                {order.orderNumber}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-davys-gray-100 truncate">
                                                                {order.customerName}
                                                            </p>
                                                            <p className="text-sm text-davys-gray-600 truncate">
                                                                {order.product} (x{order.quantity})
                                                            </p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <span className="text-sm font-bold text-davys-gray-100">
                                                                ${order.total.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {statusInfo.label}
                                                        </span>
                                                        <span className="text-xs text-davys-gray-500">
                                                            {dateFormatter.format(new Date(order.createdAt))}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-6">
                                                    <button
                                                        className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                        onClick={() => openDetailModal(order)}
                                                        title="Ver detalles"
                                                    >
                                                        <EyeIcon className="w-5 h-5 text-davys-gray-600" />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                        onClick={() => openStatusModal(order)}
                                                        title="Cambiar estado"
                                                    >
                                                        <PencilIcon className="w-5 h-5 text-davys-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Add Order Modal */}
            <FormModal
                title="Nueva Orden"
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddOrder}
                isSubmitting={isSubmitting}
                fields={[
                    { 
                        name: "customerId", 
                        label: "Cliente", 
                        type: "select", 
                        required: true,
                        options: customers.map(customer => ({ 
                            value: customer.id, 
                            label: `${customer.name} (${customer.email})` 
                        }))
                    },
                    { 
                        name: "productId", 
                        label: "Producto", 
                        type: "select", 
                        required: true,
                        options: products.map(product => ({ 
                            value: product.id, 
                            label: `${product.name} - $${product.price}` 
                        }))
                    },
                    { name: "quantity", label: "Cantidad", type: "number", required: true },
                    { 
                        name: "deliveryMethod", 
                        label: "Método de entrega", 
                        type: "select", 
                        required: true,
                        options: [
                            { value: "PICKUP", label: "Recoger en tienda" },
                            { value: "DELIVERY", label: "Entrega a domicilio" }
                        ]
                    }
                ]}
            />

            {/* Status Update Modal */}
            <FormModal
                title="Actualizar Estado"
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                onSubmit={handleUpdateStatus}
                isSubmitting={isSubmitting}
                initialData={selectedOrder ? {
                    status: selectedOrder.status
                } : undefined}
                fields={[
                    { 
                        name: "status", 
                        label: "Estado", 
                        type: "select", 
                        required: true,
                        options: [
                            { value: "received", label: "Recibido" },
                            { value: "preparing", label: "Preparando" },
                            { value: "ready", label: "Listo" },
                            { value: "picked", label: "Recogido" },
                            { value: "completed", label: "Completado" }
                        ]
                    }
                ]}
            />

            {/* Order Detail Modal */}
            <DetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={`Orden ${selectedOrder?.orderNumber || ''}`}
                data={selectedOrder ? [
                    { label: 'Número de Orden', value: selectedOrder.orderNumber },
                    { label: 'Cliente', value: selectedOrder.customerName },
                    { label: 'Email', value: selectedOrder.customerEmail },
                    { label: 'Teléfono', value: selectedOrder.customerPhone },
                    { label: 'Producto', value: selectedOrder.product },
                    { label: 'Cantidad', value: selectedOrder.quantity.toString() },
                    { label: 'Total', value: `$${selectedOrder.total.toFixed(2)}` },
                    { label: 'Estado', value: getStatusInfo(selectedOrder.status).label },
                    { label: 'Método de entrega', value: selectedOrder.deliveryMethod === 'pickup' ? 'Recoger en tienda' : 'Entrega a domicilio' },
                    { label: 'Creado', value: dateFormatter.format(new Date(selectedOrder.createdAt)) }
                ] : []}
            />
        </div>
    );
};

export default OrdersList;
