import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";

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

    // Obtener todos los pedidos del usuario con detalles completos
    const orders = await prisma.order.findMany({
      where: {
        user_id: session.user.user_id,
      },
      include: {
        order_details: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              }
            }
          }
        },
        orderStatus: true,
      },
      orderBy: {
        order_date: "desc",
      },
    });

    // Formatear la respuesta para que coincida con lo que espera el frontend
    const formattedOrders = orders.map(order => ({
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
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
