import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { UpdateUserSchema } from "@/lib/utils/validation/schemas";
import { z } from "zod";
import bcrypt from "bcrypt";

// Schema para actualizar perfil (incluye contraseña opcional)
const UpdateProfileSchema = UpdateUserSchema.extend({
  password: z.string().min(0).max(255).optional().refine((val) => !val || val.length >= 8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Solo validar coincidencia de contraseñas si se proporcionó una contraseña
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export async function PUT(req: NextRequest) {
  try {
    const response = NextResponse.next();
    
    // Obtener sesión del usuario
    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );

    if (!session.user?.user_id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Parsear y validar cuerpo de la solicitud
    const body = await req.json();
    const validationResult = UpdateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Datos inválidos",
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { password, confirmPassword, ...updateData } = validationResult.data;

    // Preparar datos para actualización - manejar campos opcionales
    const dataToUpdate: any = {
      name: updateData.name,
      email_address: updateData.email_address,
      phone_number: updateData.phone_number,
    };

    // Agregar campos opcionales solo si no son null
    if (updateData.age !== null && updateData.age !== undefined) {
      dataToUpdate.age = updateData.age;
      console.log('Updating age to:', updateData.age);
    }
    if (updateData.gender !== null && updateData.gender !== undefined) {
      dataToUpdate.gender = updateData.gender;
      console.log('Updating gender to:', updateData.gender);
    }

    console.log('Final data to update:', dataToUpdate);

    // Si se proporciona nueva contraseña, hashearla
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    // Actualizar usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: {
        user_id: session.user.user_id,
      },
      data: dataToUpdate,
      select: {
        user_id: true,
        name: true,
        email_address: true,
        phone_number: true,
        role: true,
        registration_date: true,
        age: true,
        gender: true,
      },
    });

    // Actualizar sesión con los nuevos datos
    session.user = {
      user_id: updatedUser.user_id,
      name: updatedUser.name,
      email_address: updatedUser.email_address,
      phone_number: updatedUser.phone_number,
      registration_date: updatedUser.registration_date,
      role: updatedUser.role,
      age: updatedUser.age || undefined,
      gender: updatedUser.gender || undefined,
    };
    await session.save();

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    
    if (error instanceof Error) {
      // Manejar errores específicos de Prisma
      if (error.message.includes("Unique constraint")) {
        if (error.message.includes("email_address")) {
          return NextResponse.json(
            { error: "El correo electrónico ya está en uso" },
            { status: 409 }
          );
        }
      }
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.next();
    
    // Obtener sesión del usuario
    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );

    if (!session.user?.user_id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener datos actualizados del usuario
    const user = await prisma.user.findUnique({
      where: {
        user_id: session.user.user_id,
      },
      select: {
        user_id: true,
        name: true,
        email_address: true,
        phone_number: true,
        role: true,
        registration_date: true,
        age: true,
        gender: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
