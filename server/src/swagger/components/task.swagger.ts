export const taskSchemas = {
  Task: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      projectId: {
        type: "string",
        format: "uuid",
      },

      stageId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      assignedToId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      createdById: {
        type: "string",
        format: "uuid",
      },

      title: {
        type: "string",
        example: "Создать страницу Dashboard",
      },

      description: {
        type: "string",
        nullable: true,
        example: "Сверстать и подключить API",
      },

      status: {
        $ref: "#/components/schemas/TaskStatus",
      },

      priority: {
        $ref: "#/components/schemas/TaskPriority",
      },

      deletedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },

      project: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
        },
      },

      stage: {
        type: "object",
        nullable: true,
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
        },
      },

      assignedTo: {
        allOf: [
          {
            $ref: "#/components/schemas/UserBrief",
          },
        ],
        nullable: true,
      },

      createdBy: {
        $ref: "#/components/schemas/UserBrief",
      },

      files: {
        type: "array",
        items: {
          $ref: "#/components/schemas/FileAsset",
        },
      },
    },
  },

  CreateTaskRequest: {
    type: "object",
    required: [
      "projectId",
      "title",
      "createdById",
    ],
    properties: {
      projectId: {
        type: "string",
        format: "uuid",
      },

      stageId: {
        type: "string",
        format: "uuid",
      },

      assignedToId: {
        type: "string",
        format: "uuid",
      },

      createdById: {
        type: "string",
        format: "uuid",
      },

      title: {
        type: "string",
        example: "Создать страницу Dashboard",
      },

      description: {
        type: "string",
      },

      priority: {
        $ref: "#/components/schemas/TaskPriority",
      },

      status: {
        $ref: "#/components/schemas/TaskStatus",
      },
    },
  },

  UpdateTaskRequest: {
    type: "object",
    properties: {
      title: {
        type: "string",
      },

      description: {
        type: "string",
      },

      assignedToId: {
        type: "string",
        format: "uuid",
      },

      stageId: {
        type: "string",
        format: "uuid",
      },

      priority: {
        $ref: "#/components/schemas/TaskPriority",
      },

      status: {
        $ref: "#/components/schemas/TaskStatus",
      },
    },
  },
};