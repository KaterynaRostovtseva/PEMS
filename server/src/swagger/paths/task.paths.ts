export const taskPaths = {
  "/tasks": {
    get: {
      tags: ["Tasks"],
      summary: "Get tasks",
      description: "Returns tasks of the current organization.",
      security: [{ BearerAuth: [] }],

      responses: {
        200: {
          description: "Tasks list",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Task",
                },
              },
            },
          },
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },

    post: {
      tags: ["Tasks"],
      summary: "Create task",
      description: "Creates a new task.",
      security: [{ BearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateTaskRequest",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Task created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Task",
              },
            },
          },
        },

        400: {
          $ref: "#/components/responses/BadRequest",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },
  },

  "/tasks/{id}": {
    get: {
      tags: ["Tasks"],
      summary: "Get task by ID",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],

      responses: {
        200: {
          description: "Task",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Task",
              },
            },
          },
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },

    patch: {
      tags: ["Tasks"],
      summary: "Update task",
      description: "Updates task information.",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateTaskRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Task updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Task",
              },
            },
          },
        },

        400: {
          $ref: "#/components/responses/BadRequest",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },

    delete: {
      tags: ["Tasks"],
      summary: "Delete task",
      description: "Soft delete task.",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],

      responses: {
        204: {
          description: "Task deleted",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },
  },
};