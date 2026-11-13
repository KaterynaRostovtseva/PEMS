import { z } from "zod";
import { TimeEntryStatus } from "../lib/prisma-client.js";

export const createTimeEntrySchema = z.object({
  projectId: z.string().uuid("projectId должен быть UUID"),
  taskId: z.string().uuid().optional().nullable(),
  date: z.string().min(1, "date обязателен"),
  hours: z.number().positive("hours должно быть > 0").max(24, "hours не больше 24"),
  comment: z.string().optional().nullable(),
});

export const updateTimeEntrySchema = z.object({
  date: z.string().optional(),
  hours: z.number().positive().max(24).optional(),
  comment: z.string().optional().nullable(),
  taskId: z.string().uuid().optional().nullable(),
});

export const moderateTimeEntrySchema = z.object({
  status: z.enum([TimeEntryStatus.APPROVED, TimeEntryStatus.REJECTED]),
});

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
export type UpdateTimeEntryInput = z.infer<typeof updateTimeEntrySchema>;
