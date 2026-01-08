import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/lib/utils/validation/schemas";
import { User } from "@/types";

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
    const parseResult = CreateCategorySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Validation Error",
          errors: parseResult.error.errors,
        },
        { status: 400 }
      );
    }
    // Asegura que 'featured' siempre esté presente y sea boolean
    const validatedData = { ...parseResult.data, featured: parseResult.data.featured ?? false };

    const category = await prisma.category.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: category, message: "Category created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
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
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return new NextResponse(
        JSON.stringify({ message: "Category ID is required" }),
        { status: 400 }
      );
    }
    const body = await req.json();
    const parseResult = UpdateCategorySchema.safeParse(body);
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

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: category, message: "Category updated" });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
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
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return new NextResponse(
        JSON.stringify({ message: "Category ID is required" }),
        { status: 400 }
      );
    }

    const referencedProducts = await prisma.product.count({
      where: { categoryId },
    });

    if (referencedProducts > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with existing products",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json({ success: true, message: "Category deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
