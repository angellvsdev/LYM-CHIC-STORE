import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { z } from "zod";

// Schema de validación para el pedido
const OrderSchema = z.object({
  orderNumber: z.string(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    image: z.string().optional()
  })),
  total: z.number(),
  paymentMethod: z.enum(["cash", "mobile_payment"]),
  paymentDetails: z.object({
    method: z.enum(["cash", "mobile_payment"]),
    bank: z.string().optional(),
    phoneNumber: z.string().optional(),
    reference: z.string().optional()
  }),
  customerInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string()
  })
});

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );

    if (!session.user?.user_id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validar datos del pedido
    const validatedData = OrderSchema.parse(body);

    // Verificar que el usuario exista
    const user = await prisma.user.findUnique({
      where: { user_id: session.user.user_id }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener el estado inicial "Pendiente de Pago" o crearlo si no existe
    let pendingStatus = await prisma.orderStatus.findFirst({
      where: { status_name: "pending_payment" }
    });

    if (!pendingStatus) {
      pendingStatus = await prisma.orderStatus.create({
        data: { status_name: "pending_payment" }
      });
    }

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        order_number: validatedData.orderNumber,
        user_id: session.user.user_id,
        order_status_id: pendingStatus.order_status_id,
        delivery_method: "pickup", // Por defecto, pickup
        order_date: new Date(),
        order_details: {
          create: validatedData.items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price
          }))
        }
      },
      include: {
        order_details: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        orderStatus: true
      }
    });

    // Crear historial de estado
    await prisma.orderStatusHistory.create({
      data: {
        order_id: order.order_id,
        order_status_id: pendingStatus.order_status_id,
        change_date: new Date(),
        notes: "Pedido iniciado vía WhatsApp - Esperando confirmación de pago"
      }
    });

    // Formatear respuesta
    const formattedOrder = {
      order_id: order.order_id,
      order_number: order.order_number,
      order_date: order.order_date,
      order_status_id: order.order_status_id,
      delivery_method: order.delivery_method,
      order_status: order.orderStatus,
      order_details: order.order_details.map(detail => ({
        order_detail_id: detail.order_detail_id,
        product_id: detail.product_id,
        quantity: detail.quantity,
        unit_price: detail.unit_price,
        product: {
          name: detail.product?.name || 'Producto',
          image: detail.product?.image || '/placeholder-product.jpg'
        }
      })),
      total: validatedData.total,
      payment_method: validatedData.paymentMethod,
      payment_details: validatedData.paymentDetails
    };

    return NextResponse.json({
      success: true,
      data: formattedOrder,
      message: "Pedido iniciado exitosamente"
    });

  } catch (error) {
    console.error("Error iniciando pedido WhatsApp:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Datos inválidos", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );

    if (!session.user?.user_id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener pedidos pendientes del usuario
    const pendingOrders = await prisma.order.findMany({
      where: {
        user_id: session.user.user_id,
        orderStatus: {
          status_name: "pending_payment"
        }
      },
      include: {
        order_details: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        orderStatus: true
      },
      orderBy: {
        order_date: "desc"
      }
    });

    const formattedOrders = pendingOrders.map(order => ({
      order_id: order.order_id,
      order_number: order.order_number,
      order_date: order.order_date,
      order_status_id: order.order_status_id,
      delivery_method: order.delivery_method,
      order_status: order.orderStatus,
      order_details: order.order_details.map(detail => ({
        order_detail_id: detail.order_detail_id,
        product_id: detail.product_id,
        quantity: detail.quantity,
        unit_price: detail.unit_price,
        product: {
          name: detail.product?.name || 'Producto',
          image: detail.product?.image || '/placeholder-product.jpg'
        }
      }))
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders,
      count: formattedOrders.length
    });

  } catch (error) {
    console.error("Error obteniendo pedidos pendientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
