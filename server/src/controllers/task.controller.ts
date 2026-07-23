import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { Prisma, TaskStatus } from '@prisma/client';
import { prisma } from '../services/user.service.js';

export class TaskController {
  // 📌 Создание задачи внутри проекта
  static async createTask(req: AuthRequest, res: Response) {
    try {
      const projectId = Number(req.params.projectId);
      const { title, description, assignedToId, status } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Заголовок задачи (title) обязателен' });
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          status: status || TaskStatus.TODO,
          projectId,
          assignedId: assignedToId ? Number(assignedToId) : null,
        },
        include: {
          assignee: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      return res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      return res.status(500).json({ error: 'Ошибка при создании задачи' });
    }
  }

  // 📌 Получение всех задач проекта
  static async getProjectTasks(req: AuthRequest, res: Response) {
    try {
      const projectId = Number(req.params.projectId);

      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      return res.status(500).json({ error: 'Ошибка при получении задач' });
    }
  }

  // 📌 Обновление задачи (статус, заголовок, исполнитель)
  static async updateTask(req: AuthRequest, res: Response) {
    try {
      const taskId = Number(req.params.taskId);
      const { title, description, status, assignedToId } = req.body;

      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'taskId должен быть числом' });
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(status && { status }),
          ...(assignedToId !== undefined && { assignedToId: assignedToId ? Number(assignedToId) : null }),
        },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      });

      return res.json(updatedTask);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ error: 'Задача не найдена' });
      }
      console.error('Update task error:', error);
      return res.status(500).json({ error: 'Ошибка при обновлении задачи' });
    }
  }

  // 📌 Удаление задачи
  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const taskId = Number(req.params.taskId);

      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'taskId должен быть числом' });
      }

      await prisma.task.delete({
        where: { id: taskId },
      });

      return res.json({ message: 'Задача успешно удалена' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ error: 'Задача не найдена' });
      }
      console.error('Delete task error:', error);
      return res.status(500).json({ error: 'Ошибка при удалении задачи' });
    }
  }
}