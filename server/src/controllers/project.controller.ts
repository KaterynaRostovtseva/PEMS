import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';
import { prisma } from '../services/user.service.js';


export class ProjectController {
  // 👑 Создание проекта (Только OWNER)
  static async createProject(req: AuthRequest, res: Response) {
    try {
      const { title, managerId, status } = req.body;

      const project = await prisma.project.create({
        data: {
          title,
          status: status || 'PLANNED',
          managerId: managerId ? Number(managerId) : null,
        },
      });

      return res.status(201).json(project);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при создании проекта' });
    }
  }

  // 👔 Назначение сотрудника на проект
  static async assignEmployee(req: AuthRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { employeeId } = req.body;

      const project = await prisma.project.update({
        where: { id: Number(projectId) },
        data: {
          employees: {
            connect: { id: Number(employeeId) },
          },
        },
        include: { employees: true, manager: true },
      });

      return res.json(project);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при назначении сотрудника' });
    }
  }

  // 👷 Просмотр проектов в зависимости от роли
  static async getProjects(req: AuthRequest, res: Response) {
    try {
      const { userId, role } = req.user!;

      if (role === Role.OWNER) {
        const projects = await prisma.project.findMany({
          include: { manager: true, employees: true },
        });
        return res.json(projects);
      }

      if (role === Role.MANAGER) {
        const projects = await prisma.project.findMany({
          where: { managerId: userId },
          include: { manager: true, employees: true },
        });
        return res.json(projects);
      }

      // Для обычного сотрудника
      const projects = await prisma.project.findMany({
        where: {
          employees: { some: { id: userId } },
        },
        include: { manager: true },
      });
      return res.json(projects);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при получении проектов' });
    }
  }
}