import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { TaskService } from "../services/task.service.js";
import { AppError } from "../utils/appError.js";
import { localize } from "../i18n/index.js";

export class TaskController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = typeof req.query.projectId === "string" ? req.query.projectId : undefined;
      const tasks = await TaskService.list(req.user!.organizationId, { ...req.query, projectId });
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = (req.body.projectId || req.params.projectId) as string;
      const { title, description, assignedToId, status, priority } = req.body;
      if (!projectId) throw new AppError("projectId обязателен", 400);
      if (!title) throw new AppError("Заголовок задачи (title) обязателен", 400);

      const task = await TaskService.createTask(projectId, {
        title,
        description,
        assignedToId,
        status,
        priority,
        createdById: req.user!.userId,
      });
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.getById(req.user!.organizationId, req.params.id as string);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await TaskService.getById(req.user!.organizationId, req.params.id as string);
      const { title, description, status, assignedToId, priority } = req.body;
      const task = await TaskService.updateTask(existing.projectId, existing.id, {
        title,
        description,
        status,
        assignedToId,
        priority,
      });
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await TaskService.getById(req.user!.organizationId, req.params.id as string);
      const { status } = req.body;
      if (!status) throw new AppError("status обязателен", 400);
      const task = await TaskService.updateTask(existing.projectId, existing.id, { status });
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await TaskService.getById(req.user!.organizationId, req.params.id as string);
      await TaskService.deleteTask(existing.projectId, existing.id);
      res.json(localize(req, { message: "Задача успешно удалена" }));
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId as string;
      const { title, description, assignedToId, status, priority } = req.body;

      if (!title) {
        throw new AppError("Заголовок задачи (title) обязателен", 400);
      }

      const task = await TaskService.createTask(projectId, {
        title,
        description,
        assignedToId,
        status,
        priority,
        createdById: req.user!.userId,
      });

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId as string;
      const tasks = await TaskService.getProjectTasks(projectId, req.query);
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId as string;
      const taskId = req.params.taskId as string;
      const { title, description, status, assignedToId, priority } = req.body;

      const task = await TaskService.updateTask(projectId, taskId, {
        title,
        description,
        status,
        assignedToId,
        priority,
      });

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId as string;
      const taskId = req.params.taskId as string;

      await TaskService.deleteTask(projectId, taskId);
      return res.json(localize(req, { message: "Задача успешно удалена" }));
    } catch (error) {
      next(error);
    }
  }
}
