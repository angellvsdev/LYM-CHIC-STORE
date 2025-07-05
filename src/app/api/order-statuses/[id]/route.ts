import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { User } from "@/types";
import { z } from "zod";
import { OrderStatusSchema } from "@/lib/utils/validation/schemas";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

type Session = {
  user?: User;
};

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
          message: "Invalid order status ID",
          errors: parseResult.error.errors,
        },
        { status: 400 }
      );
    }
    const orderStatus = await prisma.orderStatus.findUnique({
      where: {
        order_status_id: parseInt(params.id),
      },
    });
    if (!orderStatus) {
      return new NextResponse(
        JSON.stringify({ message: "Order status not found" }),
        { status: 404 }
      );
    }
    // Validar la respuesta
    const statusValidation = OrderStatusSchema.safeParse(orderStatus);
    if (!statusValidation.success) {
      return NextResponse.json(
        {
          message: "Invalid order status data returned from database",
          errors: statusValidation.error.errors,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(orderStatus);
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
