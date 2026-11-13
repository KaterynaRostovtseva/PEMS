import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";
import { tr } from "../i18n/index.js";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("❌ [ERROR LOG]:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: tr(req, err.message) });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: tr(req, "Ошибка валидации данных"),
      details: err.issues.map((issue) => tr(req, issue.message)),
    });
  }

  if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
    return res.status(400).json({
      error: tr(req, "Запись с такими уникальными данными уже существует"),
    });
  }

  // Помилки Multer
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = String((err as { code?: string }).code || "");
    if (code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: tr(req, "Файл слишком большой (макс. 10MB)") });
    }
  }
  if (err instanceof Error && err.message === "Недопустимый тип файла") {
    return res.status(400).json({ error: tr(req, err.message) });
  }

  const message = err instanceof Error ? err.message : "Внутренняя ошибка сервера";

  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? tr(req, "Внутренняя ошибка сервера")
        : tr(req, message),
  });
};
