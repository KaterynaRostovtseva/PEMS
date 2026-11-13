import type { Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { InviteService } from "../services/invite.service.js";
import { ProfileService } from "../services/profile.service.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { changePasswordSchema, updateProfileSchema } from "../schemas/profile.schema.js";
import { createInviteSchema } from "../schemas/auth.schema.js";
import { Role } from "../lib/prisma-client.js";
import type { AuthRequest } from "../types/auth.js";
import { AppError } from "../utils/appError.js";
import { localize } from "../i18n/index.js";

export class UserController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getAllUsers(req.user!.organizationId, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
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

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
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

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await UserService.getUserById(id, req.user!.organizationId);
      if (!user) throw new AppError("Пользователь не найден", 404);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const newUser = await UserService.createUser(req.user!.organizationId, validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateUserSchema.parse(req.body);
      const updatedUser = await UserService.updateUser(id, req.user!.organizationId, validatedData);
      if (!updatedUser) throw new AppError("Пользователь не найден", 404);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { role } = req.body;

      if (!Object.values(Role).includes(role)) {
        throw new AppError("Недопустимая роль", 400);
      }
      if (id === req.user!.userId) {
        throw new AppError("Нельзя изменить свою собственную роль", 400);
      }

      const updatedUser = await UserService.updateRole(id, req.user!.organizationId, role);
      if (!updatedUser) throw new AppError("Пользователь не найден", 404);
      res.json(localize(req, { message: "Роль успешно обновлена", user: updatedUser }));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (id === req.user!.userId) {
        throw new AppError("Нельзя удалить свой собственный аккаунт", 400);
      }
      const deleted = await UserService.deleteUser(id, req.user!.organizationId);
      if (!deleted) throw new AppError("Пользователь не найден", 404);
      res.json(localize(req, { message: "Пользователь удалён" }));
    } catch (error) {
      next(error);
    }
  }

  static async invite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createInviteSchema.parse(req.body);
      const invite = await InviteService.createInvite(
        req.user!.organizationId,
        req.user!.userId,
        data
      );
      res.status(201).json(invite);
    } catch (error) {
      next(error);
    }
  }

  static async listInvites(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invites = await InviteService.list(req.user!.organizationId);
      res.json(invites);
    } catch (error) {
      next(error);
    }
  }
}
