import { z } from "zod";
import { firstNameSchema, lastNameSchema } from "./person.schema.js";

export const registerSchema = z.object({
  companyName: z.string().min(1, "Название компании обязательно"),
  email: z.string().email("Некорректный формат email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Некорректный формат email"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Некорректный формат email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "token обязателен"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "token обязателен"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export const createInviteSchema = z.object({
  email: z.string().email("Некорректный формат email"),
  role: z.enum(["MANAGER", "EMPLOYEE"]).optional(),
  position: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
