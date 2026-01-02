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

        // Construir filtros usando campos correctos del schema Prisma
        const where: any = {
            role: 'user' // Schema usa 'user' como valor por defecto
        };
        
        // Nota: status no existe en el schema User actual
        // Si se necesita, debe agregarse al schema Prisma
        
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email_address: { contains: search, mode: 'insensitive' } },
                { phone_number: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (dateFrom || dateTo) {
            where.registration_date = {};
            if (dateFrom) {
                where.registration_date.gte = new Date(dateFrom);
            }
            if (dateTo) {
                where.registration_date.lte = new Date(dateTo);
            }
        }

        // Obtener clientes con paginación usando campos reales del schema
        const [customers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    registration_date: 'desc'
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
                        },
                        take: 1
                    }
                }
            }),
            prisma.user.count({ where })
        ]);

        // Transformar datos para el frontend
        const transformedCustomers: Customer[] = customers.map(customer => {
            // Calcular total gastado desde order_details
            const totalSpent = customer.orders.reduce((sum, order) => {
                const orderTotal = order.order_details.reduce((orderSum, detail) => {
                    return orderSum + (Number(detail.unit_price) * detail.quantity);
                }, 0);
                return sum + orderTotal;
            }, 0);
            
            const lastOrder = customer.orders[0]?.order_date.toISOString() || null;

            return {
                id: String(customer.user_id),
                name: customer.name,
                email: customer.email_address,
                phone: customer.phone_number,
                totalOrders: customer._count.orders,
                totalSpent,
                lastOrder: lastOrder ? new Date(lastOrder).toISOString().split('T')[0] : 'Nunca',
                registeredAt: customer.registration_date.toISOString().split('T')[0],
                status: 'active' as Customer['status'], // Valor por defecto ya que no existe en schema
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
        const { name, email, phone, password } = body;

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

        // Verificar si el email ya existe (usando campo correcto)
        const existingCustomer = await prisma.user.findUnique({
            where: { email_address: email }
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

        // Crear cliente usando campos correctos del schema
        const customer = await prisma.user.create({
            data: {
                name,
                email_address: email,
                phone_number: phone,
                password: password || 'changeme', // Requerido por schema
                registration_date: new Date(),
                role: 'user'
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                id: String(customer.user_id),
                name: customer.name,
                email: customer.email_address,
                phone: customer.phone_number,
                registeredAt: customer.registration_date.toISOString().split('T')[0]
            },
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


