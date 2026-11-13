export const authSchemas = {
  RegisterRequest: {
    type: "object",

    required: [
      "companyName",
      "email",
      "password",
      "firstName",
      "lastName",
    ],

    properties: {
      companyName: {
        type: "string",
        example: "IT Studio Pro",
      },

      email: {
        type: "string",
        format: "email",
        example: "owner@studio.com",
      },

      password: {
        type: "string",
        minLength: 8,
        example: "StrongPassword123",
      },

      firstName: {
        type: "string",
        example: "John",
      },

      lastName: {
        type: "string",
        example: "Doe",
      },

      phone: {
        type: "string",
        nullable: true,
        example: "+380501234567",
      },

      timezone: {
        type: "string",
        example: "Europe/Kyiv",
      },
    },
  },

  LoginRequest: {
    type: "object",

    required: [
      "email",
      "password",
    ],

    properties: {
      email: {
        type: "string",
        format: "email",
        example: "owner@studio.com",
      },

      password: {
        type: "string",
        example: "StrongPassword123",
      },
    },
  },

  ForgotPasswordRequest: {
    type: "object",

    required: ["email"],

    properties: {
      email: {
        type: "string",
        format: "email",
        example: "owner@studio.com",
      },
    },
  },

  ResetPasswordRequest: {
    type: "object",

    required: [
      "token",
      "password",
    ],

    properties: {
      token: {
        type: "string",
      },

      password: {
        type: "string",
        minLength: 8,
        example: "StrongPassword123",
      },
    },
  },

  AcceptInvitationRequest: {
    type: "object",

    required: [
      "token",
      "password",
      "firstName",
      "lastName",
    ],

    properties: {
      token: {
        type: "string",
      },

      password: {
        type: "string",
        minLength: 8,
      },

      firstName: {
        type: "string",
        example: "John",
      },

      lastName: {
        type: "string",
        example: "Doe",
      },

      phone: {
        type: "string",
        nullable: true,
      },

      timezone: {
        type: "string",
        example: "Europe/Kyiv",
      },
    },
  },

  AuthUser: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      organizationId: {
        type: "string",
        format: "uuid",
      },

      email: {
        type: "string",
        format: "email",
      },

      firstName: {
        type: "string",
      },

      lastName: {
        type: "string",
      },

      displayName: {
        type: "string",
        nullable: true,
      },

      phone: {
        type: "string",
        nullable: true,
      },

      timezone: {
        type: "string",
      },

      position: {
        type: "string",
        nullable: true,
      },

      role: {
        $ref: "#/components/schemas/Role",
      },

      currency: {
        $ref: "#/components/schemas/Currency",
      },

      hourlyRate: {
        type: "number",
        nullable: true,
      },

      isFop3Group: {
        type: "boolean",
      },

      isActive: {
        type: "boolean",
      },

      avatarUrl: {
        type: "string",
        nullable: true,
      },

      lastLoginAt: {
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
    },
  },

  AuthTokensResponse: {
    type: "object",

    required: [
      "user",
      "accessToken",
    ],

    properties: {
      user: {
        $ref: "#/components/schemas/AuthUser",
      },

      accessToken: {
        type: "string",
        description: "JWT Access Token",
      },
    },
  },

  RefreshTokenResponse: {
    type: "object",

    properties: {
      accessToken: {
        type: "string",
        description: "New JWT access token",
      },
    },
  },

  MessageResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Operation completed successfully",
      },
    },
  },
};