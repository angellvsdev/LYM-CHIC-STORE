import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { User } from "@/types";

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

    if (!session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const orderStatusId = parseInt(params.id);
    if (isNaN(orderStatusId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid order status ID" }),
        { status: 400 }
      );
    }

    const orderStatus = await prisma.orderStatus.findUnique({
      where: {
        order_status_id: orderStatusId,
      },
    });

    if (!orderStatus) {
      return new NextResponse(
        JSON.stringify({ message: "Order status not found" }),
        { status: 404 }
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
