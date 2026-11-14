import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { AuthService } from "../services/auth.service.js";
import { InviteService, PasswordResetService } from "../services/invite.service.js";
import {
  loginSchema,
  registerSchema,
  checkEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  acceptInviteSchema,
} from "../schemas/auth.schema.js";
import { COOKIE_OPTIONS } from "../lib/tokens.js";
import { localize } from "../i18n/index.js";

export class AuthController {
  static async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      return res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkEmail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email } = checkEmailSchema.parse(req.body);
      const taken = await AuthService.emailTaken(email);
      return res.json({ taken });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      return res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tokens = await AuthService.refresh(req.cookies?.refreshToken);
      res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.cookies?.refreshToken);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      return res.json(localize(req, { message: "Успешный выход" }));
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const result = await PasswordResetService.request(email);
      return res.json(localize(req, result));
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      const result = await PasswordResetService.reset(token, password);
      return res.json(localize(req, result));
    } catch (error) {
      next(error);
    }
  }

  static async acceptInvite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = acceptInviteSchema.parse(req.body);
      const result = await InviteService.accept(data);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      return res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
}
