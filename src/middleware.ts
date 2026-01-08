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
  const pathname = request.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApiRoute = pathname.startsWith("/api/admin/") || pathname.includes("/api/") && pathname.includes("/admin");

  // Solo manejar rutas /api y /admin
  if (!isApiRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // Excluir rutas públicas
  if (
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/register"
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

    // Proteger rutas de admin en servidor
    if (isAdminRoute || isAdminApiRoute) {
      if (!session.user) {
        if (isAdminApiRoute) {
          return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
          });
        }
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      if ((session.user.role || "user") !== "admin") {
        if (isAdminApiRoute) {
          return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
            status: 403,
          });
        }
        const url = request.nextUrl.clone();
        url.pathname = "/profile";
        return NextResponse.redirect(url);
      }

      return response;
    }

    // if (!session.user) {
    //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }

    // Verificar roles para rutas específicas
    if (pathname.startsWith("/api/orders")) {
      // Asegurar que el usuario tenga el rol correcto
      if (session.user && !session.user.role) {
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
  matcher: ["/api/:path*", "/admin", "/admin/:path*"],
};
