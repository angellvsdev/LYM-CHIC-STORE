import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { User } from "@/types";
import { Prisma } from "@prisma/client";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

type Session = {
  user?: User;
};

export async function GET(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.OrderStatusWhereInput = {
      OR: [
        {
          status_name: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
        {
          status_description: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const [orderStatuses, total] = await Promise.all([
      prisma.orderStatus.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.orderStatus.count({ where }),
    ]);

    return NextResponse.json({
      data: orderStatuses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching order statuses:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
