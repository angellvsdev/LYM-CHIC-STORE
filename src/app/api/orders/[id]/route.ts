import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { UpdateOrderSchema } from "@/lib/utils/validation/schemas";
import { User } from "@/types";
import { OrderStatusNotifier } from '@/app/services/OrderStatusNotifier';

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

type Session = {
  user?: User;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<Session>(
      req,
      response,
      sessionOptions
    );

    if (!session.user || session.user.role !== "admin") {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    // Validar que el id sea un número válido
    const idSchema = z.string().regex(/^\d+$/);
    const parseResult = idSchema.safeParse(params.id);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Invalid order ID",
          errors: parseResult.error.errors,
        },
        { status: 400 }
      );
    }
    const orderId = parseInt(params.id);

    const body = await req.json();
    const updateOrderParseResult = UpdateOrderSchema.safeParse(body);
    if (!updateOrderParseResult.success) {
      return NextResponse.json(
        {
          message: "Validation Error",
          errors: updateOrderParseResult.error.errors,
        },
        { status: 400 }
      );
    }
    const validatedData = updateOrderParseResult.data;

    // Obtener la orden antes de actualizar para verificar el estado anterior
    const existingOrder = await prisma.order.findUnique({
      where: { order_id: orderId },
      select: { order_status_id: true }
    });

    const order = await prisma.order.update({
      where: {
        order_id: orderId,
      },
      data: {
        order_status_id: validatedData.order_status_id,
      },
      include: {
        orderStatus: true,
        order_details: true,
      },
    });

    // Notificar cambio de estado si varió
    if (existingOrder && existingOrder.order_status_id !== validatedData.order_status_id) {
      await OrderStatusNotifier.notifyStatusChange(order.order_id);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<Session>(
      req,
      response,
      sessionOptions
    );

    if (!session.user || session.user.role !== "admin") {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    // Validar que el id sea un número válido
    const idSchema = z.string().regex(/^\d+$/);
    const parseResult = idSchema.safeParse(params.id);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Invalid order ID",
          errors: parseResult.error.errors,
        },
        { status: 400 }
      );
    }
    const orderId = parseInt(params.id);

    // Primero eliminamos los detalles de la orden
    await prisma.orderDetail.deleteMany({
      where: {
        order_id: orderId,
      },
    });

    // Luego eliminamos la orden
    await prisma.order.delete({
      where: {
        order_id: orderId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
