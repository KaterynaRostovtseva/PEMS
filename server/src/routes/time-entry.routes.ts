import { Router } from "express";
import { TimeEntryController } from "../controllers/time-entry.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();


router.use(authenticateToken);


// створити запис часу

router.post(
  "/",
  TimeEntryController.create
);


// мої години

router.get(
  "/my",
  TimeEntryController.getMy
);


// усі записи

router.get(
  "/",
  authorizeRoles(Role.OWNER, Role.MANAGER),
  TimeEntryController.getAll
);



router.patch(
  "/:id",
  TimeEntryController.update
);



router.delete(
  "/:id",
  TimeEntryController.delete
);


// підтвердження менеджером

router.patch(
  "/:id/approve",
  authorizeRoles(Role.MANAGER, Role.OWNER),
  TimeEntryController.approve
);


router.patch(
  "/:id/reject",
  authorizeRoles(Role.MANAGER, Role.OWNER),
  TimeEntryController.reject
);


export default router;