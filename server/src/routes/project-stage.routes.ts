import { Router } from "express";
import { ProjectStageController } from "../controllers/project-stage.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();


router.use(authenticateToken);



router.get(
  "/:projectId/stages",
  ProjectStageController.getAll
);


router.post(
  "/:projectId/stages",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ProjectStageController.create
);



router.patch(
  "/:stageId",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ProjectStageController.update
);



router.delete(
  "/:stageId",
  authorizeRoles(Role.OWNER),
  ProjectStageController.delete
);



router.get(
  "/:stageId/history",
  ProjectStageController.history
);



export default router;