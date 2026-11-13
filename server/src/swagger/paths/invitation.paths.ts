export const invitationPaths = {
  "/invitations": {
    get: {
      tags: ["Invitations"],
      summary: "Get invitations",
      description: "Returns all invitations for the current organization.",
      security: [{ BearerAuth: [] }],

      responses: {
        200: {
          description: "Invitations list",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Invitation",
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

    post: {
      tags: ["Invitations"],
      summary: "Create invitation",
      description: "Invites a new employee to the organization.",
      security: [{ BearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateInvitationRequest",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Invitation created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Invitation",
              },
            },
          },
        },

        400: {
          $ref: "#/components/responses/BadRequest",
        },

        409: {
          $ref: "#/components/responses/Conflict",
        },
      },
    },
  },

  "/invitations/{id}": {
    get: {
      tags: ["Invitations"],
      summary: "Get invitation by ID",
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
          description: "Invitation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Invitation",
              },
            },
          },
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },

    delete: {
      tags: ["Invitations"],
      summary: "Cancel invitation",
      description: "Cancels a pending invitation.",
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
          description: "Invitation cancelled",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },
  },

  "/invitations/{id}/resend": {
    post: {
      tags: ["Invitations"],
      summary: "Resend invitation",
      description: "Sends the invitation email again.",
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
          description: "Invitation resent",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invitation resent successfully.",
                  },
                },
              },
            },
          },
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },
  },
};