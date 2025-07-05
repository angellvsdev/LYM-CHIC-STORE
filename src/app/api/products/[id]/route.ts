import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { User } from "@/types";
import { z } from "zod";
import { ProductSchema } from "@/lib/utils/validation/schemas";

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

    // Validar que el id sea un UUID válido
    const idSchema = z.string().uuid();
    const parseResult = idSchema.safeParse(params.id);
    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Invalid product ID", errors: parseResult.error.errors },
        { status: 400 }
      );
    }
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        {
          status: 404,
        }
      );
    }
    // Validar la respuesta
    const productValidation = ProductSchema.safeParse(product);
    if (!productValidation.success) {
      return NextResponse.json(
        {
          message: "Invalid product data returned from database",
          errors: productValidation.error.errors,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
