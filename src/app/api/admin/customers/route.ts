import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Customer, CustomerFilters, PaginatedResponse } from '@/types/admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        // Construir filtros
        const where: any = {
            role: 'customer' // Solo clientes, no administradores
        };
        
        if (status) {
            where.status = status;
        }
        
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = new Date(dateFrom);
            }
            if (dateTo) {
                where.createdAt.lte = new Date(dateTo);
            }
        }

        // Obtener clientes con paginación
        const [customers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            orders: true
                        }
                    },
                    orders: {
                        select: {
                            total: true,
                            createdAt: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1
                    }
                }
            }),
            prisma.user.count({ where })
        ]);

        // Transformar datos para el frontend
        const transformedCustomers: Customer[] = customers.map(customer => {
            const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
            const lastOrder = customer.orders[0]?.createdAt.toISOString() || null;

            return {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                totalOrders: customer._count.orders,
                totalSpent,
                lastOrder: lastOrder ? new Date(lastOrder).toISOString().split('T')[0] : 'Nunca',
                registeredAt: customer.createdAt.toISOString().split('T')[0],
                status: customer.status as Customer['status'],
                address: customer.address || undefined,
                notes: undefined // Los clientes no tienen notas por defecto
            };
        });

        const response: PaginatedResponse<Customer> = {
            data: transformedCustomers,
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
        console.error('Error al obtener clientes:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Error interno del servidor' 
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, address } = body;

        // Validaciones básicas
        if (!name || !email || !phone) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Nombre, email y teléfono son requeridos' 
                },
                { status: 400 }
            );
        }

        // Verificar si el email ya existe
        const existingCustomer = await prisma.user.findUnique({
            where: { email }
        });

        if (existingCustomer) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Ya existe un cliente con este email' 
                },
                { status: 400 }
            );
        }

        // Crear cliente
        const customer = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                address: address || undefined,
                role: 'customer',
                status: 'active'
            }
        });

        return NextResponse.json({
            success: true,
            data: customer,
            message: 'Cliente creado correctamente'
        });

    } catch (error) {
        console.error('Error al crear cliente:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Error interno del servidor' 
            },
            { status: 500 }
        );
    }
}


