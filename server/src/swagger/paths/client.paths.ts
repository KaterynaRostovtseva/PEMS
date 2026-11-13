export const clientPaths = {
  "/clients": {
    get: {
      tags: ["Clients"],
      summary: "Get clients",
      description: "Returns all clients of the current organization.",
      security: [{ BearerAuth: [] }],

      responses: {
        200: {
          description: "Clients list",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Client",
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
      tags: ["Clients"],
      summary: "Create client",
      description: "Creates a new client.",
      security: [{ BearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateClientRequest",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Client created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Client",
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

  "/clients/{id}": {
    get: {
      tags: ["Clients"],
      summary: "Get client by ID",
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
          description: "Client",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Client",
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
      tags: ["Clients"],
      summary: "Update client",
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
              $ref: "#/components/schemas/UpdateClientRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Client updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Client",
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
      tags: ["Clients"],
      summary: "Delete client",
      description: "Deletes a client if it has no related projects.",
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
          description: "Client deleted",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        409: {
          description: "Client has related projects",
        },
      },
    },
  },
};