import type { Response, NextFunction } from "express";
import { z } from "zod";
import type { AuthRequest } from "../types/auth.js";
import { ProjectService } from "../services/project.service.js";

const projectBodySchema = z.object({
  name: z.string().trim().min(1, "Название проекта обязательно"),
  code: z.string().trim().min(1, "Код проекта обязателен"),
  color: z.string().trim().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).optional(),
  budget: z.number().nullable().optional(),
  clientId: z.string().uuid().nullable().optional(),
  managerId: z.string().uuid().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

export class ProjectController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, role, organizationId } = req.user!;
      const projects = await ProjectService.getProjects(organizationId, userId, role, req.query);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = projectBodySchema.parse(req.body);
      const project = await ProjectService.createProject(req.user!.organizationId, data);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getById(
        req.user!.organizationId,
        req.params.id as string
      );
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = projectBodySchema.partial().parse(req.body);
      const project = await ProjectService.update(
        req.user!.organizationId,
        req.params.id as string,
        data
      );
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProjectService.delete(req.user!.organizationId, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
