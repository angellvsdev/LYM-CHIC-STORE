import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { compare } from "bcrypt";
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

    const isValid = await compare(validatedData.password, user.password);

    if (!isValid) {
      throw createError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const response = NextResponse.json(
      { message: "Login successful" },
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
      role: user.role,
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
