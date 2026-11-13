import { z } from "zod";

export const firstNameSchema = z
  .string()
  .trim()
  .min(1, "Имя обязательно")
  .max(80, "Имя слишком длинное");

export const lastNameSchema = z
  .string()
  .trim()
  .min(1, "Фамилия обязательна")
  .max(80, "Фамилия слишком длинная");

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Отображаемое имя не может быть пустым")
  .max(80, "Отображаемое имя слишком длинное")
  .nullable();
