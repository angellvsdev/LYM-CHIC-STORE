import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/config";

export async function GET(req: NextRequest) {
  const response = NextResponse.next();

  const session = await getIronSession<IronSessionData>(
    req,
    response,
    sessionOptions
  );

  if (!session.user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: session.user }, { status: 200 });
}
