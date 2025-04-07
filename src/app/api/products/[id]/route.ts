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

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid product ID" }),
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        product_id: productId,
      },
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
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
