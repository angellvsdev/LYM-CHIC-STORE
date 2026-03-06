import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductsQuerySchema } from "@/lib/utils/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Fetching products...");

    // Validar parámetros de consulta con Zod
    const searchParams = req.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = ProductsQuerySchema.parse(queryParams);

    const {
      category_id,
      search,
      page,
      limit,
      sort,
      order,
      min_price,
      max_price,
      featured
    } = validatedParams;

    const skip = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const where: Prisma.ProductWhereInput = {};

    // Filtro por categoría
    if (category_id) {
      where.categoryId = category_id;
    }

    // Filtro por destacado
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Filtro por precio
    if (min_price > 0 || max_price < 1000) {
      where.price = {
        gte: min_price,
        lte: max_price,
      };
    }

    // Búsqueda por nombre o descripción
    if (search && search.trim() !== "") {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Construir ordenamiento
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    orderBy[sort as keyof Prisma.ProductOrderByWithRelationInput] = order as Prisma.SortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    console.log(`✅ Found ${products.length} products`);

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
    console.error("❌ Error fetching products:", error);

    // Manejar errores de validación de Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          error: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
