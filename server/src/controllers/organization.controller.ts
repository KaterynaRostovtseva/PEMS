import type { Response, NextFunction } from "express";
import { z } from "zod";
import type { AuthRequest } from "../types/auth.js";
import { OrganizationService } from "../services/organization.service.js";

const updateOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Название компании обязательно").max(120),
});

export class OrganizationController {
  static async getCurrent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const organization = await OrganizationService.getCurrent(req.user!.organizationId);
      res.json(organization);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name } = updateOrganizationSchema.parse(req.body);
      const organization = await OrganizationService.update(req.user!.organizationId, name);
      res.json(organization);
    } catch (error) {
      next(error);
    }
  }
}
