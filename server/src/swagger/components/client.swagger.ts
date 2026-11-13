export const clientSchemas = {
  Client: {
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

      name: {
        type: "string",
        example: "Acme Corporation",
      },

      email: {
        type: "string",
        format: "email",
        nullable: true,
        example: "contact@acme.com",
      },

      phone: {
        type: "string",
        nullable: true,
        example: "+380501112233",
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

  CreateClientRequest: {
    type: "object",

    required: ["name"],

    properties: {
      name: {
        type: "string",
        example: "Acme Corporation",
      },

      email: {
        type: "string",
        format: "email",
        nullable: true,
      },

      phone: {
        type: "string",
        nullable: true,
      },
    },
  },

  UpdateClientRequest: {
    type: "object",

    properties: {
      name: {
        type: "string",
      },

      email: {
        type: "string",
        format: "email",
        nullable: true,
      },

      phone: {
        type: "string",
        nullable: true,
      },
    },
  },
};