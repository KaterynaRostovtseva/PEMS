import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { checkProjectAccess } from "../middlewares/project.middleware.js";
import { ProjectController } from "../controllers/project.controller.js";
import { Role } from "../lib/prisma-client.js";

const router = Router();

router.use(authenticateToken);


router.get(
  "/",
  ProjectController.getAll
);


router.post(
  "/",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ProjectController.create
);


router.get(
  "/:id",
  ProjectController.getById
);


router.patch(
  "/:id",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ProjectController.update
);


router.delete(
  "/:id",
  authorizeRoles(Role.OWNER),
  ProjectController.delete
);


export default router;