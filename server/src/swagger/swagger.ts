import swaggerJsdoc from "swagger-jsdoc";
import {
  commonSchemas,
  organizationSchemas,
  userSchemas,
  authSchemas,
  clientSchemas,
  projectSchemas,
  projectMemberSchemas,
  projectStageSchemas,
  taskSchemas,
  timeEntrySchemas,
  paymentSchemas,
  invitationSchemas,
  fileSchemas,

  authPaths,
  userPaths,
  organizationPaths,
  clientPaths,
  projectPaths,
  projectMemberPaths,
  projectStagePaths,
  taskPaths,
  timeEntryPaths,
  paymentPaths,
  invitationPaths,
  filePaths,
} from "./index.js";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "PEMS API",
      version: "1.0.0",
      description:
        "Project & Employee Management System (PEMS) REST API.",
    },

    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local",
      },
      {
        url: "https://pems-i9a1.onrender.com/api",
        description: "Production",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication",
      },
      {
        name: "Organizations",
        description: "Organization management",
      },
      {
        name: "Users",
        description: "Organization users",
      },
      {
        name: "Clients",
        description: "Clients",
      },
      {
        name: "Projects",
        description: "Projects",
      },
      {
        name: "Tasks",
        description: "Tasks",
      },
      {
        name: "Time Entries",
        description: "Time tracking",
      },
      {
        name: "Payments",
        description: "Payroll",
      },
      {
        name: "Invitations",
        description: "User invitations",
      },
      {
        name: "Files",
        description: "File management",
      },
    ],

    paths: {
      ...authPaths,
      ...organizationPaths,
      ...userPaths,
      ...clientPaths,
      ...projectPaths,
      ...projectMemberPaths,
      ...projectStagePaths,
      ...taskPaths,
      ...timeEntryPaths,
      ...paymentPaths,
      ...invitationPaths,
      ...filePaths,
    },

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },

        CookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },

      schemas: {
        ...commonSchemas,
        ...organizationSchemas,
        ...userSchemas,
        ...authSchemas,
        ...clientSchemas,
        ...projectSchemas,
        ...projectMemberSchemas,
        ...projectStageSchemas,
        ...taskSchemas,
        ...timeEntrySchemas,
        ...paymentSchemas,
        ...invitationSchemas,
        ...fileSchemas,
      },

      responses: {
        BadRequest: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        Unauthorized: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        Forbidden: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        Conflict: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);