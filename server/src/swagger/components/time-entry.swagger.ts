export const timeEntrySchemas = {
  TimeEntry: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      userId: {
        type: "string",
        format: "uuid",
      },

      projectId: {
        type: "string",
        format: "uuid",
      },

      taskId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      date: {
        type: "string",
        format: "date-time",
      },

      hours: {
        type: "number",
        example: 7.5,
      },

      comment: {
        type: "string",
        nullable: true,
      },

      status: {
        $ref: "#/components/schemas/TimeEntryStatus",
      },

      approvedById: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      approvedAt: {
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

      user: {
        $ref: "#/components/schemas/UserBrief",
      },

      project: {
        allOf: [
          {
            $ref: "#/components/schemas/Project",
          },
        ],
      },

      task: {
        allOf: [
          {
            $ref: "#/components/schemas/Task",
          },
        ],
        nullable: true,
      },

      approvedBy: {
        allOf: [
          {
            $ref: "#/components/schemas/UserBrief",
          },
        ],
        nullable: true,
      },
    },
  },

  CreateTimeEntryRequest: {
    type: "object",

    required: [
      "projectId",
      "date",
      "hours",
    ],

    properties: {
      projectId: {
        type: "string",
        format: "uuid",
      },

      taskId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      date: {
        type: "string",
        format: "date-time",
        example: "2026-07-01T09:00:00.000Z",
      },

      hours: {
        type: "number",
        example: 8,
      },

      comment: {
        type: "string",
        example: "Implemented authentication module",
      },
    },
  },

  UpdateTimeEntryRequest: {
    type: "object",

    properties: {
      projectId: {
        type: "string",
        format: "uuid",
      },

      taskId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      date: {
        type: "string",
        format: "date-time",
      },

      hours: {
        type: "number",
      },

      comment: {
        type: "string",
      },
    },
  },

  ApproveTimeEntryRequest: {
    type: "object",

    required: [
      "status",
    ],

    properties: {
      status: {
        type: "string",
        enum: [
          "APPROVED",
          "REJECTED",
        ],
      },
    },
  },
};