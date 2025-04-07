import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { UpdateOrderSchema } from "@/lib/utils/validation/schemas";
import { User } from "@/types";

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

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid order ID" }), {
        status: 400,
      });
    }

    const body = await req.json();
    const validatedData = UpdateOrderSchema.parse(body);

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

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid order ID" }), {
        status: 400,
      });
    }

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

export async function GET(
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

    if (!session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid order ID" }), {
        status: 400,
      });
    }

    // Construir el where clause
    const whereClause: {
      order_id: number;
      user_id?: number;
    } = {
      order_id: orderId,
    };

    // Si no es admin, solo puede ver sus propias órdenes
    if (session.user.role !== "admin") {
      whereClause.user_id = session.user.user_id;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        orderStatus: true,
        order_details: true,
        user: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse(JSON.stringify({ message: "Order not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
