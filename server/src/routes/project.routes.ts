import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { checkProjectAccess } from '../middlewares/project.middleware.js';
import { ProjectController } from '../controllers/project.controller.js';
import { Role } from '@prisma/client';

const router = Router();

// Все роуты защищены обязательной авторизацией
router.use(authenticateToken);

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: Получить список доступных проектов
 *     description: Доступно всем ролям (OWNER, MANAGER, EMPLOYEE). Возвращает проекты с фильтрацией в зависимости от прав и роли пользователя.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Список проектов успешно получен
 *       401:
 *         description: Неавторизованный доступ
 *       403:
 *         description: Недостаточно прав
 */
router.get('/', authorizeRoles(Role.OWNER, Role.MANAGER, Role.EMPLOYEE), ProjectController.getProjects);

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Создать новый проект
 *     description: Создание нового проекта. Доступно только пользователям с ролью OWNER.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Новый корпоративный сайт
 *               description:
 *                 type: string
 *                 example: Разработка фронтенда и бэкенда для клиентского портала
 *     responses:
 *       201:
 *         description: Проект успешно создан
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 *       403:
 *         description: Недостаточно прав (требуется OWNER)
 */
router.post('/', authorizeRoles(Role.OWNER), ProjectController.createProject);

/**
 * @openapi
 * /projects/{projectId}/employees:
 *   post:
 *     summary: Назначить сотрудника на проект
 *     description: Добавление сотрудника к проекту. Доступно для роли OWNER или для MANAGER, закрепленного за этим проектом.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID проекта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Сотрудник успешно назначен на проект
 *       400:
 *         description: Ошибка запроса
 *       401:
 *         description: Неавторизованный доступ
 *       403:
 *         description: Недостаточно прав или нет доступа к данному проекту
 *       404:
 *         description: Проект или сотрудник не найден
 */
router.post(
  '/:projectId/employees', 
  authorizeRoles(Role.OWNER, Role.MANAGER), 
  checkProjectAccess, 
  ProjectController.assignEmployee
);

export default router;