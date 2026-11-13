import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";

const router = Router();

router.use(authenticateToken);


// PROFILE

router.get(
  "/me",
  UserController.getMe
);


router.patch(
  "/me",
  UserController.updateMe
);


router.patch(
  "/me/password",
  UserController.changePassword
);


// USERS

router.get(
  "/",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  UserController.getAll
);

router.get(
  "/invites",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  UserController.listInvites
);

router.post(
  "/invites",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  UserController.invite
);

router.get(
  "/:id",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  UserController.getById
);


router.patch(
  "/:id",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  UserController.update
);


router.patch(
  "/:id/role",
  authorizeRoles(Role.OWNER),
  UserController.updateRole
);

router.patch(
  "/:id/status",
  authorizeRoles(Role.OWNER),
  UserController.updateStatus
);

router.delete(
  "/:id",
  authorizeRoles(Role.OWNER),
  UserController.delete
);


export default router;