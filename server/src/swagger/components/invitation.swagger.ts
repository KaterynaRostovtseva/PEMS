export const invitationSchemas = {
  Invitation: {
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
        example: "employee@company.com",
      },

      role: {
        $ref: "#/components/schemas/Role",
      },

      position: {
        type: "string",
        nullable: true,
        example: "Frontend Developer",
      },

      status: {
        $ref: "#/components/schemas/InvitationStatus",
      },

      invitedById: {
        type: "string",
        format: "uuid",
      },

      expiresAt: {
        type: "string",
        format: "date-time",
      },

      acceptedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      invitedBy: {
        $ref: "#/components/schemas/UserBrief",
      },
    },
  },

  CreateInvitationRequest: {
    type: "object",

    required: [
      "email",
      "role",
    ],

    properties: {
      email: {
        type: "string",
        format: "email",
      },

      role: {
        $ref: "#/components/schemas/Role",
      },

      position: {
        type: "string",
        nullable: true,
        example: "Backend Developer",
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
    },
  },
};