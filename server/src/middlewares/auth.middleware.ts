import type { Response, NextFunction } from "express";
import type { Role } from '../lib/prisma-client.js';
import type { AuthRequest } from "../types/auth.js";
import { verifyAccessToken } from "../lib/tokens.js";
import { tr } from "../i18n/index.js";

export type { AuthRequest } from "../types/auth.js";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: tr(req, "Нет доступа. Токен отсутствует") });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: tr(req, "Нет доступа. Токен отсутствует") });
    }

    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ error: tr(req, "Недействительный или просроченный токен доступа") });
  }
};

export const authenticateToken = authMiddleware;

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: tr(req, "Необходима авторизация") });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: tr(req, "Недостаточно прав для выполнения действия") });
    }
    next();
  };
};
