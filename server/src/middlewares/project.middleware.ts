import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { Role } from '../lib/prisma-client.js';
import { prisma } from "../lib/prisma.js";
import { tr } from "../i18n/index.js";

/**
 * Перевіряє доступ до проєкту в межах організації:
 * - проєкт має належати organizationId з JWT
 * - OWNER / MANAGER мають повний доступ у своїй організації
 * - EMPLOYEE бачить проєкт лише якщо є запис у ProjectMember
 */
export const checkProjectAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: tr(req, "Необходима авторизация") });
    }

    const projectId = req.params.projectId || req.body.projectId;
    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ error: tr(req, "Некорректный или отсутствующий projectId") });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: user.organizationId,
      },
      select: { id: true },
    });

    if (!project) {
      return res.status(404).json({ error: tr(req, "Проект не найден") });
    }

    if (user.role === Role.OWNER || user.role === Role.MANAGER) {
      return next();
    }

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: tr(req, "У вас нет доступа к этому проекту") });
    }

    return next();
  } catch (error) {
    console.error("Check project access error:", error);
    return res.status(500).json({ error: tr(req, "Ошибка проверки прав доступа к проекту") });
  }
};
