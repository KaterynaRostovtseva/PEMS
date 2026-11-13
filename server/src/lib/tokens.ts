import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import type { Role } from './prisma-client.js';
import type { CookieOptions } from "express";

export const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access";
export const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh";
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type JwtPayload = {
  userId: string;
  organizationId: string;
  role: Role;
};

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: REFRESH_TTL_MS,
};

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, ACCESS_SECRET) as unknown as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, REFRESH_SECRET) as unknown as JwtPayload;
