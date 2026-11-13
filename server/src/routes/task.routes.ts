import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();


router.use(authenticateToken);


// завдання проєкту

router.get(
  "/",
  TaskController.getAll
);


router.post(
  "/",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  TaskController.create
);



router.get(
  "/:id",
  TaskController.getById
);



router.patch(
  "/:id",
  TaskController.update
);



router.patch(
  "/:id/status",
  TaskController.updateStatus
);



router.delete(
  "/:id",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  TaskController.delete
);


export default router;