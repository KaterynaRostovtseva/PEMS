import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';
import { Role } from '@prisma/client';
import { prisma } from '../services/user.service.js';

export const checkProjectAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const rawProjectId = req.params.projectId || req.body.projectId;
    const projectId = Number(rawProjectId);

    // 1. Проверка валидности переданного ID
    if (!rawProjectId || isNaN(projectId)) {
      return res.status(400).json({ error: 'Некорректный или отсутствующий projectId' });
    }

    // 2. Владелец (OWNER) имеет полный доступ
    if (role === Role.OWNER) {
      return next();
    }

    // 3. Проверка существования проекта и прав Менеджера
    if (role === Role.MANAGER) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, managerId: true }, // Выбираем только необходимые поля для оптимизации
      });

      if (!project) {
        return res.status(404).json({ error: 'Проект не найден' });
      }

      if (project.managerId !== userId) {
        return res.status(403).json({ error: 'У вас нет доступа к управлению этим проектом' });
      }

      return next();
    }

    // Для остальных ролей (например, EMPLOYEE)
    return res.status(403).json({ error: 'Недостаточно прав для выполнения этого действия' });
  } catch (error) {
    console.error('Check project access error:', error);
    return res.status(500).json({ error: 'Ошибка проверки прав доступа к проекту' });
  }
};