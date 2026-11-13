import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { FileService } from "../services/file.service.js";
import { Role } from "../lib/prisma-client.js";
import { AppError } from "../utils/appError.js";
import { localize } from "../i18n/index.js";

export class FileController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await FileService.list(req.user!.organizationId, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const asset = await FileService.getById(req.user!.organizationId, req.params.id as string);
      res.json(asset);
    } catch (error) {
      next(error);
    }
  }

  static async upload(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new AppError("Файл обязателен (поле file)", 400);
      const setAsAvatar = req.body?.asAvatar === "true" || req.body?.asAvatar === true;
      const asset = await FileService.upload(
        req.user!.organizationId,
        req.user!.userId,
        req.file,
        setAsAvatar
      );
      res.status(201).json(asset);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isManager =
        req.user!.role === Role.OWNER || req.user!.role === Role.MANAGER;
      await FileService.delete(
        req.user!.organizationId,
        req.params.id as string,
        req.user!.userId,
        isManager
      );
      res.json(localize(req, { message: "Файл удалён" }));
    } catch (error) {
      next(error);
    }
  }
}
