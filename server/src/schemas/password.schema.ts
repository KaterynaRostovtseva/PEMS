/** Новий пароль: щонайменше 8 символів, велика літера і знак. Вхід цим правилом не перевіряється. */
import { z } from "zod";

const UPPERCASE = /\p{Lu}/u;
const SYMBOL = /[^\p{L}\p{N}\s]/u;

export const newPasswordSchema = z
  .string({ message: "Пароль должен быть строкой" })
  .min(8, "Пароль должен содержать минимум 8 символов")
  .regex(UPPERCASE, "Пароль должен содержать заглавную букву")
  .regex(SYMBOL, "Пароль должен содержать знак");
