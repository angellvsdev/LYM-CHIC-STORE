"use client";

import React, { useEffect, useState } from "react";
import {
    EyeIcon,
    PencilIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    UsersIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { apiClient } from "@/lib/apiClient";
import FormModal from './modals/FormModal';
import ConfirmModal from './modals/ConfirmModal';
import DetailModal from './modals/DetailModal';
import EmailNotificationService from '@/app/services/EmailNotificationServiceClient';

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
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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

interface OrdersListProps {
    recentOnly?: boolean;
}

const OrdersList: React.FC<OrdersListProps> = ({ recentOnly = false }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [currentOrderData, setCurrentOrderData] = useState<Record<string, any>>({});

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const queryParams = recentOnly ? '?recent=true' : '';
            const { data } = await apiClient.get(`/api/admin/orders${queryParams}`);
            if (data.success) setOrders(data.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch customers for order creation
    const fetchCustomers = async () => {
        try {
            const { data } = await apiClient.get('/api/admin/customers');
            if (data.success) setCustomers(data.data.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    // Fetch products for order creation
    const fetchProducts = async () => {
        try {
            // Obtener TODOS los productos sin límite de paginación
            const { data } = await apiClient.get('/api/admin/products?limit=1000');
            if (data.success) {
                console.log('📦 All products loaded:', data.data.data);
                console.log('📊 Total products:', data.data.data.length);
                setProducts(data.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, [recentOnly]);

    const getStatusInfo = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Pendiente',
                    color: 'bg-blue-100 text-blue-800',
                    icon: ClockIcon
                };
            case 'processing':
                return {
                    label: 'En proceso',
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: ExclamationTriangleIcon
                };
            case 'shipped':
                return {
                    label: 'Enviado',
                    color: 'bg-green-100 text-green-800',
                    icon: CheckCircleIcon
                };
            case 'delivered':
                return {
                    label: 'Entregado',
                    color: 'bg-purple-100 text-purple-800',
                    icon: UsersIcon
                };
            case 'cancelled':
                return {
                    label: 'Cancelado',
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

            const response = await apiClient.post('/api/admin/orders', body);

            // Enviar notificación por correo si la orden se creó exitosamente
            if (response.data) {
                const customer = customers.find(c => c.id === parseInt(formData.customerId));
                if (customer) {
                    await EmailNotificationService.sendOrderCreatedNotification({
                        userEmail: customer.email,
                        orderData: {
                            orderNumber: response.data.orderNumber || `ORD-${Date.now()}`,
                            customerName: customer.name,
                            items: [{
                                name: selectedProduct?.name || 'Producto',
                                quantity: parseInt(formData.quantity),
                                price: selectedProduct?.price || 0
                            }],
                            total: (selectedProduct?.price || 0) * parseInt(formData.quantity),
                            status: 'pending',
                            paymentMethod: 'pending'
                        }
                    });
                }
            }

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

            const response = await apiClient.patch('/api/admin/orders', body);

            // El envío de notificación ahora se hace directamente en el backend (OrderStatusNotifier)

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

    const openDeleteModal = (order: Order) => {
        setSelectedOrder(order);
        setShowDeleteModal(true);
    };

    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;
        try {
            setIsSubmitting(true);
            await apiClient.delete(`/api/admin/orders/${selectedOrder.id}`);
            setShowDeleteModal(false);
            setSelectedOrder(null);
            await fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert(error instanceof Error ? error.message : 'Error al eliminar pedido');
        } finally {
            setIsSubmitting(false);
        }
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
                                                    <button
                                                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        onClick={() => openDeleteModal(order)}
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-davys-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
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
                                                            {new Date(order.createdAt).toLocaleDateString()}
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
                                                    <button
                                                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        onClick={() => openDeleteModal(order)}
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="w-5 h-5 text-red-500" />
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

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteOrder}
                variant="danger"
                title="Eliminar Pedido"
                description={`¿Estás seguro de que deseas eliminar el pedido "${selectedOrder?.orderNumber || ''}"? Esta acción no se puede deshacer.`}
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                isLoading={isSubmitting}
            />

            {/* Add Order Modal */}
            <FormModal
                title="Nueva Orden"
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setCurrentOrderData({});
                }}
                onSubmit={handleAddOrder}
                isSubmitting={isSubmitting}
                initialData={currentOrderData}
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
                            { value: "pending", label: "Pendiente" },
                            { value: "processing", label: "En proceso" },
                            { value: "shipped", label: "Enviado" },
                            { value: "delivered", label: "Entregado" },
                            { value: "cancelled", label: "Cancelado" }
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
                    { label: 'Creado', value: new Date(selectedOrder.createdAt).toLocaleDateString() }
                ] : []}
            />
        </div>
    );
};

export default OrdersList;
