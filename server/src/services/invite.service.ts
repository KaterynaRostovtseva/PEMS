import bcrypt from "bcryptjs";
import { Role } from "../lib/prisma-client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { createOpaqueToken, hashOpaqueToken, EmailService } from "./email.service.js";
import { generateTokens, hashToken, REFRESH_TTL_MS } from "../lib/tokens.js";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

export class InviteService {
  static async createInvite(
    organizationId: string,
    invitedById: string,
    data: { email: string; role?: Role; position?: string }
  ) {
    const email = data.email.toLowerCase().trim();
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      throw new AppError("Пользователь с таким email уже существует", 400);
    }

    const org = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new AppError("Организация не найдена", 404);

    const role = (data.role as Role | undefined) ?? Role.EMPLOYEE;
    if (role === Role.OWNER) {
      throw new AppError("Нельзя пригласить второго OWNER через invite", 400);
    }

    const rawToken = createOpaqueToken();
    const invitation = await prisma.invitation.create({
      data: {
        organizationId,
        invitedById,
        email,
        role,
        position: data.position ?? null,
        tokenHash: hashOpaqueToken(rawToken),
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      },
    });

    const mail = await EmailService.sendInvite(email, org.name, rawToken);

    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      position: invitation.position,
      expiresAt: invitation.expiresAt,
      ...(process.env.NODE_ENV !== "production" && mail.previewUrl
        ? { previewUrl: mail.previewUrl }
        : {}),
    };
  }

  static async cancel(organizationId: string, id: string) {
    const invitation = await prisma.invitation.findFirst({
      where: { id, organizationId },
    });
    if (!invitation) throw new AppError("Приглашение не найдено", 404);
    if (invitation.acceptedAt) throw new AppError("Приглашение уже принято", 400);

    return prisma.invitation.update({
      where: { id },
      data: { status: "CANCELED" },
    });
  }

  static async getById(organizationId: string, id: string) {
    const invitation = await prisma.invitation.findFirst({
      where: { id, organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        position: true,
        status: true,
        expiresAt: true,
        acceptedAt: true,
        createdAt: true,
      },
    });
    if (!invitation) throw new AppError("Приглашение не найдено", 404);
    return invitation;
  }

  static async resend(organizationId: string, id: string) {
    const invitation = await prisma.invitation.findFirst({
      where: { id, organizationId },
    });
    if (!invitation) throw new AppError("Приглашение не найдено", 404);
    if (invitation.acceptedAt) throw new AppError("Приглашение уже принято", 400);

    const org = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new AppError("Организация не найдена", 404);

    const rawToken = createOpaqueToken();
    const updated = await prisma.invitation.update({
      where: { id },
      data: {
        tokenHash: hashOpaqueToken(rawToken),
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
        status: "PENDING",
      },
    });
    const mail = await EmailService.sendInvite(invitation.email, org.name, rawToken);
    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      expiresAt: updated.expiresAt,
      ...(process.env.NODE_ENV !== "production" && mail.previewUrl
        ? { previewUrl: mail.previewUrl }
        : {}),
    };
  }

  static async list(organizationId: string) {
    return prisma.invitation.findMany({
      where: { organizationId, acceptedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        position: true,
        expiresAt: true,
        createdAt: true,
        invitedBy: { select: { id: true, firstName: true, lastName: true, displayName: true, email: true } },
      },
    });
  }

  static async accept(data: { token: string; password: string; firstName: string; lastName: string }) {
    const invitation = await prisma.invitation.findUnique({
      where: { tokenHash: hashOpaqueToken(data.token) },
    });

    if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
      throw new AppError("Приглашение недействительно или истекло", 400);
    }

    const existing = await prisma.user.findFirst({ where: { email: invitation.email } });
    if (existing) throw new AppError("Пользователь с таким email уже существует", 400);

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          organizationId: invitation.organizationId,
          email: invitation.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: invitation.role,
          position: invitation.position,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      });

      return user;
    });

    const tokens = generateTokens({
      userId: result.id,
      organizationId: result.organizationId,
      role: result.role,
    });

    await prisma.refreshToken.create({
      data: {
        token: hashToken(tokens.refreshToken),
        userId: result.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    return {
      user: {
        id: result.id,
        organizationId: result.organizationId,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        displayName: result.displayName,
        role: result.role,
      },
      ...tokens,
    };
  }
}

export class PasswordResetService {
  static async request(email: string) {
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    // Не повідомляємо, чи існує email
    if (!user || !user.isActive) {
      return { message: "Если аккаунт существует, письмо отправлено" };
    }

    const rawToken = createOpaqueToken();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashOpaqueToken(rawToken),
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });

    const mail = await EmailService.sendPasswordReset(user.email, rawToken);
    return {
      message: "Если аккаунт существует, письмо отправлено",
      ...(process.env.NODE_ENV !== "production" && mail.previewUrl
        ? { previewUrl: mail.previewUrl }
        : {}),
    };
  }

  static async reset(token: string, password: string) {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashOpaqueToken(token) },
      include: { user: true },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new AppError("Токен сброса недействителен или истёк", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: record.userId, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);

    return { message: "Пароль успешно изменён" };
  }
}
