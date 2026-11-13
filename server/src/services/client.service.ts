import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import type { CreateClientInput, UpdateClientInput } from "../schemas/client.schema.js";
import { paginated, parsePagination, type PaginationQuery } from "../utils/pagination.js";

export class ClientService {
  static async list(organizationId: string, query: PaginationQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = { organizationId };

    const [total, data] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { projects: true } } },
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async getById(organizationId: string, id: string) {
    const client = await prisma.client.findFirst({
      where: { id, organizationId },
      include: {
        projects: { select: { id: true, name: true, status: true } },
      },
    });
    if (!client) throw new AppError("Клиент не найден", 404);
    return client;
  }

  static async create(organizationId: string, data: CreateClientInput) {
    return prisma.client.create({
      data: {
        organizationId,
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
      },
    });
  }

  static async update(organizationId: string, id: string, data: UpdateClientInput) {
    await this.getById(organizationId, id);
    return prisma.client.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
    });
  }

  static async delete(organizationId: string, id: string) {
    await this.getById(organizationId, id);
    await prisma.client.delete({ where: { id } });
  }
}
