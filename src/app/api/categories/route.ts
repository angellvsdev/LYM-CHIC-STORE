import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { User } from "@/types";
import { z } from "zod";
import { CategorySchema } from "@/lib/utils/validation/schemas";

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

    const querySchema = z.object({
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
      search: z.string().optional(),
      sort: z
        .enum(["name", "description", "id", "image", "featured"])
        .optional(),
      order: z.enum(["asc", "desc"]).optional(),
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

    const { page = "1", limit = "10", search = "", sort = "category_name", order = "asc" } = parseResult.data;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy: {
          [sort]: order,
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.category.count({
        where: {
          OR: [
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    // Validar la respuesta con CategorySchema[]
    const categoriesValidation = z.array(CategorySchema).safeParse(categories);
    if (!categoriesValidation.success) {
      return NextResponse.json(
        {
          message: "Invalid category data returned from database",
          errors: categoriesValidation.error.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: categories,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
