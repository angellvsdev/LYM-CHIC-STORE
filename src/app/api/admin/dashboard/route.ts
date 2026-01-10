import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIronSession, IronSessionData } from 'iron-session';
import { sessionOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
    try {
        const response = NextResponse.next();
        const session = await getIronSession<IronSessionData>(
            request,
            response,
            sessionOptions
        );

        if (!session.user || session.user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
                status: 403,
            });
        }

        // Get order statuses to filter correctly
        const orderStatuses = await prisma.orderStatus.findMany();
        const pendingStatusNames = ['pendiente', 'en proceso']; // Estados en español como están en la BD
        const completedStatusNames = ['entregado'];
        const cancelledStatusNames = ['cancelado'];
        const shippedStatusNames = ['enviado'];

        const pendingStatusIds = orderStatuses
            .filter(status => pendingStatusNames.includes(status.status_name.toLowerCase()))
            .map(status => status.order_status_id);
        
        const completedStatusIds = orderStatuses
            .filter(status => completedStatusNames.includes(status.status_name.toLowerCase()))
            .map(status => status.order_status_id);

        const cancelledStatusIds = orderStatuses
            .filter(status => cancelledStatusNames.includes(status.status_name.toLowerCase()))
            .map(status => status.order_status_id);

        const shippedStatusIds = orderStatuses
            .filter(status => shippedStatusNames.includes(status.status_name.toLowerCase()))
            .map(status => status.order_status_id);

        // Obtener estadísticas del dashboard
        const [
            totalOrders,
            pendingOrders,
            totalProducts,
            totalCustomers,
            completedOrderDetails,
            shippedOrderDetails,
            completedOrdersCount,
            shippedOrdersCount,
            recentOrders
        ] = await Promise.all([
            // Total de pedidos (excluyendo cancelados y entregados)
            prisma.order.count({
                where: {
                    order_status_id: {
                        notIn: [...cancelledStatusIds, ...completedStatusIds]
                    }
                }
            }),
            
            // Pedidos pendientes
            prisma.order.count({
                where: {
                    order_status_id: {
                        in: pendingStatusIds
                    }
                }
            }),
            
            // Total de productos
            prisma.product.count(),
            
            // Total de clientes
            prisma.user.count({
                where: {
                    role: 'user'
                }
            }),
            
            // Obtener detalles completos de pedidos entregados para cálculo correcto
            prisma.orderDetail.findMany({
                where: {
                    order: {
                        order_status_id: {
                            in: completedStatusIds
                        }
                    }
                },
                select: {
                    quantity: true,
                    unit_price: true
                }
            }),

            // Obtener detalles completos de pedidos enviados para cálculo correcto
            prisma.orderDetail.findMany({
                where: {
                    order: {
                        order_status_id: {
                            in: shippedStatusIds
                        }
                    }
                },
                select: {
                    quantity: true,
                    unit_price: true
                }
            }),

            // Contar pedidos entregados para promedio correcto
            prisma.order.count({
                where: {
                    order_status_id: {
                        in: completedStatusIds
                    }
                }
            }),

            // Contar pedidos enviados para promedio correcto
            prisma.order.count({
                where: {
                    order_status_id: {
                        in: shippedStatusIds
                    }
                }
            }),

            // Órdenes de la última semana para el dashboard
            prisma.order.findMany({
                where: {
                    order_date: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Última semana
                    }
                },
                include: {
                    user: true,
                    orderStatus: true,
                    order_details: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    order_date: 'desc'
                },
                take: 5
            })
        ]);

        // Calcular ingresos totales (SOLO entregados + enviados) - cálculo correcto por cada detalle
        const completedRevenue = completedOrderDetails.reduce((sum, detail) => 
            sum + (Number(detail.quantity) * Number(detail.unit_price)), 0
        );
        const shippedRevenue = shippedOrderDetails.reduce((sum, detail) => 
            sum + (Number(detail.quantity) * Number(detail.unit_price)), 0
        );
        const totalRevenue = completedRevenue + shippedRevenue;

        // Calcular valor promedio por pedido - CORRECTO: ingresos de pedidos completados / número de pedidos completados
        const completedOrdersForRevenue = completedOrdersCount + shippedOrdersCount;
        const averageOrderValue = completedOrdersForRevenue > 0 
            ? totalRevenue / completedOrdersForRevenue 
            : 0;

        const dashboardStats = {
            totalOrders,
            pendingOrders,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalProducts,
            totalCustomers,
            averageOrderValue: Math.round(averageOrderValue * 100) / 100,
            recentOrders
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


