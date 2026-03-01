'use client';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import OrdersList from '../components/admin/OrdersList';
import ProductsOverview from '../components/admin/ProductsOverview';
import CustomersOverview from '../components/admin/CustomersOverview';
import CategoriesOverview from '../components/admin/CategoriesOverview';
import AdminRouteProtection from '../components/admin/AdminRouteProtection';
import { apiClient } from '@/lib/apiClient';

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Cerrado por defecto en móviles
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
        averageOrderValue: 0
    });
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data } = await apiClient.get('/api/admin/dashboard');
            if (data.success) {
                setDashboardData(data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amaranth-pink-400"></div>
                            </div>
                        ) : (
                            <DashboardStats data={dashboardData} />
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <OrdersList recentOnly={true} />
                            <ProductsOverview />
                        </div>
                    </div>
                );
            case 'orders':
                return <OrdersList />;
            case 'products':
                return <ProductsOverview />;
            case 'categories':
                return <CategoriesOverview />;
            case 'customers':
                return <CustomersOverview />;
            case 'content':
                return <div className="bg-white rounded-2xl p-6 shadow-lg">Gestión de Contenido</div>;
            case 'settings':
                return <div className="bg-white rounded-2xl p-6 shadow-lg">Configuraciones</div>;
            default:
                return <DashboardStats data={dashboardData} />;
        }
    };

    return (
        <AdminRouteProtection>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                />
                {/* Contenedor principal con responsive correcto */}
                <div className={`
                    transition-all duration-300 ease-in-out
                    lg:ml-64
                    ml-0  /* Sin margin en móviles */
                `}>
                    <AdminHeader
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        onNavigate={setActiveSection}
                    />
                    <main className="p-4 sm:p-6">
                        {renderMainContent()}
                    </main>
                </div>
            </div>
        </AdminRouteProtection>
    );
}

