import { NextApiRequest } from "next";
import { User } from "@/types";
import { createError } from "../utils/api/error";

export const requireAuth = async (req: NextApiRequest) => {
  if (!req.session.user) {
    throw createError("Unauthorized", 401, "UNAUTHORIZED");
  }
  return req.session.user;
};

export const login = async (req: NextApiRequest, user: User) => {
  req.session.user = user;
  await req.session.save();
};

export const logout = async (req: NextApiRequest) => {
  req.session.destroy();
};

export const getCurrentUser = (req: NextApiRequest): User | null => {
  return req.session.user || null;
};
