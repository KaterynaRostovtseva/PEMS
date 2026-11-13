import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Название клиента обязательно"),
  email: z.string().email("Некорректный email").optional().nullable(),
  phone: z.string().optional().nullable(),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
