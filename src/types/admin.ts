// Tipos para el Panel de Administración

export interface Order {
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

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out_of_stock';
    image: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    sku?: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    registeredAt: string;
    status: 'active' | 'inactive';
    address?: string;
    notes?: string;
}

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    averageOrderValue: number;
    ordersThisMonth: number;
    revenueThisMonth: number;
}

export interface Notification {
    id: string;
    message: string;
    type: 'order' | 'product' | 'customer' | 'system';
    read: boolean;
    createdAt: string;
    data?: any;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'staff';
    permissions: string[];
    lastLogin: string;
    status: 'active' | 'inactive';
}

export interface ContentPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: 'published' | 'draft';
    createdAt: string;
    updatedAt: string;
    metaDescription?: string;
    keywords?: string[];
}

export interface Banner {
    id: string;
    title: string;
    image: string;
    link?: string;
    status: 'active' | 'inactive';
    startDate: string;
    endDate?: string;
    position: 'top' | 'middle' | 'bottom';
}

// Estados de pedidos según el flujo de trabajo
export const ORDER_STATUSES = {
    RECEIVED: 'received',
    PREPARING: 'preparing',
    READY: 'ready',
    PICKED: 'picked',
    COMPLETED: 'completed'
} as const;

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUSES.RECEIVED]: 'Pedido Recibido',
    [ORDER_STATUSES.PREPARING]: 'En Preparación',
    [ORDER_STATUSES.READY]: 'Listo para Recoger',
    [ORDER_STATUSES.PICKED]: 'Recogido',
    [ORDER_STATUSES.COMPLETED]: 'Completado'
} as const;

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Tipos para filtros y búsquedas
export interface OrderFilters {
    status?: Order['status'];
    dateFrom?: string;
    dateTo?: string;
    customerName?: string;
    orderNumber?: string;
}

export interface ProductFilters {
    category?: string;
    status?: Product['status'];
    priceFrom?: number;
    priceTo?: number;
    stock?: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface CustomerFilters {
    status?: Customer['status'];
    dateFrom?: string;
    dateTo?: string;
    totalSpentFrom?: number;
    totalSpentTo?: number;
}


