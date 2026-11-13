export const userSchemas = {
  UserPublic: {
    type: "object",
    description: "Публичный профиль пользователя",

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
        example: "John",
      },

      lastName: {
        type: "string",
        example: "Doe",
      },

      displayName: {
        type: "string",
        nullable: true,
        example: "John D.",
      },

      phone: {
        type: "string",
        nullable: true,
      },

      timezone: {
        type: "string",
        example: "Europe/Kyiv",
      },

      position: {
        type: "string",
        nullable: true,
        example: "Frontend Developer",
      },

      role: {
        $ref: "#/components/schemas/Role",
      },

      hourlyRate: {
        type: "number",
        nullable: true,
        example: 25,
      },

      currency: {
        $ref: "#/components/schemas/Currency",
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

  UserBrief: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
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

      email: {
        type: "string",
        format: "email",
      },

      role: {
        $ref: "#/components/schemas/Role",
      },
    },
  },

  CreateUserRequest: {
    type: "object",

    required: [
      "email",
      "password",
      "firstName",
      "lastName",
    ],

    properties: {
      email: {
        type: "string",
        format: "email",
      },

      password: {
        type: "string",
        minLength: 6,
      },

      firstName: {
        type: "string",
      },

      lastName: {
        type: "string",
      },

      phone: {
        type: "string",
        nullable: true,
      },

      position: {
        type: "string",
        nullable: true,
      },

      role: {
        $ref: "#/components/schemas/Role",
      },

      hourlyRate: {
        type: "number",
        nullable: true,
      },

      currency: {
        $ref: "#/components/schemas/Currency",
      },

      timezone: {
        type: "string",
      },
    },
  },

  UpdateUserRequest: {
    type: "object",

    properties: {
      firstName: {
        type: "string",
      },

      lastName: {
        type: "string",
      },

      displayName: {
        type: "string",
      },

      email: {
        type: "string",
        format: "email",
      },

      phone: {
        type: "string",
      },

      timezone: {
        type: "string",
      },

      position: {
        type: "string",
      },

      hourlyRate: {
        type: "number",
      },

      currency: {
        $ref: "#/components/schemas/Currency",
      },

      isFop3Group: {
        type: "boolean",
      },

      isActive: {
        type: "boolean",
      },
    },
  },

  UpdateRoleRequest: {
    type: "object",

    required: ["role"],

    properties: {
      role: {
        $ref: "#/components/schemas/Role",
      },
    },
  },
};