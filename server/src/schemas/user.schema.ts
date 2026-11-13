import { z } from "zod";
import { Role } from '../lib/prisma-client.js';
import { displayNameSchema, firstNameSchema, lastNameSchema } from "./person.schema.js";

export const createUserSchema = z.object({
  email: z
    .string({ message: "Email должен быть строкой" })
    .min(1, "Email обязателен")
    .email("Некорректный формат email"),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  password: z
    .string({ message: "Пароль должен быть строкой" })
    .min(6, "Пароль должен содержать минимум 6 символов"),
  role: z.nativeEnum(Role).optional(),
  position: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Некорректный формат email").optional(),
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  displayName: displayNameSchema.optional(),
  position: z.string().optional(),
  isActive: z.boolean().optional(),
});
