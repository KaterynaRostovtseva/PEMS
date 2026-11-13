import { z } from "zod";

export const calculatePaymentSchema = z.object({
  userId: z.string().uuid("userId должен быть UUID"),
  periodMonth: z.number().int().min(1).max(12),
  periodYear: z.number().int().min(2000).max(2100),
});

export type CalculatePaymentInput = z.infer<typeof calculatePaymentSchema>;
