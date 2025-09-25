'use client';
import { useState, useEffect } from 'react';
import { 
    DashboardStats, 
    Order, 
    Product, 
    Customer, 
    PaginatedResponse,
    OrderFilters,
    ProductFilters,
    CustomerFilters
} from '@/types/admin';

interface UseAdminDataReturn {
    // Dashboard
    dashboardStats: DashboardStats | null;
    loadingDashboard: boolean;
    errorDashboard: string | null;
    refreshDashboard: () => void;

    // Orders
    orders: Order[];
    ordersPagination: PaginatedResponse<Order>['pagination'] | null;
    loadingOrders: boolean;
    errorOrders: string | null;
    fetchOrders: (filters?: OrderFilters, page?: number) => void;
    updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => Promise<boolean>;

    // Products
    products: Product[];
    productsPagination: PaginatedResponse<Product>['pagination'] | null;
    loadingProducts: boolean;
    errorProducts: string | null;
    fetchProducts: (filters?: ProductFilters, page?: number) => void;
    createProduct: (productData: Partial<Product>) => Promise<boolean>;

    // Customers
    customers: Customer[];
    customersPagination: PaginatedResponse<Customer>['pagination'] | null;
    loadingCustomers: boolean;
    errorCustomers: string | null;
    fetchCustomers: (filters?: CustomerFilters, page?: number) => void;
    createCustomer: (customerData: Partial<Customer>) => Promise<boolean>;
}

export const useAdminData = (): UseAdminDataReturn => {
    // Dashboard state
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [loadingDashboard, setLoadingDashboard] = useState(false);
    const [errorDashboard, setErrorDashboard] = useState<string | null>(null);

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersPagination, setOrdersPagination] = useState<PaginatedResponse<Order>['pagination'] | null>(null);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [errorOrders, setErrorOrders] = useState<string | null>(null);

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [productsPagination, setProductsPagination] = useState<PaginatedResponse<Product>['pagination'] | null>(null);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState<string | null>(null);

    // Customers state
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customersPagination, setCustomersPagination] = useState<PaginatedResponse<Customer>['pagination'] | null>(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [errorCustomers, setErrorCustomers] = useState<string | null>(null);

    // Dashboard functions
    const fetchDashboardStats = async () => {
        setLoadingDashboard(true);
        setErrorDashboard(null);
        
        try {
            const response = await fetch('/api/admin/dashboard');
            const data = await response.json();
            
            if (data.success) {
                setDashboardStats(data.data);
            } else {
                setErrorDashboard(data.error || 'Error al cargar estadísticas');
            }
        } catch (error) {
            setErrorDashboard('Error de conexión');
        } finally {
            setLoadingDashboard(false);
        }
    };

    const refreshDashboard = () => {
        fetchDashboardStats();
    };

    // Orders functions
    const fetchOrders = async (filters?: OrderFilters, page: number = 1) => {
        setLoadingOrders(true);
        setErrorOrders(null);
        
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            if (filters) {
                if (filters.status) params.append('status', filters.status);
                if (filters.customerName) params.append('customerName', filters.customerName);
                if (filters.orderNumber) params.append('orderNumber', filters.orderNumber);
                if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
                if (filters.dateTo) params.append('dateTo', filters.dateTo);
            }

            const response = await fetch(`/api/admin/orders?${params}`);
            const data = await response.json();
            
            if (data.success) {
                setOrders(data.data.data);
                setOrdersPagination(data.data.pagination);
            } else {
                setErrorOrders(data.error || 'Error al cargar pedidos');
            }
        } catch (error) {
            setErrorOrders('Error de conexión');
        } finally {
            setLoadingOrders(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId,
                    status,
                    notes
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Actualizar el pedido en la lista local
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status, updatedAt: new Date().toISOString() }
                            : order
                    )
                );
                return true;
            } else {
                console.error('Error al actualizar pedido:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            return false;
        }
    };

    // Products functions
    const fetchProducts = async (filters?: ProductFilters, page: number = 1) => {
        setLoadingProducts(true);
        setErrorProducts(null);
        
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            if (filters) {
                if (filters.category) params.append('category', filters.category);
                if (filters.status) params.append('status', filters.status);
                if (filters.priceFrom) params.append('priceFrom', filters.priceFrom.toString());
                if (filters.priceTo) params.append('priceTo', filters.priceTo.toString());
            }

            const response = await fetch(`/api/admin/products?${params}`);
            const data = await response.json();
            
            if (data.success) {
                setProducts(data.data.data);
                setProductsPagination(data.data.pagination);
            } else {
                setErrorProducts(data.error || 'Error al cargar productos');
            }
        } catch (error) {
            setErrorProducts('Error de conexión');
        } finally {
            setLoadingProducts(false);
        }
    };

    const createProduct = async (productData: Partial<Product>): Promise<boolean> => {
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            
            if (data.success) {
                // Recargar la lista de productos
                await fetchProducts();
                return true;
            } else {
                console.error('Error al crear producto:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            return false;
        }
    };

    // Customers functions
    const fetchCustomers = async (filters?: CustomerFilters, page: number = 1) => {
        setLoadingCustomers(true);
        setErrorCustomers(null);
        
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            if (filters) {
                if (filters.status) params.append('status', filters.status);
                if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
                if (filters.dateTo) params.append('dateTo', filters.dateTo);
            }

            const response = await fetch(`/api/admin/customers?${params}`);
            const data = await response.json();
            
            if (data.success) {
                setCustomers(data.data.data);
                setCustomersPagination(data.data.pagination);
            } else {
                setErrorCustomers(data.error || 'Error al cargar clientes');
            }
        } catch (error) {
            setErrorCustomers('Error de conexión');
        } finally {
            setLoadingCustomers(false);
        }
    };

    const createCustomer = async (customerData: Partial<Customer>): Promise<boolean> => {
        try {
            const response = await fetch('/api/admin/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            const data = await response.json();
            
            if (data.success) {
                // Recargar la lista de clientes
                await fetchCustomers();
                return true;
            } else {
                console.error('Error al crear cliente:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            return false;
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchDashboardStats();
        fetchOrders();
        fetchProducts();
        fetchCustomers();
    }, []);

    return {
        // Dashboard
        dashboardStats,
        loadingDashboard,
        errorDashboard,
        refreshDashboard,

        // Orders
        orders,
        ordersPagination,
        loadingOrders,
        errorOrders,
        fetchOrders,
        updateOrderStatus,

        // Products
        products,
        productsPagination,
        loadingProducts,
        errorProducts,
        fetchProducts,
        createProduct,

        // Customers
        customers,
        customersPagination,
        loadingCustomers,
        errorCustomers,
        fetchCustomers,
        createCustomer
    };
};



