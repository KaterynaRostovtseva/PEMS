export const profileSchemas = {
  Profile: {
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

      organization: {
        type: "object",

        properties: {
          id: {
            type: "string",
            format: "uuid",
          },

          name: {
            type: "string",
            example: "PEMS Company",
          },
        },
      },
    },
  },

  UpdateProfileRequest: {
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
    },
  },

  ChangePasswordRequest: {
    type: "object",

    required: [
      "currentPassword",
      "newPassword",
    ],

    properties: {
      currentPassword: {
        type: "string",
      },

      newPassword: {
        type: "string",
        minLength: 8,
      },
    },
  },
};