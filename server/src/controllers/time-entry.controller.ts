import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { TimeEntryStatus } from "../lib/prisma-client.js";
import { TimeEntryService } from "../services/time-entry.service.js";
import {
  createTimeEntrySchema,
  updateTimeEntrySchema,
  moderateTimeEntrySchema,
} from "../schemas/time-entry.schema.js";
import { localize } from "../i18n/index.js";

export class TimeEntryController {
  static getAll(req: AuthRequest, res: Response, next: NextFunction) {
    return TimeEntryController.list(req, res, next);
  }

  static async getMy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const entries = await TimeEntryService.list(
        req.user!.organizationId,
        { userId: req.user!.userId, role: req.user!.role },
        { userId: req.user!.userId },
        req.query
      );
      res.json(entries);
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const entry = await TimeEntryService.moderate(
        req.user!.organizationId,
        req.params.id as string,
        TimeEntryStatus.APPROVED
      );
      res.json(entry);
    } catch (error) {
      next(error);
    }
  }

  static async reject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const entry = await TimeEntryService.moderate(
        req.user!.organizationId,
        req.params.id as string,
        TimeEntryStatus.REJECTED
      );
      res.json(entry);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId, userId, status } = req.query;
      const entries = await TimeEntryService.list(
        req.user!.organizationId,
        { userId: req.user!.userId, role: req.user!.role },
        {
          projectId: typeof projectId === "string" ? projectId : undefined,
          userId: typeof userId === "string" ? userId : undefined,
          status:
            typeof status === "string" &&
            Object.values(TimeEntryStatus).includes(status as TimeEntryStatus)
              ? (status as TimeEntryStatus)
              : undefined,
        },
        req.query
      );
      res.json(entries);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createTimeEntrySchema.parse(req.body);
      const entry = await TimeEntryService.create(
        req.user!.organizationId,
        { userId: req.user!.userId, role: req.user!.role },
        data
      );
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateTimeEntrySchema.parse(req.body);
      const entry = await TimeEntryService.update(
        req.user!.organizationId,
        { userId: req.user!.userId, role: req.user!.role },
        req.params.id as string,
        data
      );
      res.json(entry);
    } catch (error) {
      next(error);
    }
  }

  static async moderate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = moderateTimeEntrySchema.parse(req.body);
      const entry = await TimeEntryService.moderate(
        req.user!.organizationId,
        req.params.id as string,
        status
      );
      res.json(entry);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await TimeEntryService.delete(
        req.user!.organizationId,
        { userId: req.user!.userId, role: req.user!.role },
        req.params.id as string
      );
      res.json(localize(req, { message: "Запись времени удалена" }));
    } catch (error) {
      next(error);
    }
  }
}
