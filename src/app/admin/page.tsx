'use client';
import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import OrdersList from '../components/admin/OrdersList';
import ProductsOverview from '../components/admin/ProductsOverview';
import CustomersOverview from '../components/admin/CustomersOverview';
import CategoriesOverview from '../components/admin/CategoriesOverview';

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
        <div className="min-h-screen bg-gradient-to-br from-lavender-blush-600 to-pale-purple-600 font-grotesk overflow-hidden">
            {/* Header fijo full-width */}
            <AdminHeader 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="pt-14 sm:pt-16">{/* spacer por header fijo responsive */}
                <div className="flex">
                    {/* Sidebar altura completa bajo header */}
                    <AdminSidebar 
                        activeSection={activeSection} 
                        setActiveSection={setActiveSection}
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                    />

                    {/* Main Content con margen dinámico */}
                    <div className={`flex-1 transition-all duration-300 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4rem)] ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-8'}`}>
                        <main className="p-4 sm:p-6">
                            <div className="mb-4 sm:mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-davys-gray-100 mb-2">
                                    {activeSection === 'dashboard' && 'Dashboard'}
                                    {activeSection === 'orders' && 'Gestión de Pedidos'}
                                    {activeSection === 'products' && 'Gestión de Productos'}
                                    {activeSection === 'categories' && 'Gestión de Categorías'}
                                    {activeSection === 'customers' && 'Gestión de Clientes'}
                                    {activeSection === 'content' && 'Gestión de Contenido'}
                                    {activeSection === 'settings' && 'Configuraciones'}
                                </h1>
                                <p className="text-davys-gray-600 text-sm sm:text-base">
                                    {activeSection === 'dashboard' && 'Bienvenido de vuelta, Administrador 👋'}
                                    {activeSection === 'orders' && 'Gestiona todos los pedidos de tus clientes'}
                                    {activeSection === 'products' && 'Administra tu catálogo de productos'}
                                    {activeSection === 'categories' && 'Administra las categorías del catálogo'}
                                    {activeSection === 'customers' && 'Información de tus clientes'}
                                    {activeSection === 'content' && 'Gestiona el contenido de la plataforma'}
                                    {activeSection === 'settings' && 'Configura tu panel de administración'}
                                </p>
                            </div>

                            {renderMainContent()}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

