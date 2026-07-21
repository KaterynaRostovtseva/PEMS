import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ [ERROR LOG]:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Ошибка валидации Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Ошибка валидации данных', details: err.errors });
  }

  // Ошибки Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Запись с такими уникальными данными уже существует' });
  }

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Внутренняя ошибка сервера' 
      : err.message || 'Внутренняя ошибка сервера',
  });
};