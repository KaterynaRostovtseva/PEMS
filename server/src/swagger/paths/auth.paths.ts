export const authPaths = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register organization owner",
      description:
        "Creates a new organization and the first owner account.",
      operationId: "register",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Successfully registered.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthTokensResponse",
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

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",

      description:
        "Authenticates user and returns JWT access token.",

      operationId: "login",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Successfully logged in.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthTokensResponse",
              },
            },
          },
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },
  },

  "/auth/refresh": {
    post: {
      tags: ["Auth"],

      summary: "Refresh access token",

      description:
        "Generates a new access token using refresh cookie.",

      security: [
        {
          CookieAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Access token refreshed.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthTokensResponse",
              },
            },
          },
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Auth"],

      summary: "Logout",

      description:
        "Invalidates refresh token and clears cookies.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      responses: {
        204: {
          description: "Successfully logged out.",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },
  },
};