import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

  try {
    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );

    session.destroy();
    await session.save();

    return response;
  } catch {
    return response;
  }
}
