import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { Role } from "../lib/prisma-client.js";


const router = Router();


router.use(authenticateToken);



router.get(
 "/",
 authorizeRoles(Role.OWNER),
 PaymentController.getAll
);



router.get(
 "/:id",
 PaymentController.getById
);



router.post(
 "/calculate",
 authorizeRoles(Role.OWNER),
 PaymentController.calculate
);



router.patch(
 "/:id/pay",
 authorizeRoles(Role.OWNER),
 PaymentController.markPaid
);


export default router;