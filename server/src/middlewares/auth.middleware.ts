import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: Role;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as { userId: number; role: Role };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Невалидный или просроченный токен' });
  }
};

// Middleware для ограничения по ролям
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
   if (!req.user) {
      return res.status(401).json({ error: 'Необходима авторизация' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав для выполнения действия' });
    }
    next();
  };
};