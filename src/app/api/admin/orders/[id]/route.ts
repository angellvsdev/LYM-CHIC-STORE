import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = parseInt(params.id);

        const order = await prisma.order.findUnique({
            where: { order_id: orderId },
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
                                price: true,
                                description: true,
                                image: true
                            }
                        }
                    }
                },
                orderStatusHistory: {
                    orderBy: {
                        change_date: 'desc'
                    },
                    select: {
                        orderStatus: {
                            select: {
                                status_name: true
                            }
                        },
                        change_date: true,
                        notes: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Pedido no encontrado' 
                },
                { status: 404 }
            );
        }

        // Transform data for frontend
        const totalAmount = order.order_details.reduce((sum, detail) => 
            sum + (parseFloat(detail.unit_price.toString()) * detail.quantity), 0
        );
        
        const orderDetails = {
            id: order.order_id.toString(),
            orderNumber: order.order_number,
            customer: {
                name: order.user.name,
                email: order.user.email_address,
                phone: order.user.phone_number,
                address: undefined // Not in schema
            },
            items: order.order_details.map(detail => ({
                id: detail.order_detail_id.toString(),
                productName: detail.product.name,
                productDescription: detail.product.description,
                productImage: detail.product.image,
                quantity: detail.quantity,
                price: parseFloat(detail.unit_price.toString()),
                total: detail.quantity * parseFloat(detail.unit_price.toString())
            })),
            total: totalAmount,
            status: order.orderStatus.status_name.toLowerCase(),
            deliveryMethod: order.delivery_method.toLowerCase(),
            address: undefined, // Not in schema
            notes: undefined, // Not in schema
            createdAt: order.order_date.toISOString(),
            updatedAt: order.order_date.toISOString(), // Default since not in schema
            statusHistory: order.orderStatusHistory.map(history => ({
                status: history.orderStatus.status_name.toLowerCase(),
                createdAt: history.change_date.toISOString(),
                notes: history.notes
            }))
        };

        return NextResponse.json({
            success: true,
            data: orderDetails
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = parseInt(params.id);

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { order_id: orderId },
            include: {
                orderStatus: {
                    select: {
                        status_name: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Order not found' 
                },
                { status: 404 }
            );
        }

        // Only allow deleting orders with specific status
        const allowedStatuses = ['cancelled', 'draft', 'received'];
        if (!allowedStatuses.includes(order.orderStatus.status_name.toLowerCase())) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Cannot delete an order that is already in process' 
                },
                { status: 400 }
            );
        }

        // Delete order and related elements
        await prisma.$transaction([
            prisma.orderDetail.deleteMany({
                where: { order_id: orderId }
            }),
            prisma.orderStatusHistory.deleteMany({
                where: { order_id: orderId }
            }),
            prisma.order.delete({
                where: { order_id: orderId }
            })
        ]);

        return NextResponse.json({
            success: true,
            message: 'Order deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}


