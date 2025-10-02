import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CategoriesQuerySchema } from "@/lib/utils/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Fetching categories...");
    
    // Validar parámetros de consulta con Zod
    const searchParams = req.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validatedParams = CategoriesQuerySchema.parse(queryParams);
    
    const {
      page,
      limit,
      sort,
      order,
      featured
    } = validatedParams;
    
    const skip = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const where: Prisma.CategoryWhereInput = {};
    
    // Filtro por featured
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Construir ordenamiento
    const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
    orderBy[sort as keyof Prisma.CategoryOrderByWithRelationInput] = order as Prisma.SortOrder;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);

    console.log(`✅ Found ${categories.length} categories`);

    return NextResponse.json({
      success: true,
      data: {
        data: categories,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    
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
