import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "./lib/auth/config";
import { User } from "./types";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export async function middleware(request: NextRequest) {
  // Solo aplicar el middleware a las rutas de la API
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Excluir rutas públicas
  if (
    request.nextUrl.pathname === "/api/auth/login" ||
    request.nextUrl.pathname === "/api/auth/register"
  ) {
    return NextResponse.next();
  }

  try {
    const response = NextResponse.next();
    const session = await getIronSession<IronSessionData>(
      request,
      response,
      sessionOptions
    );

    // if (!session.user) {
    //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }

    // Verificar roles para rutas específicas
    if (request.nextUrl.pathname.startsWith("/api/orders")) {
      // Asegurar que el usuario tenga el rol correcto
      if (!session.user.role) {
        session.user.role = "user";
        await session.save();
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export const config = {
  matcher: "/api/:path*",
};
