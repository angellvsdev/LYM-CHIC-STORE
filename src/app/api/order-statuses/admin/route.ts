import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import {
  CreateOrderStatusSchema,
  UpdateOrderStatusSchema,
} from "@/lib/utils/validation/schemas";
import { User } from "@/types";
import { z } from "zod";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

type Session = {
  user?: User;
};

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const parseResult = CreateOrderStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Validation Error",
          errors: parseResult.error.errors,
        },
        { status: 400 }
      );
    }
    const validatedData = parseResult.data;

    const orderStatus = await prisma.orderStatus.create({
      data: validatedData,
    });

    return NextResponse.json(orderStatus, { status: 201 });
  } catch (error) {
    console.error("Error creating order status:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams;
    const statusId = searchParams.get("id");

    if (!statusId) {
      return new NextResponse(
        JSON.stringify({ message: "Order status ID is required" }),
        { status: 400 }
      );
    }
    const body = await req.json();
    const parseResult = UpdateOrderStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Validation Error",
          errors: parseResult.error.errors,
        },
        { status: 400 }
      );
    }
    const validatedData = parseResult.data;

    const status = await prisma.orderStatus.update({
      where: {
        order_status_id: parseInt(statusId),
      },
      data: validatedData,
    });

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams;
    const statusId = searchParams.get("id");

    if (!statusId) {
      return new NextResponse(
        JSON.stringify({ message: "Order status ID is required" }),
        { status: 400 }
      );
    }

    await prisma.orderStatus.delete({
      where: {
        order_status_id: parseInt(statusId),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting order status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
