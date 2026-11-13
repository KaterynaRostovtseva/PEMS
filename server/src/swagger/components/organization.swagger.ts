export const organizationSchemas = {
  Organization: {
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

  CreateOrganizationRequest: {
    type: "object",

    required: ["name"],

    properties: {
      name: {
        type: "string",
        example: "PEMS Company",
      },
    },
  },

  UpdateOrganizationRequest: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "New Company Name",
      },
    },
  },
};