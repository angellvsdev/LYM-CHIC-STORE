'use client';
import React from 'react';
import { 
    ShoppingBagIcon,
    CurrencyDollarIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
    data: {
        totalOrders: number;
        pendingOrders: number;
        totalRevenue: number;
        totalProducts: number;
        totalCustomers: number;
        averageOrderValue: number;
    };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
    const moneyFormatter = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const stats = [
        {
            title: 'Pedidos Totales',
            value: data.totalOrders,
            icon: ShoppingBagIcon,
            color: 'from-amaranth-pink-400 to-pink-lavender-400',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Ingresos Totales',
            value: `$${moneyFormatter.format(data.totalRevenue)}`,
            icon: CurrencyDollarIcon,
            color: 'from-pale-purple-400 to-lavender-blush-400',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Pedidos Pendientes',
            value: data.pendingOrders,
            icon: ClockIcon,
            color: 'from-lavender-blush-400 to-amaranth-pink-400',
            change: '-5%',
            changeType: 'negative'
        },
        {
            title: 'Valor Promedio',
            value: `$${data.averageOrderValue}`,
            icon: ChartBarIcon,
            color: 'from-pink-lavender-400 to-pale-purple-400',
            change: '+3%',
            changeType: 'positive'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span className={`text-xs sm:text-sm font-medium ${
                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                        
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-davys-gray-100 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-xs sm:text-sm text-davys-gray-600">
                                {stat.title}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardStats;

