import { Router } from "express";
import { ClientController } from "../controllers/client.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();


router.use(authenticateToken);


// список клієнтів

router.get(
  "/",
  ClientController.getAll
);


// створити клієнта

router.post(
  "/",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ClientController.create
);


// отримати клієнта

router.get(
  "/:id",
  ClientController.getById
);


// оновити

router.patch(
  "/:id",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ClientController.update
);


// видалити

router.delete(
  "/:id",
  authorizeRoles(Role.OWNER),
  ClientController.delete
);


export default router;
