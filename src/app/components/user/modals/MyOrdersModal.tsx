'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import BaseModal from '../../admin/modals/BaseModal';
import { 
  ShoppingBagIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Interface para el pedido del usuario
interface UserOrder {
  order_id: number;
  order_number: string;
  order_date: string;
  order_status_id: number;
  delivery_method: string;
  total?: number;
  order_details?: OrderDetail[];
  order_status?: {
    status_name: string;
  };
}

interface OrderDetail {
  order_detail_id: number;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    name: string;
    image: string;
  };
}

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener información del estado
  const getStatusInfo = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pendiente',
          color: 'bg-yellow-100 text-yellow-800',
          icon: ClockIcon
        };
      case 'processing':
        return {
          label: 'Procesando',
          color: 'bg-blue-100 text-blue-800',
          icon: ClockIcon
        };
      case 'shipped':
        return {
          label: 'Enviado',
          color: 'bg-purple-100 text-purple-800',
          icon: TruckIcon
        };
      case 'delivered':
        return {
          label: 'Entregado',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircleIcon
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800',
          icon: XCircleIcon
        };
      default:
        return {
          label: statusName || 'Desconocido',
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon
        };
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular total del pedido
  const calculateOrderTotal = (order: UserOrder) => {
    if (order.total) return order.total;
    if (order.order_details) {
      return order.order_details.reduce((sum, detail) => {
        const price = typeof detail.unit_price === 'number' ? detail.unit_price : parseFloat(detail.unit_price || '0');
        const quantity = typeof detail.quantity === 'number' ? detail.quantity : parseInt(detail.quantity || '0');
        return sum + (price * quantity);
      }, 0);
    }
    return 0;
  };

  // Obtener pedidos del usuario
  const fetchUserOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Usar el nuevo endpoint específico para usuarios
      const response = await fetch('/api/user/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.error || 'Error al cargar tus pedidos');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchUserOrders();
    }
  }, [isOpen, user]);

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} closeOnOverlay={!loading}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amaranth-pink-300 to-amaranth-pink-200 p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <ShoppingBagIcon className="h-6 w-6 sm:h-8 sm:w-8 text-amaranth-pink-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Mis Pedidos</h2>
                <p className="text-amaranth-pink-100 text-sm sm:text-base">Historial de tus compras</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white hover:text-amaranth-pink-100 transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Loading state */}
            {loading && (
              <div className="flex flex-col justify-center items-center py-12 sm:py-16">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amaranth-pink-400"></div>
                <span className="mt-4 text-gray-600 text-sm sm:text-base font-medium">Cargando tus pedidos...</span>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Orders list */}
            {!loading && !error && (
              <>
                {orders.length === 0 ? (
                  <div className="text-center text-gray-500 py-12 sm:py-16">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
                    <p className="text-sm text-gray-600">Tus compras aparecerán aquí cuando realices tu primer pedido</p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.order_status?.status_name || '');
                      const StatusIcon = statusInfo.icon;
                      const orderTotal = calculateOrderTotal(order);

                      return (
                        <div key={order.order_id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div className="mb-3 sm:mb-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Pedido #{order.order_number}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {formatDate(order.order_date)}
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end space-y-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                <StatusIcon className="h-4 w-4 mr-1" />
                                {statusInfo.label}
                              </span>
                              <span className="text-xl font-bold text-gray-900">
                                ${orderTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-3">
                            {/* Delivery Method */}
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">Método de entrega:</span>
                              <span className="ml-2">
                                {order.delivery_method === 'delivery' ? 'Envío a domicilio' : 'Retiro en tienda'}
                              </span>
                            </div>

                            {/* Products */}
                            {order.order_details && order.order_details.length > 0 && (
                              <div className="border-t pt-3">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Productos</h4>
                                <div className="space-y-2">
                                  {order.order_details.map((detail) => (
                                    <div key={detail.order_detail_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                      <div className="flex items-center space-x-3">
                                        {detail.product?.image && (
                                          <img 
                                            src={detail.product.image} 
                                            alt={detail.product.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                          />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">{detail.product?.name || 'Producto'}</p>
                                          <p className="text-sm text-gray-600">Cantidad: {detail.quantity}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                          ${((typeof detail.unit_price === 'number' ? detail.unit_price : parseFloat(detail.unit_price || '0')) * (typeof detail.quantity === 'number' ? detail.quantity : parseInt(detail.quantity || '0'))).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          ${(typeof detail.unit_price === 'number' ? detail.unit_price : parseFloat(detail.unit_price || '0')).toFixed(2)} c/u
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Order Summary */}
                            <div className="border-t pt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Total del pedido:</span>
                                <span className="text-lg font-bold text-gray-900">
                                  ${orderTotal.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default MyOrdersModal;
