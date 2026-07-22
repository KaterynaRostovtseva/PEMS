import type { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

interface AuthRequest extends Request {
  user?: { userId: number; role: Role };
}

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав для выполнения этого действия' });
    }

    next();
  };
};