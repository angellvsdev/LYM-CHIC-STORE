import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { hashPassword } from "@/lib/auth/password";
import { LoginUserSchema } from "@/lib/utils/validation/schemas";
import { createError } from "@/lib/utils/api/error";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = LoginUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email_address: validatedData.email_address,
      },
    });

    if (!user) {
      throw createError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    if (!user.password || !validatedData.password) {
      throw createError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    // Verificar si la contraseña está hasheada (comienza con $2a$, $2b$ o $2y$)
    const isBcryptHash = user.password.startsWith('$2a$') || 
                        user.password.startsWith('$2b$') || 
                        user.password.startsWith('$2y$');
    
    let isValid = false;
    
    if (isBcryptHash) {
      // Verificar contraseña hasheada
      isValid = await compare(validatedData.password, user.password);
    } else {
      // Para compatibilidad con contraseñas en texto plano (solo durante migración)
      console.warn(`⚠️  Usuario ${user.email_address} tiene contraseña en texto plano - Debe ser actualizado`);
      isValid = validatedData.password === user.password;
      
      // Si la contraseña es correcta pero está en texto plano, actualizarla a hash
      if (isValid) {
        const hashedPassword = await hashPassword(validatedData.password);
        await prisma.user.update({
          where: { user_id: user.user_id },
          data: { password: hashedPassword }
        });
        console.log(`✅ Contraseña actualizada a hash para ${user.email_address}`);
      }
    }

    if (!isValid) {
      throw createError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const response = NextResponse.json(
      {
        user_id: user.user_id,
        name: user.name,
        email_address: user.email_address,
        phone_number: user.phone_number,
        registration_date: user.registration_date,
        role: user.role || "user",
        age: user.age,
        gender: user.gender,
      },
      { status: 200 }
    );

    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );
    session.user = {
      user_id: user.user_id,
      name: user.name,
      email_address: user.email_address,
      phone_number: user.phone_number,
      registration_date: user.registration_date,
      role: user.role || "user",
      age: user.age || undefined,
      gender: user.gender || undefined,
    };
    await session.save();

    return response;
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
