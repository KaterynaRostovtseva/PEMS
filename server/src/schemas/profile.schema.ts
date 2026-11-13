import { z } from "zod";
import { displayNameSchema, firstNameSchema, lastNameSchema } from "./person.schema.js";

export const updateProfileSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  displayName: displayNameSchema.optional(),
  email: z.string().email("Некорректный формат email").optional(),
  position: z.string().nullable().optional(),
  currency: z.enum(["USD", "UAH", "EUR"]).optional(),
  hourlyRate: z.number().min(0).optional(),
  isFop3Group: z.boolean().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Текущий пароль обязателен"),
  newPassword: z.string().min(6, "Новый пароль должен содержать минимум 6 символов"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
