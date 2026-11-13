import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();


router.use(authenticateToken);


// отримати поточну організацію

router.get(
  "/current",
  OrganizationController.getCurrent
);


// змінити дані компанії

router.patch(
  "/current",
  authorizeRoles(Role.OWNER),
  OrganizationController.update
);


export default router;