export const userPaths = {
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get organization users",
      description: "Returns all active and inactive users of the current organization.",
      security: [{ BearerAuth: [] }],

      responses: {
        200: {
          description: "Users list",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/UserPublic",
                },
              },
            },
          },
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },
      },
    },
  },

  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
      description: "Returns detailed information about a user.",
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
          description: "User found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserPublic",
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
      tags: ["Users"],
      summary: "Update user",
      description: "Updates user profile information.",
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
              $ref: "#/components/schemas/UpdateUserRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "User updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserPublic",
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

  "/users/{id}/role": {
    patch: {
      tags: ["Users"],
      summary: "Change user role",
      description: "Changes the user's organization role.",
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
              $ref: "#/components/schemas/UpdateRoleRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Role updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserPublic",
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

  "/users/{id}/status": {
    patch: {
      tags: ["Users"],
      summary: "Activate or deactivate user",
      description: "Changes the active status of a user without deleting them.",
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
              type: "object",

              required: ["isActive"],

              properties: {
                isActive: {
                  type: "boolean",
                  example: false,
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "User status updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserPublic",
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
};