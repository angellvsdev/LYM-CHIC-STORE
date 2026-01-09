'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { 
    MagnifyingGlassIcon,
    BellIcon,
    Bars3Icon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

interface AdminHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    onNavigate?: (section: string) => void;
}

interface SearchResult {
    id: string;
    title: string;
    section: string;
    keyword: string;
    action: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ isSidebarOpen, setIsSidebarOpen, onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const { logout } = useAuth();
    const searchRef = useRef<HTMLDivElement>(null);
    const [notifications] = useState([
        { id: 1, message: 'Nuevo pedido recibido: PED-2024-0015', time: '2 min ago', read: false },
        { id: 2, message: 'Producto "Set de Tazas" agotado', time: '1 hora ago', read: false },
        { id: 3, message: 'Cliente Laura García registrado', time: '3 horas ago', read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Mock search data - in a real app, this would come from API or props
    const searchableItems = [
        // Dashboard items
        { id: 'dashboard-stats', title: 'Estadísticas del Panel', section: 'Dashboard', keywords: ['estadisticas', 'panel', 'metrics', 'dashboard', 'pedidos', 'ingresos'] },
        { id: 'recent-orders', title: 'Órdenes Recientes', section: 'Dashboard', keywords: ['ordenes', 'recientes', 'orders', 'pedidos'] },
        { id: 'products-overview', title: 'Productos', section: 'Dashboard', keywords: ['productos', 'products', 'articulos'] },
        
        // Orders section
        { id: 'orders-list', title: 'Lista de Pedidos', section: 'Pedidos', keywords: ['pedidos', 'orders', 'lista', 'gestion'] },
        { id: 'add-order', title: 'Nuevo Pedido', section: 'Pedidos', keywords: ['nuevo', 'pedido', 'crear', 'add'] },
        
        // Products section
        { id: 'products-list', title: 'Catálogo de Productos', section: 'Productos', keywords: ['productos', 'catalogo', 'products', 'lista'] },
        { id: 'add-product', title: 'Agregar Producto', section: 'Productos', keywords: ['agregar', 'producto', 'crear', 'nuevo'] },
        
        // Categories section
        { id: 'categories-list', title: 'Categorías', section: 'Categorías', keywords: ['categorias', 'categories', 'gestion'] },
        { id: 'add-category', title: 'Nueva Categoría', section: 'Categorías', keywords: ['nueva', 'categoria', 'crear'] },
        
        // Customers section
        { id: 'customers-list', title: 'Clientes', section: 'Clientes', keywords: ['clientes', 'customers', 'usuarios'] },
        { id: 'add-customer', title: 'Registrar Cliente', section: 'Clientes', keywords: ['registrar', 'cliente', 'nuevo'] },
    ];

    // Dynamic searchable items from real data
    const [dynamicSearchableItems, setDynamicSearchableItems] = useState<Array<{
        id: string;
        title: string;
        section: string;
        keywords: string[];
    }>>([]);

    // Fetch real data for search
    useEffect(() => {
        const fetchSearchData = async () => {
            try {
                console.log('Fetching search data...');
                
                // Fetch real data from APIs with proper headers
                const [productsRes, categoriesRes, ordersRes, customersRes] = await Promise.all([
                    fetch('/api/admin/products', {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(res => {
                        console.log('Products response:', res.status);
                        return res.json();
                    }),
                    fetch('/api/categories', {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(res => {
                        console.log('Categories response:', res.status);
                        return res.json();
                    }),
                    fetch('/api/admin/orders', {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(res => {
                        console.log('Orders response:', res.status);
                        return res.json();
                    }),
                    fetch('/api/admin/customers', {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(res => {
                        console.log('Customers response:', res.status);
                        return res.json();
                    })
                ]);

                console.log('API Responses:', { productsRes, categoriesRes, ordersRes, customersRes });

                // Process products
                let searchableProducts = [];
                if (productsRes.success && Array.isArray(productsRes.data?.data)) {
                    searchableProducts = productsRes.data.data.map((product: any) => {
                        const productName = product.name || 'Producto sin nombre';
                        const categoryName = product.category?.name || product.category || '';
                        const description = product.description || '';
                        
                        return {
                            id: `prod-${product.id}`,
                            title: productName,
                            section: 'Productos',
                            keywords: [
                                productName.toLowerCase(),
                                categoryName.toString().toLowerCase(),
                                description.toLowerCase()
                            ].filter(Boolean)
                        };
                    });
                }

                // Process categories
                let searchableCategories = [];
                if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
                    searchableCategories = categoriesRes.data.map((category: any) => {
                        const categoryName = category.name || 'Categoría sin nombre';
                        const description = category.description || '';
                        
                        return {
                            id: `cat-${category.id}`,
                            title: categoryName,
                            section: 'Categorías',
                            keywords: [
                                categoryName.toLowerCase(),
                                description.toLowerCase()
                            ].filter(Boolean)
                        };
                    });
                }

                // Process orders
                let searchableOrders = [];
                if (ordersRes.success && Array.isArray(ordersRes.data?.data)) {
                    searchableOrders = ordersRes.data.data.map((order: any) => {
                        const orderNumber = order.orderNumber || 'Pedido sin número';
                        const customerName = order.customerName || '';
                        const productName = order.product || '';
                        
                        return {
                            id: `order-${order.id}`,
                            title: orderNumber,
                            section: 'Pedidos',
                            keywords: [
                                orderNumber.toLowerCase(),
                                customerName.toLowerCase(),
                                productName.toLowerCase()
                            ].filter(Boolean)
                        };
                    });
                }

                // Process customers
                let searchableCustomers = [];
                if (customersRes.success && Array.isArray(customersRes.data?.data)) {
                    searchableCustomers = customersRes.data.data.map((customer: any) => {
                        const customerName = customer.name || 'Cliente sin nombre';
                        const email = customer.email || customer.email_address || '';
                        const phone = customer.phone || customer.phone_number || '';
                        
                        return {
                            id: `cust-${customer.id}`,
                            title: customerName,
                            section: 'Clientes',
                            keywords: [
                                customerName.toLowerCase(),
                                email.toLowerCase(),
                                phone.toLowerCase()
                            ].filter(Boolean)
                        };
                    });
                }

                const allDynamicItems = [...searchableProducts, ...searchableCategories, ...searchableOrders, ...searchableCustomers];
                console.log('Dynamic searchable items:', allDynamicItems);
                setDynamicSearchableItems(allDynamicItems);
            } catch (error) {
                console.error('Error fetching search data:', error);
            }
        };
        
        fetchSearchData();
    }, []);

    const allSearchableItems = [...searchableItems, ...dynamicSearchableItems];

    const handleSearch = (query: string) => {
        console.log('Search query:', query);
        setSearchQuery(query);
        
        if (query.length < 2) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        const results: SearchResult[] = [];
        console.log('All searchable items:', allSearchableItems);
        
        allSearchableItems.forEach(item => {
            const matchingKeywords = item.keywords.filter(keyword => 
                keyword.toLowerCase().includes(query.toLowerCase())
            );
            
            if (matchingKeywords.length > 0) {
                console.log('Found match:', item, 'Keywords:', matchingKeywords);
                results.push({
                    id: item.id,
                    title: item.title,
                    section: item.section,
                    keyword: matchingKeywords[0],
                    action: () => {
                        // Navigate to section
                        const sectionMap: { [key: string]: string } = {
                            'Dashboard': 'dashboard',
                            'Pedidos': 'orders',
                            'Productos': 'products',
                            'Categorías': 'categories',
                            'Clientes': 'customers'
                        };
                        
                        const targetSection = sectionMap[item.section];
                        console.log('Navigating to:', targetSection); // Debug log
                        if (onNavigate && targetSection) {
                            onNavigate(targetSection);
                        }
                        setShowSuggestions(false);
                        setSearchQuery('');
                    }
                });
            }
        });

        const finalResults = results.slice(0, 5); // Limit to 5 results
        setSearchResults(finalResults);
        setShowSuggestions(finalResults.length > 0);
        console.log('Final search results:', finalResults); // Debug log
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="relative top-0 left-0 right-0 z-70 bg-white/90 backdrop-blur border-b border-davys-gray-200 w-full">
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
                        <div ref={searchRef} className="relative flex-1 w-56 lg:max-w-1/2 mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-davys-gray-200" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => setShowSuggestions(searchResults.length > 0)}
                                className="text-davys-gray-100 block w-full pl-8 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-davys-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amaranth-pink-200 focus:border-transparent bg-davys-gray-50"
                            />
                            
                            {/* Dropdown de sugerencias */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-davys-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                                    {searchResults.map((result) => (
                                        <div
                                            key={result.id}
                                            onClick={result.action}
                                            className="flex items-center justify-between p-3 hover:bg-davys-gray-50 cursor-pointer border-b border-davys-gray-100 last:border-b-0"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-amaranth-pink-600">
                                                        "{result.keyword}"
                                                    </span>
                                                    <span className="text-xs text-davys-gray-500">
                                                        - {result.section}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-davys-gray-700 mt-1">{result.title}</p>
                                            </div>
                                            <ChevronRightIcon className="w-4 h-4 text-davys-gray-400 flex-shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notificaciones y perfil */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notificaciones */}
                        

                        <button
                            type="button"
                            onClick={logout}
                            className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                            aria-label="Cerrar sesión"
                            title="Cerrar sesión"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-davys-gray-600" />
                        </button>

                        {/* Perfil de usuario */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-davys-gray-100">Perfil de Administración</p>
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

