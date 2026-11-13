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

  "/auth/forgot-password": {
    post: {
      tags: ["Auth"],
      summary: "Request password reset",
      description:
        "Sends a reset link to the account email. The response is the same when the address is unknown.",
      operationId: "forgotPassword",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ForgotPasswordRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Reset email accepted.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
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

  "/auth/reset-password": {
    post: {
      tags: ["Auth"],
      summary: "Reset password",
      description: "Sets a new password using the token from the email link.",
      operationId: "resetPassword",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ResetPasswordRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Password updated.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
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

  "/auth/accept-invite": {
    post: {
      tags: ["Auth"],
      summary: "Accept invitation",
      description: "Creates the invited user and returns an access token.",
      operationId: "acceptInvite",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AcceptInvitationRequest",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Invitation accepted.",
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
};