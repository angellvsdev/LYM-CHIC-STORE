import { NextRequest, NextResponse } from "next/server";
// import { getIronSession } from "iron-session";
// import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { User } from "@/types";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ProductSchema } from "@/lib/utils/validation/schemas";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

// type Session = {
//   user?: User;
// };

export async function GET(req: NextRequest) {
  try {
    // const response = NextResponse.next();
    // const session = await getIronSession<Session>(
    //   req,
    //   response,
    //   sessionOptions
    // );

    // if (!session.user) {
    //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }

    // Validación de parámetros de consulta
    const querySchema = z.object({
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
      search: z.string().optional(),
      sort: z
        .enum([
          "name",
          "price",
          "description",
          "id",
          "image",
          "size",
          "color",
          "featured",
          "categoryId",
        ])
        .optional(),
      order: z.enum(["asc", "desc"]).optional(),
      category_id: z.string().uuid().optional(),
      min_price: z.string().regex(/^\d+(\.\d+)?$/).optional(),
      max_price: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    });
    const parseResult = querySchema.safeParse(
      Object.fromEntries(req.nextUrl.searchParams.entries())
    );
    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          errors: parseResult.error.errors,
        },
        { status: 400 }
      );
    }
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "name";
    const order = searchParams.get("order") || "asc";
    const categoryId = searchParams.get("category_id");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
        categoryId ? { categoryId } : {},
        minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
        maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
      ].filter(Boolean),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: {
          [sort]: order,
        },
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Validar la respuesta con ProductSchema[]
    const productsValidation = z.array(ProductSchema).safeParse(products);
    if (!productsValidation.success) {
      return NextResponse.json(
        {
          message: "Invalid product data returned from database",
          errors: productsValidation.error.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
