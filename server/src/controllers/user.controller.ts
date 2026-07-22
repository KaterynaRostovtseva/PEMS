import 'dotenv/config';
import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';
import { ZodError } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from "../services/user.service.js";

export class UserController {
  // GET /users
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.dir(error, { depth: null });
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  }

  // GET /users/:id
  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении пользователя' });
    }
  }

  // POST /users
  static async create(req: Request, res: Response) {
    try {
      // 1. Проверяем req.body через Zod
      const validatedData = createUserSchema.parse(req.body);

      // 2. Если проверка прошла успешно, передаем валидные данные в сервис
      const newUser = await UserService.createUser(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      // Если Zod нашёл ошибки в формате данных
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Ошибка валидации', 
          details: error.issues.map(err => err.message) 
        });
      }
      // 🔍 ТЕПЕРЬ МЫ УВИДИМ ТОЧНЫЙ ТЕКСТ И КОД ОШИБКИ В ТЕРМИНАЛЕ
    console.log('--- ПОДРОБНОСТИ ОШИБКИ ---');
    console.dir(error, { depth: null });
    console.log('---------------------------')
      console.error('Ошибка создания пользователя:', error);
      res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
  }

  // PATCH /users/:id
  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      // Проверяем входные данные
      const validatedData = updateUserSchema.parse(req.body);

      const existingUser = await UserService.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const updatedUser = await UserService.updateUser(id, validatedData);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Ошибка валидации', 
          details: error.issues.map(err => err.message) 
        });
      }
      res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
    }
  }

  // PATCH /users/:id/role
  static async updateRole(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { role } = req.body;

      // Проверяем, существует ли такая роль в Prisma энаме
      if (!Object.values(Role).includes(role)) {
        return res.status(400).json({ error: 'Недопустимая роль' });
      }

      const existingUser = await UserService.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      // Обновляем только роль через прямой вызов prisma или метод сервиса
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, email: true, name: true, role: true },
      });

      res.json({ message: 'Роль успешно обновлена', user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении роли' });
    }
  }

  // DELETE /users/:id
  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const existingUser = await UserService.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      await UserService.deleteUser(id);
      res.json({ message: `Пользователь с ID ${id} успешно удален` });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
  }
}