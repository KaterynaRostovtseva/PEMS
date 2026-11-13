import { Prisma } from "../lib/prisma-client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { userBriefSelect } from "../utils/user-select.js";
import type {
  AssignProjectMemberInput,
  UpdateProjectMemberInput,
} from "../schemas/project-member.schema.js";

const memberInclude = {
  user: { select: userBriefSelect },
} as const;

export class ProjectMemberService {
  private static async assertProject(organizationId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId },
      select: { id: true },
    });
    if (!project) throw new AppError("Проект не найден", 404);
    return project;
  }

  static async list(organizationId: string, projectId: string) {
    await this.assertProject(organizationId, projectId);
    return prisma.projectMember.findMany({
      where: { projectId },
      include: memberInclude,
      orderBy: { createdAt: "asc" },
    });
  }

  static async assign(
    organizationId: string,
    projectId: string,
    data: AssignProjectMemberInput
  ) {
    await this.assertProject(organizationId, projectId);

    const user = await prisma.user.findFirst({
      where: { id: data.userId, organizationId, isActive: true },
      select: { id: true },
    });
    if (!user) throw new AppError("Сотрудник не найден", 404);

    try {
      return await prisma.projectMember.create({
        data: {
          projectId,
          userId: data.userId,
          roleInProject: data.roleInProject ?? null,
        },
        include: memberInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Сотрудник уже добавлен в этот проект", 409);
      }
      throw error;
    }
  }

  static async update(
    organizationId: string,
    projectId: string,
    memberId: string,
    data: UpdateProjectMemberInput
  ) {
    const member = await prisma.projectMember.findFirst({
      where: { id: memberId, projectId, project: { organizationId } },
      select: { id: true },
    });
    if (!member) throw new AppError("Участник проекта не найден", 404);

    return prisma.projectMember.update({
      where: { id: memberId },
      data: {
        ...(data.roleInProject !== undefined && { roleInProject: data.roleInProject }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: memberInclude,
    });
  }

  static async remove(organizationId: string, projectId: string, memberId: string) {
    const member = await prisma.projectMember.findFirst({
      where: { id: memberId, projectId, project: { organizationId } },
      select: { id: true },
    });
    if (!member) throw new AppError("Участник проекта не найден", 404);

    await prisma.projectMember.delete({ where: { id: memberId } });
  }
}
