import { Router } from "express";
import { ProjectMemberController } from "../controllers/project-member.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();

router.use(authenticateToken);


router.get(
  "/:projectId/members",
  ProjectMemberController.getAll
);


router.post(
  "/:projectId/members",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ProjectMemberController.assign
);


router.patch(
  "/:projectId/members/:memberId",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ProjectMemberController.update
);


router.delete(
  "/:projectId/members/:memberId",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  ProjectMemberController.remove
);


export default router;