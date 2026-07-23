import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { checkProjectAccess } from '../middlewares/project.middleware.js';
import { TaskController } from '../controllers/task.controller.js';
import { Role } from '@prisma/client';

// mergeParams: true позволяет получать :projectId из родительского роута
const router = Router({ mergeParams: true });

router.use(authenticateToken);
router.use(checkProjectAccess); // Гарантирует, что у юзера есть доступ к проекту

/**
 * @openapi
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Получить задачи проекта
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список задач проекта
 *       403:
 *         description: Нет доступа к проекту
 */
router.get('/', TaskController.getProjectTasks);

/**
 * @openapi
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Создать новую задачу в проекте
 *     description: Доступно для OWNER и MANAGER проекта.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Задача создана
 *       403:
 *         description: Недостаточно прав
 */
router.post(
  '/',
  authorizeRoles(Role.OWNER, Role.MANAGER),
  TaskController.createTask
);

/**
 * @openapi
 * /projects/{projectId}/tasks/{taskId}:
 *   patch:
 *     summary: Обновить задачу (статус, исполнитель, описание)
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Задача обновлена
 */
router.patch('/:taskId', TaskController.updateTask);

/**
 * @openapi
 * /projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Удалить задачу
 *     description: Доступно для OWNER и MANAGER проекта.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Задача удалена
 */
router.delete(
  '/:taskId',
  authorizeRoles(Role.OWNER, Role.MANAGER),
  TaskController.deleteTask
);

export default router;