import { Role, TimeEntryStatus } from "../lib/prisma-client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import type { CreateTimeEntryInput, UpdateTimeEntryInput } from "../schemas/time-entry.schema.js";
import { paginated, parsePagination, type PaginationQuery } from "../utils/pagination.js";
import { userNameSelect } from "../utils/user-select.js";

const timeEntryInclude = {
  project: { select: { id: true, name: true } },
  task: { select: { id: true, title: true } },
  user: { select: userNameSelect },
} as const;

export class TimeEntryService {
  private static async assertProjectAccess(
    organizationId: string,
    projectId: string,
    userId: string,
    role: Role
  ) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId },
      select: { id: true },
    });
    if (!project) throw new AppError("Проект не найден", 404);

    if (role === Role.OWNER || role === Role.MANAGER) return;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) throw new AppError("Нет доступа к этому проекту", 403);
  }

  static async list(
    organizationId: string,
    actor: { userId: string; role: Role },
    filters?: { projectId?: string; userId?: string; status?: TimeEntryStatus },
    query: PaginationQuery = {}
  ) {
    const { page, limit, skip } = parsePagination(query);
    const where: {
      project: { organizationId: string };
      projectId?: string;
      userId?: string;
      status?: TimeEntryStatus;
    } = {
      project: { organizationId },
    };

    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.status) where.status = filters.status;

    if (actor.role === Role.EMPLOYEE) {
      where.userId = actor.userId;
    } else if (filters?.userId) {
      where.userId = filters.userId;
    }

    const [total, data] = await Promise.all([
      prisma.timeEntry.count({ where }),
      prisma.timeEntry.findMany({
        where,
        include: timeEntryInclude,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async create(
    organizationId: string,
    actor: { userId: string; role: Role },
    data: CreateTimeEntryInput
  ) {
    await this.assertProjectAccess(organizationId, data.projectId, actor.userId, actor.role);

    if (data.taskId) {
      const task = await prisma.task.findFirst({
        where: { id: data.taskId, projectId: data.projectId },
      });
      if (!task) throw new AppError("Задача не найдена в этом проекте", 404);
    }

    return prisma.timeEntry.create({
      data: {
        userId: actor.userId,
        projectId: data.projectId,
        taskId: data.taskId ?? null,
        date: new Date(data.date),
        hours: data.hours,
        comment: data.comment ?? null,
        status: TimeEntryStatus.PENDING,
      },
      include: timeEntryInclude,
    });
  }

  static async update(
    organizationId: string,
    actor: { userId: string; role: Role },
    id: string,
    data: UpdateTimeEntryInput
  ) {
    const entry = await prisma.timeEntry.findFirst({
      where: { id, project: { organizationId } },
    });
    if (!entry) throw new AppError("Запись времени не найдена", 404);

    if (actor.role === Role.EMPLOYEE && entry.userId !== actor.userId) {
      throw new AppError("Можно редактировать только свои записи", 403);
    }

    if (entry.status !== TimeEntryStatus.PENDING && actor.role === Role.EMPLOYEE) {
      throw new AppError("Можно редактировать только записи со статусом PENDING", 400);
    }

    if (data.taskId) {
      const task = await prisma.task.findFirst({
        where: { id: data.taskId, projectId: entry.projectId },
      });
      if (!task) throw new AppError("Задача не найдена в этом проекте", 404);
    }

    return prisma.timeEntry.update({
      where: { id },
      data: {
        ...(data.date && { date: new Date(data.date) }),
        ...(data.hours !== undefined && { hours: data.hours }),
        ...(data.comment !== undefined && { comment: data.comment }),
        ...(data.taskId !== undefined && { taskId: data.taskId }),
      },
      include: timeEntryInclude,
    });
  }

  static async moderate(
    organizationId: string,
    id: string,
    status: typeof TimeEntryStatus.APPROVED | typeof TimeEntryStatus.REJECTED
  ) {
    const entry = await prisma.timeEntry.findFirst({
      where: { id, project: { organizationId } },
    });
    if (!entry) throw new AppError("Запись времени не найдена", 404);

    return prisma.timeEntry.update({
      where: { id },
      data: { status },
      include: timeEntryInclude,
    });
  }

  static async delete(organizationId: string, actor: { userId: string; role: Role }, id: string) {
    const entry = await prisma.timeEntry.findFirst({
      where: { id, project: { organizationId } },
    });
    if (!entry) throw new AppError("Запись времени не найдена", 404);

    if (actor.role === Role.EMPLOYEE) {
      if (entry.userId !== actor.userId) {
        throw new AppError("Можно удалять только свои записи", 403);
      }
      if (entry.status !== TimeEntryStatus.PENDING) {
        throw new AppError("Можно удалять только записи со статусом PENDING", 400);
      }
    }

    await prisma.timeEntry.delete({ where: { id } });
  }
}
