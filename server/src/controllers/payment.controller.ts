import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { PaymentService } from "../services/payment.service.js";
import { calculatePaymentSchema } from "../schemas/payment.schema.js";
import { localize } from "../i18n/index.js";

export class PaymentController {
  static getAll(req: AuthRequest, res: Response, next: NextFunction) {
    return PaymentController.list(req, res, next);
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, periodYear } = req.query;
      const payments = await PaymentService.list(
        req.user!.organizationId,
        {
          userId: typeof userId === "string" ? userId : undefined,
          periodYear: typeof periodYear === "string" ? Number(periodYear) : undefined,
        },
        req.query
      );
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.getById(
        req.user!.organizationId,
        req.params.id as string
      );
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  static async calculate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = calculatePaymentSchema.parse(req.body);
      const payment = await PaymentService.calculate(req.user!.organizationId, data);
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }

  static async markPaid(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.markPaid(
        req.user!.organizationId,
        req.params.id as string
      );
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await PaymentService.delete(req.user!.organizationId, req.params.id as string);
      res.json(localize(req, { message: "Ведомость удалена" }));
    } catch (error) {
      next(error);
    }
  }
}
