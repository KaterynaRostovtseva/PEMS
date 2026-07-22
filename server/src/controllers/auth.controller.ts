import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../services/user.service.js";
import { Role } from "@prisma/client";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh";

const generateTokens = (userId: number, role: Role) => {
  const accessToken = jwt.sign({ userId, role }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId, role }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export class AuthController {
  // POST /auth/register
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email и password обязательны" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUsersCount = await prisma.user.count();
      const role = existingUsersCount === 0 ? Role.OWNER : Role.EMPLOYEE;

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, role },
      });

      const { accessToken, refreshToken } = generateTokens(user.id, user.role);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Email уже занят" });
      }
      console.error('ОШИБКА РЕГИСТРАЦИИ:', error);
      // Возвращаем текст ошибки на фронтенд для отладки:
      return res.status(500).json({ 
        error: "Ошибка при регистрации", 
        details: error.message || String(error) 
      });
    }
  }

  // POST /auth/login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Неверный email или пароль" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Неверный email или пароль" });
      }

      // 👈 Передаем user.role
      const { accessToken, refreshToken } = generateTokens(user.id, user.role);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ error: "Ошибка при входе" });
    }
  }

  // POST /auth/refresh
  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token отсутствует" });
      }

      const tokenInDb = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }, // 👈 Подтягиваем пользователя, чтобы узнать его роль
      });

      if (!tokenInDb) {
        return res.status(403).json({ error: "Токен не найден или отозван" });
      }

      jwt.verify(refreshToken, REFRESH_SECRET);

      // 👈 Передаем id и роль пользователя
      const tokens = generateTokens(tokenInDb.user.id, tokenInDb.user.role);

      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: tokenInDb.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      res.status(403).json({ error: "Невалидный Refresh token" });
    }
  }

  // POST /auth/logout
  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      res.clearCookie("refreshToken");
    }
    res.json({ message: "Успешный выход" });
  }
}
