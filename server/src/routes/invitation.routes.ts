import { Router } from "express";
import { InvitationController } from "../controllers/invitation.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();


router.use(authenticateToken);



router.get(
 "/",
 authorizeRoles(Role.OWNER, Role.MANAGER),
 InvitationController.getAll
);



router.post(
 "/",
 authorizeRoles(Role.OWNER, Role.MANAGER),
 InvitationController.create
);



router.delete(
 "/:id",
 authorizeRoles(Role.OWNER, Role.MANAGER),
 InvitationController.cancel
);


export default router;