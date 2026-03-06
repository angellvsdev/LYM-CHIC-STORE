import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un cliente específico por ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid customer ID' },
                { status: 400 }
            );
        }

        const customer = await prisma.user.findUnique({
            where: {
                user_id: userId,
                role: 'user' // Solo usuarios, no admins
            },
            select: {
                user_id: true,
                name: true,
                email_address: true,
                phone_number: true,
                registration_date: true,
                role: true,
                age: true,
                gender: true,
                _count: {
                    select: {
                        orders: true
                    }
                },
                orders: {
                    select: {
                        order_date: true,
                        order_details: {
                            select: {
                                quantity: true,
                                unit_price: true
                            }
                        }
                    },
                    orderBy: {
                        order_date: 'desc'
                    }
                }
            }
        });

        if (!customer) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        // Calcular total gastado
        const totalSpent = customer.orders.reduce((total, order) => {
            const orderTotal = order.order_details.reduce((sum, detail) => {
                return sum + (detail.quantity * Number(detail.unit_price));
            }, 0);
            return total + orderTotal;
        }, 0);

        // Mapear al formato esperado por el frontend
        const customerData = {
            id: customer.user_id.toString(),
            name: customer.name,
            email: customer.email_address,
            phone: customer.phone_number,
            registrationDate: customer.registration_date.toISOString(),
            totalOrders: customer._count.orders,
            totalSpent: totalSpent,
            status: 'active' as const, // Por defecto, ya que no tenemos campo status
            lastOrderDate: customer.orders[0]?.order_date?.toISOString() || null,
            age: customer.age,
            gender: customer.gender
        };

        return NextResponse.json({
            success: true,
            data: customerData
        });

    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar un cliente
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid customer ID' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, email, phone, age, gender } = body;

        // Validación básica
        if (!name || !email || !phone) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and phone are required' },
                { status: 400 }
            );
        }

        // Verificar que el usuario existe y es un cliente (no admin)
        const existingUser = await prisma.user.findUnique({
            where: { user_id: userId }
        });

        if (!existingUser) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        if (existingUser.role !== 'user') {
            return NextResponse.json(
                { success: false, message: 'Cannot update non-customer users' },
                { status: 403 }
            );
        }

        // Verificar si el email ya existe en otro usuario
        if (email !== existingUser.email_address) {
            const emailExists = await prisma.user.findUnique({
                where: { email_address: email }
            });

            if (emailExists && emailExists.user_id !== userId) {
                return NextResponse.json(
                    { success: false, message: 'Email already in use' },
                    { status: 400 }
                );
            }
        }

        // Actualizar el cliente
        const updatedCustomer = await prisma.user.update({
            where: { user_id: userId },
            data: {
                name,
                email_address: email,
                phone_number: phone,
                age: age ? parseInt(age) : null,
                gender: gender || null
            },
            select: {
                user_id: true,
                name: true,
                email_address: true,
                phone_number: true,
                registration_date: true,
                age: true,
                gender: true
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                id: updatedCustomer.user_id.toString(),
                name: updatedCustomer.name,
                email: updatedCustomer.email_address,
                phone: updatedCustomer.phone_number,
                registrationDate: updatedCustomer.registration_date.toISOString(),
                age: updatedCustomer.age,
                gender: updatedCustomer.gender
            },
            message: 'Customer updated successfully'
        });

    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar un cliente
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid customer ID' },
                { status: 400 }
            );
        }

        // Verificar que el usuario existe y es un cliente (no admin)
        const existingUser = await prisma.user.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                role: true,
                _count: {
                    select: {
                        orders: true
                    }
                }
            }
        });

        if (!existingUser) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        if (existingUser.role !== 'user') {
            return NextResponse.json(
                { success: false, message: 'Cannot delete non-customer users' },
                { status: 403 }
            );
        }

        // Verificar si el cliente tiene órdenes
        if (existingUser._count.orders > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Cannot delete customer with existing orders. Consider deactivating instead.'
                },
                { status: 400 }
            );
        }

        // Eliminar el cliente
        await prisma.user.delete({
            where: { user_id: userId }
        });

        return NextResponse.json({
            success: true,
            message: 'Customer deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
