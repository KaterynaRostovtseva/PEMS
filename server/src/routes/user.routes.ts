
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей успешно получен
 *       401:
 *         description: Неавторизованный доступ
 */
router.get('/', UserController.getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя найдены
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:id', UserController.getById);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: SecurePassword123
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/', UserController.create);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Частично обновить данные пользователя
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: new-email@example.com
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен
 *       404:
 *         description: Пользователь не найден
 */
router.patch('/:id', UserController.update);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *       404:
 *         description: Пользователь не найден
 */
router.delete('/:id', UserController.delete);

export default router;