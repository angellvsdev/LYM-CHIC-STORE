import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { hash } from "bcrypt";
import { CreateUserSchema } from "@/lib/utils/validation/schemas";
import { createError } from "@/lib/utils/api/error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = CreateUserSchema.parse(body);

    // Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: {
        email_address: validatedData.email_address,
      },
    });

    if (existingUser) {
      throw createError(
        "Email already registered",
        409,
        "EMAIL_ALREADY_REGISTERED"
      );
    }

    if (!validatedData.password) {
      throw createError("Password is required", 400, "PASSWORD_REQUIRED");
    }

    // Hashear la contraseña
    const hashedPassword = await hash(validatedData.password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email_address: validatedData.email_address,
        phone_number: validatedData.phone_number,
        password: hashedPassword,
        registration_date: new Date(),
      },
    });

    // Retornar el usuario creado (sin la contraseña)
    const userWithoutPassword = {
      user_id: user.user_id,
      name: user.name,
      email_address: user.email_address,
      phone_number: user.phone_number,
      registration_date: user.registration_date,
    };

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
