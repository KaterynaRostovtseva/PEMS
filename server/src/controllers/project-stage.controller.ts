import type { Response, NextFunction } from "express";
import { z } from "zod";
import type { AuthRequest } from "../types/auth.js";
import { ProjectStageService } from "../services/project-stage.service.js";

const stageBodySchema = z.object({
  name: z.string().trim().min(1, "Название стадии обязательно"),
  order: z.number().int().optional(),
  status: z.enum(["TODO", "ACTIVE", "COMPLETED"]).optional(),
});

export class ProjectStageController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stages = await ProjectStageService.list(
        req.user!.organizationId,
        req.params.projectId as string
      );
      res.json(stages);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = stageBodySchema.parse(req.body);
      const stage = await ProjectStageService.create(
        req.user!.organizationId,
        req.params.projectId as string,
        data
      );
      res.status(201).json(stage);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = stageBodySchema.partial().parse(req.body);
      const stage = await ProjectStageService.update(
        req.user!.organizationId,
        req.params.stageId as string,
        data,
        req.user!.userId
      );
      res.json(stage);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProjectStageService.delete(req.user!.organizationId, req.params.stageId as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async history(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const history = await ProjectStageService.history(
        req.user!.organizationId,
        req.params.stageId as string
      );
      res.json(history);
    } catch (error) {
      next(error);
    }
  }
}
