export const organizationPaths = {
  "/organizations/current": {
    get: {
      tags: ["Organizations"],
      summary: "Get current organization",
      description: "Returns information about the current organization.",
      security: [{ BearerAuth: [] }],

      responses: {
        200: {
          description: "Organization information",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Organization",
              },
            },
          },
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },

    patch: {
      tags: ["Organizations"],
      summary: "Update organization",
      description: "Updates organization information.",
      security: [{ BearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateOrganizationRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Organization updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Organization",
              },
            },
          },
        },

        400: {
          $ref: "#/components/responses/BadRequest",
        },
      },
    },
  },
};