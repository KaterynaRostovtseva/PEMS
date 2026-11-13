import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

const stageStatuses = ["TODO", "ACTIVE", "COMPLETED"] as const;
type StageStatusValue = (typeof stageStatuses)[number];

export type StageInput = {
  name?: string;
  order?: number;
  status?: StageStatusValue;
};

export class ProjectStageService {
  private static async assertProject(organizationId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId },
      select: { id: true },
    });
    if (!project) throw new AppError("Проект не найден", 404);
  }

  private static async findStage(organizationId: string, stageId: string) {
    const stage = await prisma.projectStage.findFirst({
      where: { id: stageId, project: { organizationId } },
    });
    if (!stage) throw new AppError("Стадия не найдена", 404);
    return stage;
  }

  static async list(organizationId: string, projectId: string) {
    await this.assertProject(organizationId, projectId);
    return prisma.projectStage.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });
  }

  static async create(
    organizationId: string,
    projectId: string,
    data: { name: string; order?: number; status?: StageStatusValue }
  ) {
    await this.assertProject(organizationId, projectId);
    return prisma.projectStage.create({
      data: {
        projectId,
        name: data.name,
        order: data.order ?? 0,
        status: data.status ?? "TODO",
      },
    });
  }

  static async update(
    organizationId: string,
    stageId: string,
    data: StageInput,
    changedById: string
  ) {
    const stage = await this.findStage(organizationId, stageId);
    const updated = await prisma.projectStage.update({
      where: { id: stageId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    if (data.status && data.status !== stage.status) {
      await prisma.projectStageHistory.create({
        data: {
          stageId,
          fromStage: stage.status,
          toStage: data.status,
          changedById,
        },
      });
    }

    return updated;
  }

  static async delete(organizationId: string, stageId: string) {
    await this.findStage(organizationId, stageId);
    await prisma.projectStage.delete({ where: { id: stageId } });
  }

  static async history(organizationId: string, stageId: string) {
    await this.findStage(organizationId, stageId);
    return prisma.projectStageHistory.findMany({
      where: { stageId },
      orderBy: { createdAt: "desc" },
    });
  }
}
