import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
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
 *                 example: StrongPassword123
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 */
router.post('/register', AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Вход пользователя в систему
 *     tags: [Auth]
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
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает токены
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/login', AuthController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Обновление пары JWT токенов
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Токены успешно обновлены
 *       401:
 *         description: Refresh-токен недействителен или отсутствует
 */
router.post('/refresh', AuthController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Выход пользователя из системы
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успешный выход
 */
router.post('/logout', AuthController.logout);

export default router;