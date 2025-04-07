import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { CreateProductSchema } from "@/lib/utils/validation/schemas";
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

    if (!session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    if (session.user.role !== "admin") {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    const body = await req.json();
    const validatedData = CreateProductSchema.parse(body);

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
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
