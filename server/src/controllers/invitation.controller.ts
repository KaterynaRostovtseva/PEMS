import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { InviteService } from "../services/invite.service.js";
import { createInviteSchema } from "../schemas/auth.schema.js";

export class InvitationController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invites = await InviteService.list(req.user!.organizationId);
      res.json(invites);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
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

  static async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invite = await InviteService.cancel(
        req.user!.organizationId,
        req.params.id as string
      );
      res.json(invite);
    } catch (error) {
      next(error);
    }
  }
}
