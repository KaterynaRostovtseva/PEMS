import bcrypt from "bcryptjs";
import { Currency, Role } from "../lib/prisma-client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { paginated, parsePagination, type PaginationQuery } from "../utils/pagination.js";

export const userPublicSelect = {
  id: true,
  organizationId: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  role: true,
  position: true,
  hourlyRate: true,
  currency: true,
  isFop3Group: true,
  isActive: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserService {
  static async getAllUsers(organizationId: string, query: PaginationQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = { organizationId };

    const [total, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: userPublicSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async getUserById(id: string, organizationId: string) {
    return prisma.user.findFirst({
      where: { id, organizationId },
      select: userPublicSelect,
    });
  }

  static async createUser(
    organizationId: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role?: Role;
      position?: string;
    }
  ) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        organizationId,
        email: data.email.toLowerCase().trim(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role ?? Role.EMPLOYEE,
        position: data.position,
      },
      select: userPublicSelect,
    });
  }

  static async updateUser(
    id: string,
    organizationId: string,
    data: {
      firstName?: string;
      lastName?: string;
      displayName?: string | null;
      email?: string;
      position?: string;
      isActive?: boolean;
      avatarUrl?: string | null;
      hourlyRate?: number;
      currency?: string;
      isFop3Group?: boolean;
    }
  ) {
    const existing = await prisma.user.findFirst({ where: { id, organizationId } });
    if (!existing) return null;

    const { currency, email, ...rest } = data;

    return prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(email && { email: email.toLowerCase().trim() }),
        ...(currency && { currency: currency as Currency }),
      },
      select: userPublicSelect,
    });
  }

  static async updateRole(id: string, organizationId: string, role: Role) {
    const existing = await prisma.user.findFirst({ where: { id, organizationId } });
    if (!existing) return null;

    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, displayName: true, role: true },
    });
  }

  static async deleteUser(id: string, organizationId: string) {
    const existing = await prisma.user.findFirst({ where: { id, organizationId } });
    if (!existing) return false;

    await prisma.user.delete({ where: { id } });
    return true;
  }
}
