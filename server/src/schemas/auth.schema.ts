import { z } from "zod";
import { newPasswordSchema } from "./password.schema.js";
import { firstNameSchema, lastNameSchema } from "./person.schema.js";

export const registerSchema = z.object({
  companyName: z.string().min(1, "Название компании обязательно"),
  email: z.string().email("Некорректный формат email"),
  password: newPasswordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Некорректный формат email"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const checkEmailSchema = z.object({
  email: z.string().email("Некорректный формат email"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Некорректный формат email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "token обязателен"),
  password: newPasswordSchema,
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "token обязателен"),
  password: newPasswordSchema,
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
