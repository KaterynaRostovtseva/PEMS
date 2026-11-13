import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import type { ChangePasswordInput, UpdateProfileInput } from "../schemas/profile.schema.js";
import { FileService } from "./file.service.js";
import { withAvatar } from "../utils/avatar.js";

const profileSelect = {
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
  organization: {
    select: { id: true, name: true, createdAt: true },
  },
} as const;

export class ProfileService {
  static async getProfile(userId: string, organizationId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId },
      select: profileSelect,
    });
    if (!user) throw new AppError("Профиль не найден", 404);
    return withAvatar(user);
  }

  static async updateProfile(
    userId: string,
    organizationId: string,
    data: UpdateProfileInput
  ) {
    await this.getProfile(userId, organizationId);

    if (data.email) {
      const email = data.email.toLowerCase().trim();
      const taken = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
      });
      if (taken) throw new AppError("Email уже занят", 400);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.displayName !== undefined && { displayName: data.displayName }),
        ...(data.email !== undefined && { email: data.email.toLowerCase().trim() }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.hourlyRate !== undefined && { hourlyRate: data.hourlyRate }),
        ...(data.isFop3Group !== undefined && { isFop3Group: data.isFop3Group }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: profileSelect,
    });

    return withAvatar(user);
  }

  static async changePassword(
    userId: string,
    organizationId: string,
    data: ChangePasswordInput
  ) {
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId },
    });
    if (!user) throw new AppError("Профиль не найден", 404);

    const ok = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!ok) throw new AppError("Неверный текущий пароль", 400);

    if (data.currentPassword === data.newPassword) {
      throw new AppError("Новый пароль должен отличаться от текущего", 400);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);

    return { message: "Пароль успешно изменён. Войдите заново." };
  }

  static async updateAvatar(
    userId: string,
    organizationId: string,
    file: Express.Multer.File
  ) {
    await FileService.upload(organizationId, userId, file, true);
    return this.getProfile(userId, organizationId);
  }

  static async removeAvatar(userId: string, organizationId: string) {
    await this.getProfile(userId, organizationId);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
      select: profileSelect,
    });

    return withAvatar(user);
  }
}
