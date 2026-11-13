import bcrypt from "bcryptjs";
import { Role } from '../lib/prisma-client.js';
import { prisma } from "../lib/prisma.js";
import {
  generateTokens,
  hashToken,
  verifyRefreshToken,
  REFRESH_TTL_MS,
} from "../lib/tokens.js";
import { AppError } from "../utils/appError.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { withAvatar } from "../utils/avatar.js";

const toPublicUser = (user: {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string | null;
  role: Role;
  avatarUrl?: string | null;
}) =>
  withAvatar({
    id: user.id,
    organizationId: user.organizationId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName ?? null,
    role: user.role,
    avatarUrl: user.avatarUrl ?? null,
  });

const persistRefreshToken = async (userId: string, refreshToken: string) => {
  await prisma.refreshToken.create({
    data: {
      token: hashToken(refreshToken),
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });
};

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser = await prisma.user.findFirst({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError("Пользователь с таким email уже существует", 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: { name: data.companyName },
      });

      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: Role.OWNER,
        },
      });

      return { organization, user };
    });

    const tokens = generateTokens({
      userId: result.user.id,
      organizationId: result.organization.id,
      role: result.user.role,
    });

    await persistRefreshToken(result.user.id, tokens.refreshToken);

    return {
      user: toPublicUser({
        ...result.user,
        organizationId: result.organization.id,
      }),
      ...tokens,
    };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (!user || !user.isActive) {
      throw new AppError("Неверный email или пароль, либо аккаунт неактивен", 400);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Неверный email или пароль", 400);
    }

    const tokens = generateTokens({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    await persistRefreshToken(user.id, tokens.refreshToken);

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  }

  static async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new AppError("Refresh token отсутствует", 401);
    }

    try {
      verifyRefreshToken(refreshToken);
    } catch {
      await prisma.refreshToken.deleteMany({ where: { token: hashToken(refreshToken) } });
      throw new AppError("Невалидный или просроченный Refresh token", 403);
    }

    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token: hashToken(refreshToken) },
      include: { user: true },
    });

    if (!tokenInDb || tokenInDb.expiresAt < new Date() || tokenInDb.isRevoked) {
      if (tokenInDb) {
        await prisma.refreshToken.update({
          where: { id: tokenInDb.id },
          data: { isRevoked: true },
        });
      }
      throw new AppError("Токен не найден или отозван", 403);
    }

    if (!tokenInDb.user.isActive) {
      await prisma.refreshToken.update({
        where: { id: tokenInDb.id },
        data: { isRevoked: true },
      });
      throw new AppError("Аккаунт неактивен", 403);
    }

    const tokens = generateTokens({
      userId: tokenInDb.user.id,
      organizationId: tokenInDb.user.organizationId,
      role: tokenInDb.user.role,
    });

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: tokenInDb.id },
        data: { isRevoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          token: hashToken(tokens.refreshToken),
          userId: tokenInDb.user.id,
          expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
        },
      }),
    ]);

    return tokens;
  }

  static async logout(refreshToken: string | undefined) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: hashToken(refreshToken), isRevoked: false },
        data: { isRevoked: true },
      });
    }
  }
}
