import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DashboardStats } from '@/types/admin';

export async function GET(request: NextRequest) {
    try {
        // Obtener estadísticas del dashboard
        const [
            totalOrders,
            pendingOrders,
            totalProducts,
            totalCustomers,
            totalRevenue,
            ordersThisMonth,
            revenueThisMonth
        ] = await Promise.all([
            // Total de pedidos
            prisma.order.count(),
            
            // Pedidos pendientes (received, preparing, ready)
            prisma.order.count({
                where: {
                    status: {
                        in: ['received', 'preparing', 'ready']
                    }
                }
            }),
            
            // Total de productos activos
            prisma.product.count({
                where: {
                    status: 'active'
                }
            }),
            
            // Total de clientes activos
            prisma.user.count({
                where: {
                    role: 'customer',
                    status: 'active'
                }
            }),
            
            // Ingresos totales
            prisma.order.aggregate({
                where: {
                    status: 'completed'
                },
                _sum: {
                    total: true
                }
            }),
            
            // Pedidos este mes
            prisma.order.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            
            // Ingresos este mes
            prisma.order.aggregate({
                where: {
                    status: 'completed',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                },
                _sum: {
                    total: true
                }
            })
        ]);

        // Calcular valor promedio por pedido
        const averageOrderValue = totalOrders > 0 
            ? (totalRevenue._sum.total || 0) / totalOrders 
            : 0;

        const dashboardStats: DashboardStats = {
            totalOrders,
            pendingOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            totalProducts,
            totalCustomers,
            averageOrderValue: Math.round(averageOrderValue * 100) / 100,
            ordersThisMonth,
            revenueThisMonth: revenueThisMonth._sum.total || 0
        };

        return NextResponse.json({
            success: true,
            data: dashboardStats
        });

    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Error interno del servidor' 
            },
            { status: 500 }
        );
    }
}


