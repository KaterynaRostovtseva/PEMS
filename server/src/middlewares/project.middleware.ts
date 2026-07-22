import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';
import { Role } from '@prisma/client';
import { prisma } from '../services/user.service.js';

export const checkProjectAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const projectId = Number(req.params.projectId || req.body.projectId);

    // Владелец имеет полный доступ ко всему
    if (role === Role.OWNER) {
      return next();
    }

    // Если пользователь Менеджер, проверяем, закреплен ли проект за ним
    if (role === Role.MANAGER) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project || project.managerId !== userId) {
        return res.status(403).json({ error: 'У вас нет доступа к управлению этим проектом' });
      }
      return next();
    }

    return res.status(403).json({ error: 'Недостаточно прав' });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка проверки прав доступа к проекту' });
  }
};