import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { ProfileService } from "../services/profile.service.js";
import { changePasswordSchema, updateProfileSchema } from "../schemas/profile.schema.js";
import { AppError } from "../utils/appError.js";
import { localize } from "../i18n/index.js";

export class ProfileController {
  static async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await ProfileService.getProfile(
        req.user!.userId,
        req.user!.organizationId
      );
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateProfileSchema.parse(req.body);
      const profile = await ProfileService.updateProfile(
        req.user!.userId,
        req.user!.organizationId,
        data
      );
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = changePasswordSchema.parse(req.body);
      const result = await ProfileService.changePassword(
        req.user!.userId,
        req.user!.organizationId,
        data
      );
      res.json(localize(req, result));
    } catch (error) {
      next(error);
    }
  }

  static async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new AppError("Файл обязателен (поле file)", 400);
      if (!req.file.mimetype.startsWith("image/")) {
        throw new AppError("Аватар должен быть изображением", 400);
      }
      const profile = await ProfileService.updateAvatar(
        req.user!.userId,
        req.user!.organizationId,
        req.file
      );
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async removeAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await ProfileService.removeAvatar(
        req.user!.userId,
        req.user!.organizationId
      );
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
}
