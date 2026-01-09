import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Customer, CustomerFilters, PaginatedResponse } from '@/types/admin';
import { hashPassword, generateSecurePassword } from '@/lib/auth/password';
import { z } from 'zod';

// Esquema de validación para la creación de usuarios
const createUserSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    )
    .optional(),
  role: z.enum(['user', 'admin']).default('user'),
  age: z.number().int().positive().optional(),
  gender: z.string().optional(),
});

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
        
        // Validar el cuerpo de la solicitud
        const validation = createUserSchema.safeParse(body);
        
        if (!validation.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Datos de entrada inválidos',
                    details: validation.error.errors 
                },
                { status: 400 }
            );
        }
        
        const { name, email, phone, password, role, age, gender } = validation.data;

        // Verificar si el email ya existe
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

        // Generar contraseña segura si no se proporciona
        const plainPassword = password || generateSecurePassword(12);
        
        // Hashear la contraseña
        const hashedPassword = await hashPassword(plainPassword);

        // Crear el usuario con la contraseña hasheada
        const customer = await prisma.user.create({
            data: {
                name,
                email_address: email,
                phone_number: phone,
                password: hashedPassword,
                registration_date: new Date(),
                role,
                age,
                gender
                // Nota: No incluimos email_verified ya que no existe en el modelo
            },
            select: {
                user_id: true,
                name: true,
                email_address: true,
                phone_number: true,
                registration_date: true,
                role: true,
                age: true,
                gender: true
            }
        });

        // En producción, aquí podrías enviar un correo con la contraseña temporal
        // o un enlace para establecer una contraseña
        
        return NextResponse.json({
            success: true,
            data: {
                id: String(customer.user_id),
                name: customer.name,
                email: customer.email_address,
                phone: customer.phone_number,
                registeredAt: customer.registration_date.toISOString().split('T')[0],
                role: customer.role,
                // En producción, nunca devolvemos la contraseña
                // Solo en desarrollo y solo si no se proporcionó una contraseña
                ...(process.env.NODE_ENV === 'development' && !password ? { 
                    temporaryPassword: plainPassword,
                    note: 'Esta contraseña solo se muestra en desarrollo. En producción, implementa un flujo de verificación por correo.' 
                } : {})
            },
            message: 'Usuario creado correctamente' + (!password ? ' con una contraseña temporal' : '')
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


