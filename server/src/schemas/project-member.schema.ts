import { z } from "zod";

const projectRoles = [
  "PROJECT_MANAGER",
  "TEAM_LEAD",
  "DEVELOPER",
  "DESIGNER",
  "QA",
  "DEVOPS",
  "ANALYST",
  "BUSINESS_ANALYST",
] as const;

export const assignProjectMemberSchema = z.object({
  userId: z.string().uuid("userId должен быть UUID"),
  roleInProject: z.enum(projectRoles).optional().nullable(),
});

export const updateProjectMemberSchema = z.object({
  roleInProject: z.enum(projectRoles).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type AssignProjectMemberInput = z.infer<typeof assignProjectMemberSchema>;
export type UpdateProjectMemberInput = z.infer<typeof updateProjectMemberSchema>;
