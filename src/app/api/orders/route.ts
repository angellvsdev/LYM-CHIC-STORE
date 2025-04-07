import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { z } from "zod";

// Schema para validar los query params
const OrderQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.coerce.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  deliveryMethod: z.string().optional(),
  sortBy: z
    .enum(["order_date", "order_status_id", "order_number"])
    .default("order_date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

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

    const body = await req.json();

    const order = await prisma.order.create({
      data: {
        user_id: session.user.user_id,
        order_number: `ORD-${Date.now()}`,
        order_date: new Date(),
        order_status_id: 1, // PENDING
        delivery_method: body.delivery_method || "STANDARD",
      },
    });

    return NextResponse.json(order, { status: 201 });
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

    // Obtener y validar los query params
    const searchParams = req.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      status: searchParams.get("status"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      deliveryMethod: searchParams.get("deliveryMethod"),
      sortBy: searchParams.get("sortBy") || "order_date",
      sortOrder: searchParams.get("sortOrder") || "desc",
    };

    const validatedParams = OrderQuerySchema.parse(queryParams);

    // Construir el where clause
    const whereClause: {
      user_id?: number;
      order_status_id?: number;
      delivery_method?: string;
      order_date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    // Si no es admin, solo puede ver sus propias órdenes
    if (session.user.role !== "admin") {
      whereClause.user_id = session.user.user_id;
    }

    // Aplicar filtros
    if (validatedParams.status) {
      whereClause.order_status_id = validatedParams.status;
    }

    if (validatedParams.deliveryMethod) {
      whereClause.delivery_method = validatedParams.deliveryMethod;
    }

    if (validatedParams.startDate || validatedParams.endDate) {
      whereClause.order_date = {};
      if (validatedParams.startDate) {
        whereClause.order_date.gte = validatedParams.startDate;
      }
      if (validatedParams.endDate) {
        whereClause.order_date.lte = validatedParams.endDate;
      }
    }

    // Calcular el offset para la paginación
    const offset = (validatedParams.page - 1) * validatedParams.limit;

    // Obtener las órdenes con los filtros aplicados
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
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
        orderBy: {
          [validatedParams.sortBy]: validatedParams.sortOrder,
        },
        skip: offset,
        take: validatedParams.limit,
      }),
      prisma.order.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      data: orders,
      pagination: {
        total,
        page: validatedParams.page,
        limit: validatedParams.limit,
        totalPages: Math.ceil(total / validatedParams.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid query parameters", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
