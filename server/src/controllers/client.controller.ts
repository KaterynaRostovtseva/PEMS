import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth.js";
import { ClientService } from "../services/client.service.js";
import { createClientSchema, updateClientSchema } from "../schemas/client.schema.js";
import { localize } from "../i18n/index.js";

export class ClientController {
  static getAll(req: AuthRequest, res: Response, next: NextFunction) {
    return ClientController.list(req, res, next);
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clients = await ClientService.list(req.user!.organizationId, req.query);
      res.json(clients);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const client = await ClientService.getById(req.user!.organizationId, req.params.id as string);
      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createClientSchema.parse(req.body);
      const client = await ClientService.create(req.user!.organizationId, data);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateClientSchema.parse(req.body);
      const client = await ClientService.update(
        req.user!.organizationId,
        req.params.id as string,
        data
      );
      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ClientService.delete(req.user!.organizationId, req.params.id as string);
      res.json(localize(req, { message: "Клиент удалён" }));
    } catch (error) {
      next(error);
    }
  }
}
