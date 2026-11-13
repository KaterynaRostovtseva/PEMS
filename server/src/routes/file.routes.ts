import { Router } from "express";
import { FileController } from "../controllers/file.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const router = Router();


router.use(authenticateToken);



router.post(
 "/upload",
 FileController.upload
);

router.get(
  "/project/:projectId",
  FileController.listByProject
);

router.get(
  "/task/:taskId",
  FileController.listByTask
);

router.get(
 "/:id",
 FileController.getById
);



router.delete(
 "/:id",
 FileController.delete
);


export default router;