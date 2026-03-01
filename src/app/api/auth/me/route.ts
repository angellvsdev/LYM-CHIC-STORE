import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const response = NextResponse.next();

  const session = await getIronSession<IronSessionData>(
    req,
    response,
    sessionOptions
  );

  if (!session.user?.user_id) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    // Obtener datos frescos de la base de datos
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
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Actualizar sesión con datos frescos
    session.user = {
      user_id: user.user_id,
      name: user.name,
      email_address: user.email_address,
      phone_number: user.phone_number,
      registration_date: user.registration_date,
      role: user.role,
      age: user.age || undefined,
      gender: user.gender || undefined,
    };
    await session.save();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error getting user data:", error);
    // Fallback: devolver datos de la sesión si hay error con la DB
    return NextResponse.json({ user: session.user }, { status: 200 });
  }
}
