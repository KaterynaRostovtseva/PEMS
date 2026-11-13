import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { ProjectMemberService } from "../services/project-member.service.js";
import {
  assignProjectMemberSchema,
  updateProjectMemberSchema,
} from "../schemas/project-member.schema.js";

export class ProjectMemberController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const members = await ProjectMemberService.list(
        req.user!.organizationId,
        req.params.projectId as string
      );
      res.json(members);
    } catch (error) {
      next(error);
    }
  }

  static async assign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = assignProjectMemberSchema.parse(req.body);
      const member = await ProjectMemberService.assign(
        req.user!.organizationId,
        req.params.projectId as string,
        data
      );
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateProjectMemberSchema.parse(req.body);
      const member = await ProjectMemberService.update(
        req.user!.organizationId,
        req.params.projectId as string,
        req.params.memberId as string,
        data
      );
      res.json(member);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProjectMemberService.remove(
        req.user!.organizationId,
        req.params.projectId as string,
        req.params.memberId as string
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
