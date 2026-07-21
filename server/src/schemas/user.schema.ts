import { z } from 'zod';

// Схема для создания пользователя (POST /users)
export const createUserSchema = z.object({
  email: z
    .string({ message: 'Email должен быть строкой' })
    .min(1, 'Email обязателен')
    .email('Некорректный формат email'),
  name: z
    .string({ message: 'Имя должно быть строкой' })
    .min(2, 'Имя должно содержать минимум 2 символа')
    .optional(),
  password: z
    .string({ message: 'Пароль должен быть строкой' })
    .min(6, 'Пароль должен содержать минимум 6 символов'), // 👈 добавили обязательный пароль
});

// Схема для обновления пользователя (PATCH /users/:id)
export const updateUserSchema = createUserSchema.partial();