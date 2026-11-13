import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientRoutes from "./routes/client.routes.js";

import projectRoutes from "./routes/project.routes.js";
import projectMemberRoutes from "./routes/project-member.routes.js";
import projectStageRoutes from "./routes/project-stage.routes.js";

import taskRoutes from "./routes/task.routes.js";
import timeEntryRoutes from "./routes/time-entry.routes.js";

import paymentRoutes from "./routes/payment.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import fileRoutes from "./routes/file.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { swaggerSpec } from "./swagger/swagger.js";
import swaggerUi from "swagger-ui-express";



const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", projectMemberRoutes);
app.use("/api/projects", projectStageRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/time-entries", timeEntryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/files", fileRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
});
