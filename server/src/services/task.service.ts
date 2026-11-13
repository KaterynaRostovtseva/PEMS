import { TaskStatus } from '../lib/prisma-client.js';
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { paginated, parsePagination, type PaginationQuery } from "../utils/pagination.js";
import { userBriefSelect } from "../utils/user-select.js";

const assigneeSelect = {
  assignedTo: { select: userBriefSelect },
} as const;

export type CreateTaskInput = {
  title: string;
  description?: string;
  assignedToId?: string | null;
  status?: TaskStatus;
  priority?: string;
  createdById: string;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  assignedToId?: string | null;
  status?: TaskStatus;
  priority?: string;
};

const assertProjectMember = async (projectId: string, userId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) {
    throw new AppError("Исполнитель должен быть участником проекта", 400);
  }
};

export class TaskService {
  private static async findInOrganization(organizationId: string, id: string) {
    const task = await prisma.task.findFirst({
      where: { id, project: { organizationId } },
      include: assigneeSelect,
    });
    if (!task) throw new AppError("Задача не найдена", 404);
    return task;
  }

  static async list(organizationId: string, query: PaginationQuery & { projectId?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const where = {
      project: { organizationId },
      ...(query.projectId && { projectId: query.projectId }),
    };

    const [total, data] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        include: assigneeSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async getById(organizationId: string, id: string) {
    return this.findInOrganization(organizationId, id);
  }

  static async getProjectTasks(projectId: string, query: PaginationQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = { projectId };

    const [total, data] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        include: assigneeSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async createTask(projectId: string, data: CreateTaskInput) {
    if (data.assignedToId) {
      await assertProjectMember(projectId, data.assignedToId);
    }

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status:
          data.status && Object.values(TaskStatus).includes(data.status)
            ? data.status
            : TaskStatus.TODO,
        priority: data.priority || "MEDIUM",
        projectId,
        assignedToId: data.assignedToId || null,
        createdById: data.createdById,
      },
      include: assigneeSelect,
    });
  }

  static async updateTask(projectId: string, taskId: string, data: UpdateTaskInput) {
    if (data.assignedToId) {
      await assertProjectMember(projectId, data.assignedToId);
    }

    const updated = await prisma.task.updateMany({
      where: { id: taskId, projectId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId || null }),
      },
    });

    if (updated.count === 0) {
      throw new AppError("Задача не найдена", 404);
    }

    return prisma.task.findFirst({
      where: { id: taskId, projectId },
      include: assigneeSelect,
    });
  }

  static async deleteTask(projectId: string, taskId: string) {
    const deleted = await prisma.task.deleteMany({
      where: { id: taskId, projectId },
    });

    if (deleted.count === 0) {
      throw new AppError("Задача не найдена", 404);
    }
  }
}
