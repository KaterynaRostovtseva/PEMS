import { Prisma, ProjectRole, ProjectStatus, Role } from '../lib/prisma-client.js';
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { paginated, parsePagination, type PaginationQuery } from "../utils/pagination.js";
import { userBriefSelect } from "../utils/user-select.js";

const projectInclude = {
  client: { select: { id: true, name: true, email: true } },
  members: {
    include: {
      user: { select: userBriefSelect },
    },
  },
} as const;

export type CreateProjectInput = {
  name: string;
  code: string;
  color?: string | null;
  description?: string | null;
  status?: ProjectStatus;
  budget?: number | null;
  clientId?: string | null;
  managerId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export class ProjectService {
  static async getProjects(
    organizationId: string,
    userId: string,
    role: Role,
    query: PaginationQuery = {}
  ) {
    const { page, limit, skip } = parsePagination(query);
    const where =
      role === Role.OWNER || role === Role.MANAGER
        ? { organizationId }
        : { organizationId, members: { some: { userId } } };

    const [total, data] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async createProject(organizationId: string, data: CreateProjectInput) {
    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: { id: data.clientId, organizationId },
      });
      if (!client) {
        throw new AppError("Клиент не найден", 404);
      }
    }

    if (data.managerId) {
      const manager = await prisma.user.findFirst({
        where: { id: data.managerId, organizationId, isActive: true },
        select: { id: true },
      });
      if (!manager) throw new AppError("Менеджер не найден", 404);
    }

    try {
      return await prisma.project.create({
        data: {
          organizationId,
          name: data.name,
          code: data.code,
          color: data.color ?? null,
          description: data.description,
          status:
            data.status && Object.values(ProjectStatus).includes(data.status)
              ? data.status
              : ProjectStatus.ACTIVE,
          budget: data.budget ?? null,
          clientId: data.clientId || null,
          managerId: data.managerId || null,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
        },
        include: projectInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Проект с таким кодом уже есть", 409);
      }
      throw error;
    }
  }

  static async getById(organizationId: string, id: string) {
    const project = await prisma.project.findFirst({
      where: { id, organizationId },
      include: projectInclude,
    });
    if (!project) throw new AppError("Проект не найден", 404);
    return project;
  }

  static async update(organizationId: string, id: string, data: UpdateProjectInput) {
    await this.getById(organizationId, id);
    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: { id: data.clientId, organizationId },
      });
      if (!client) throw new AppError("Клиент не найден", 404);
    }
    if (data.managerId) {
      const manager = await prisma.user.findFirst({
        where: { id: data.managerId, organizationId, isActive: true },
        select: { id: true },
      });
      if (!manager) throw new AppError("Менеджер не найден", 404);
    }

    try {
      return await prisma.project.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.code !== undefined && { code: data.code }),
          ...(data.color !== undefined && { color: data.color }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.budget !== undefined && { budget: data.budget }),
          ...(data.clientId !== undefined && { clientId: data.clientId || null }),
          ...(data.managerId !== undefined && { managerId: data.managerId || null }),
          ...(data.startDate !== undefined && {
            startDate: data.startDate ? new Date(data.startDate) : null,
          }),
          ...(data.endDate !== undefined && {
            endDate: data.endDate ? new Date(data.endDate) : null,
          }),
        },
        include: projectInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Проект с таким кодом уже есть", 409);
      }
      throw error;
    }
  }

  static async delete(organizationId: string, id: string) {
    await this.getById(organizationId, id);
    await prisma.project.delete({ where: { id } });
  }

  static async assignEmployee(
    organizationId: string,
    projectId: string,
    employeeId: string,
    roleInProject?: string
  ) {
    const employee = await prisma.user.findFirst({
      where: { id: employeeId, organizationId, isActive: true },
    });

    if (!employee) {
      throw new AppError("Сотрудник не найден", 404);
    }

    try {
      return await prisma.projectMember.create({
        data: {
          projectId,
          userId: employeeId,
          roleInProject:
            roleInProject && (Object.values(ProjectRole) as string[]).includes(roleInProject)
              ? (roleInProject as ProjectRole)
              : null,
        },
        include: {
          user: { select: userBriefSelect },
          project: { select: { id: true, name: true } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new AppError("Сотрудник уже добавлен в этот проект", 400);
        }
        if (error.code === "P2003") {
          throw new AppError("Проект или сотрудник не найден", 404);
        }
      }
      throw error;
    }
  }
}
