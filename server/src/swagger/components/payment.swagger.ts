export const paymentSchemas = {
  Payment: {
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

      user: {
        $ref: "#/components/schemas/UserBrief",
      },

      periodMonth: {
        type: "integer",
        minimum: 1,
        maximum: 12,
        example: 7,
      },

      periodYear: {
        type: "integer",
        example: 2026,
      },

      totalHours: {
        type: "number",
        example: 168.5,
      },

      hourlyRate: {
        type: "number",
        example: 25,
      },

      grossAmount: {
        type: "number",
        example: 4212.5,
      },

      taxesAmount: {
        type: "number",
        example: 210.62,
      },

      netAmount: {
        type: "number",
        example: 4001.88,
      },

      currency: {
        $ref: "#/components/schemas/Currency",
      },

      notes: {
        type: "string",
        nullable: true,
        example: "July salary payment",
      },

      isPaid: {
        type: "boolean",
        example: false,
      },

      paidAt: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2026-08-01T10:00:00.000Z",
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


  GeneratePaymentRequest: {
    type: "object",

    required: [
      "userId",
      "periodMonth",
      "periodYear",
    ],

    properties: {

      userId: {
        type: "string",
        format: "uuid",
      },

      periodMonth: {
        type: "integer",
        minimum: 1,
        maximum: 12,
        example: 7,
      },

      periodYear: {
        type: "integer",
        example: 2026,
      },

      notes: {
        type: "string",
        nullable: true,
        example: "Monthly payroll",
      },
    },
  },


  MarkPaymentPaidRequest: {
    type: "object",

    properties: {

      paidAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T10:00:00.000Z",
      },

      notes: {
        type: "string",
        example: "Bank transfer completed",
      },
    },
  },
};