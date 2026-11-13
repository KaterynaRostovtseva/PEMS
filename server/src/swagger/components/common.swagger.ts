export const commonSchemas = {
  Error: {
    type: "object",
    properties: {
      error: {
        type: "string",
        example: "Something went wrong",
      },
      details: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "array",
            items: {
              type: "string",
            },
          },
        ],
      },
    },
    required: ["error"],
  },

  Role: {
    type: "string",
    enum: ["OWNER", "MANAGER", "EMPLOYEE"],
  },

  Currency: {
    type: "string",
    enum: ["UAH", "USD", "EUR"],
  },

  ProjectStatus: {
    type: "string",
    enum: ["ACTIVE", "ON_HOLD", "COMPLETED"],
  },

  StageStatus: {
    type: "string",
    enum: ["TODO", "IN_PROGRESS", "DONE"],
  },

  TaskStatus: {
    type: "string",
    enum: ["TODO", "IN_PROGRESS", "REVIEW", "DONE"],
  },

  TaskPriority: {
    type: "string",
    enum: ["LOW", "MEDIUM", "HIGH"],
  },

  TimeEntryStatus: {
    type: "string",
    enum: ["PENDING", "APPROVED", "REJECTED"],
  },

  ProjectRole: {
    type: "string",
    enum: [
      "PROJECT_MANAGER",
      "TEAM_LEAD",
      "DEVELOPER",
      "DESIGNER",
      "QA",
      "DEVOPS",
      "ANALYST",
      "BUSINESS_ANALYST",
    ],
  },

  PaymentStatus: {
    type: "string",
    enum: ["PENDING", "PAID", "CANCELLED"],
  },
};
