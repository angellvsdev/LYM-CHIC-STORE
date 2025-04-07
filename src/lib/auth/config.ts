import {
  SessionOptions,
  getIronSession,
  IronSession,
  IronSessionData,
} from "iron-session";
import { User } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export const sessionOptions: SessionOptions = {
  password:
    process.env.SECRET_COOKIE_PASSWORD || "your-secret-password-min-32-chars",
  cookieName: "lymchic-store-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

declare module "next" {
  interface NextApiRequest {
    session: IronSession<IronSessionData>;
  }
}

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const withSession = (handler: Handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getIronSession(req, res, sessionOptions);
      req.session = session;
      return handler(req, res);
    } catch (error) {
      console.error("Session error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
