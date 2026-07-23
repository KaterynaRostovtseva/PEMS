import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { Role, Prisma } from '@prisma/client';
import { prisma } from '../services/user.service.js';

export class ProjectController {
  // 👑 Создание проекта (Только OWNER)
  static async createProject(req: AuthRequest, res: Response) {
    try {
      const { title, managerId, status } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Название проекта (title) обязательно' });
      }

      const project = await prisma.project.create({
        data: {
          title,
          status: status || 'PLANNED',
          managerId: managerId ? Number(managerId) : null,
        },
        include: {
          manager: true,
        },
      });

      return res.status(201).json(project);
    } catch (error) {
      console.error('Create project error:', error);
      return res.status(500).json({ error: 'Ошибка при создании проекта' });
    }
  }

  // 👔 Назначение сотрудника на проект
  static async assignEmployee(req: AuthRequest, res: Response) {
    try {
      const projectId = Number(req.params.projectId);
      const employeeId = Number(req.body.employeeId);

      // Валидация переданных ID
      if (isNaN(projectId) || isNaN(employeeId)) {
        return res.status(400).json({ error: 'projectId и employeeId должны быть числами' });
      }

      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          employees: {
            connect: { id: employeeId },
          },
        },
        include: { employees: true, manager: true },
      });

      return res.json(project);
    } catch (error) {
      // Перехватываем специфическую ошибку Prisma: запись не найдена
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({ error: 'Проект или сотрудник не найден' });
      }

      console.error('Assign employee error:', error);
      return res.status(500).json({ error: 'Ошибка при назначении сотрудника' });
    }
  }

  // 👷 Просмотр проектов в зависимости от роли
  static async getProjects(req: AuthRequest, res: Response) {
    try {
      // req.user гарантированно существует благодаря middleware authenticateToken
      const { userId, role } = req.user!;

      let projects;

      switch (role) {
        case Role.OWNER:
          projects = await prisma.project.findMany({
            include: { manager: true, employees: true },
          });
          break;

        case Role.MANAGER:
          projects = await prisma.project.findMany({
            where: { managerId: userId },
            include: { manager: true, employees: true },
          });
          break;

        case Role.EMPLOYEE:
        default:
          projects = await prisma.project.findMany({
            where: {
              employees: { some: { id: userId } },
            },
            include: { manager: true },
          });
          break;
      }

      return res.json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      return res.status(500).json({ error: 'Ошибка при получении проектов' });
    }
  }
}