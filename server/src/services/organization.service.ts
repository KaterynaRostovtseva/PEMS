import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

export class OrganizationService {
  static async getCurrent(organizationId: string) {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) throw new AppError("Организация не найдена", 404);
    return organization;
  }

  static async update(organizationId: string, name: string) {
    await this.getCurrent(organizationId);
    return prisma.organization.update({
      where: { id: organizationId },
      data: { name },
    });
  }
}
