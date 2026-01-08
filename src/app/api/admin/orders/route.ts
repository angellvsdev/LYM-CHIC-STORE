import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Order, OrderFilters, PaginatedResponse } from '@/types/admin';

const statusCodeToId: Record<string, number> = {
    pending: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 5
};

const statusNameToCode = (statusName: string) => {
    const normalized = statusName.trim().toLowerCase();
    const map: Record<string, string> = {
        'pendiente': 'pending',
        'en proceso': 'processing',
        'enviado': 'shipped',
        'entregado': 'delivered',
        'cancelado': 'cancelled'
    };
    return map[normalized] || normalized;
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const customerName = searchParams.get('customerName');
        const orderNumber = searchParams.get('orderNumber');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        const skip = (page - 1) * limit;

        // Build where clause for filtering
        const where: any = {};
        
        if (status) {
            const orderStatusId = statusCodeToId[status];
            if (orderStatusId) {
                where.order_status_id = orderStatusId;
            }
        }
        
        if (customerName) {
            where.user = {
                name: {
                    contains: customerName,
                    mode: 'insensitive'
                }
            };
        }
        
        if (orderNumber) {
            where.order_number = {
                contains: orderNumber,
                mode: 'insensitive'
            };
        }
        
        if (dateFrom || dateTo) {
            where.order_date = {};
            if (dateFrom) {
                where.order_date.gte = new Date(dateFrom);
            }
            if (dateTo) {
                where.order_date.lte = new Date(dateTo);
            }
        }

        // Get orders with pagination
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    order_date: 'desc'
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email_address: true,
                            phone_number: true
                        }
                    },
                    orderStatus: {
                        select: {
                            status_name: true
                        }
                    },
                    order_details: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.order.count({ where })
        ]);

        // Transform data for frontend
        const transformedOrders = orders.map(order => {
            const totalAmount = order.order_details.reduce((sum, detail) => 
                sum + (parseFloat(detail.unit_price.toString()) * detail.quantity), 0
            );
            
            return {
                id: order.order_id.toString(),
                orderNumber: order.order_number,
                customerName: order.user.name,
                customerEmail: order.user.email_address,
                customerPhone: order.user.phone_number,
                product: order.order_details[0]?.product.name || 'Producto no disponible',
                quantity: order.order_details.reduce((sum, detail) => sum + detail.quantity, 0),
                total: totalAmount,
                status: statusNameToCode(order.orderStatus.status_name) as any,
                createdAt: order.order_date.toISOString(),
                updatedAt: order.order_date.toISOString(), // Default since not in schema
                notes: undefined, // Not in schema
                deliveryMethod: order.delivery_method.toLowerCase() as 'pickup' | 'delivery',
                address: undefined // Not in schema
            };
        });

        const response = {
            data: transformedOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };

        return NextResponse.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Order ID and status are required' 
                },
                { status: 400 }
            );
        }

        const orderStatusId = statusCodeToId[status];
        if (!orderStatusId) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Invalid status' 
                },
                { status: 400 }
            );
        }

        const updatedOrder = await prisma.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { order_id: parseInt(orderId) },
                data: {
                    order_status_id: orderStatusId
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email_address: true,
                            phone_number: true
                        }
                    },
                    orderStatus: {
                        select: {
                            status_name: true
                        }
                    }
                }
            });

            await tx.orderStatusHistory.create({
                data: {
                    order_id: parseInt(orderId),
                    order_status_id: orderStatusId,
                    change_date: new Date(),
                    notes: null
                }
            });

            return updated;
        });

        // If order is shipped, send notification
        if (status === 'shipped') {
            console.log(`Order ${updatedOrder.order_number} ready for pickup. Send WhatsApp to ${updatedOrder.user.phone_number}`);
        }

        return NextResponse.json({
            success: true,
            data: updatedOrder,
            message: `Order updated to status: ${status}`
        });

    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            user_id, 
            delivery_method, 
            order_details 
        } = body;

        // Basic validations
        if (!user_id || !delivery_method || !order_details || !Array.isArray(order_details) || order_details.length === 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'User ID, delivery method, and order details are required' 
                },
                { status: 400 }
            );
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}`;

        // Create order with details
        const order = await prisma.order.create({
            data: {
                order_number: orderNumber,
                user_id: parseInt(user_id),
                order_date: new Date(),
                order_status_id: 1, // Default to 'received'
                delivery_method: delivery_method.toUpperCase(),
                order_details: {
                    create: order_details.map((detail: any) => ({
                        product_id: detail.product_id,
                        quantity: parseInt(detail.quantity),
                        unit_price: parseFloat(detail.unit_price)
                    }))
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email_address: true,
                        phone_number: true
                    }
                },
                orderStatus: {
                    select: {
                        status_name: true
                    }
                },
                order_details: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

