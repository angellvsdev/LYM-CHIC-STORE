import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { createResponse } from "@/lib/utils/api/response";
import { z } from "zod";
import { CreateOrderSchema } from "@/lib/utils/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );

    if (!session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Verificar que el usuario tenga el rol correcto
    if (!session.user) {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    const body = await req.json();
    const parseResult = CreateOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Validation Error", errors: parseResult.error.errors },
        { status: 400 }
      );
    }
    const validatedData = parseResult.data;

    const order = await prisma.order.create({
      data: {
        user_id: session.user.user_id,
        order_number: `ORD-${Date.now()}`,
        order_date: new Date(),
        order_status_id: 1, // PENDING
        delivery_method: validatedData.delivery_method || "STANDARD",
      },
    });

    return createResponse(order, 201, {
      "Content-Type": "application/json",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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

    if (!session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Verificar que el usuario tenga el rol correcto
    if (session.user.role !== "admin") {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    // Obtener el ID de la orden de los query params si existe
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get("id");

    if (orderId) {
      // Buscar una orden específica por ID
      const order = await prisma.order.findFirst({
        where: {
          order_id: parseInt(orderId),
          user_id: session.user.user_id, // Asegurar que la orden pertenece al usuario
        },
        include: {
          order_details: true,
          orderStatus: true,
        },
      });

      if (!order) {
        return new NextResponse(
          JSON.stringify({ message: "Order not found" }),
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(order);
    }

    // Si no hay ID, obtener todas las órdenes del usuario
    const orders = await prisma.order.findMany({
      where: {
        user_id: session.user.user_id,
      },
      include: {
        orderStatus: true,
      },
      orderBy: {
        order_date: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
