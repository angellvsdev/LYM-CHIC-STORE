'use client';
import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import OrdersList from '../components/admin/OrdersList';
import ProductsOverview from '../components/admin/ProductsOverview';
import CustomersOverview from '../components/admin/CustomersOverview';
import CategoriesOverview from '../components/admin/CategoriesOverview';
import AdminRouteProtection from '../components/admin/AdminRouteProtection';

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Datos de ejemplo para el dashboard
    const dashboardData = {
        totalOrders: 156,
        pendingOrders: 23,
        totalRevenue: 28450.75,
        totalProducts: 89,
        totalCustomers: 342,
        averageOrderValue: 182.37
    };

    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <DashboardStats data={dashboardData} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <OrdersList />
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
                <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
                    <AdminHeader
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <main className="p-6">
                        {renderMainContent()}
                    </main>
                </div>
            </div>
        </AdminRouteProtection>
    );
}

