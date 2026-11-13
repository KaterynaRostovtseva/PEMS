export const timeEntryPaths = {
  "/time-entries": {
    get: {
      tags: ["Time Entries"],
      summary: "Get time entries",
      description: "Returns time entries of the current organization.",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "projectId",
          in: "query",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        {
          name: "userId",
          in: "query",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        {
          name: "status",
          in: "query",
          schema: {
            $ref: "#/components/schemas/TimeEntryStatus",
          },
        },
        {
          name: "from",
          in: "query",
          schema: {
            type: "string",
            format: "date",
          },
        },
        {
          name: "to",
          in: "query",
          schema: {
            type: "string",
            format: "date",
          },
        },
      ],

      responses: {
        200: {
          description: "Time entries list",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/TimeEntry",
                },
              },
            },
          },
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },

    post: {
      tags: ["Time Entries"],
      summary: "Create time entry",
      description: "Creates a new time entry.",
      security: [{ BearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateTimeEntryRequest",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Time entry created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TimeEntry",
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

  "/time-entries/{id}": {
    get: {
      tags: ["Time Entries"],
      summary: "Get time entry by ID",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],

      responses: {
        200: {
          description: "Time entry",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TimeEntry",
              },
            },
          },
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },

    patch: {
      tags: ["Time Entries"],
      summary: "Update time entry",
      description: "Updates a pending time entry.",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateTimeEntryRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Time entry updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TimeEntry",
              },
            },
          },
        },

        400: {
          $ref: "#/components/responses/BadRequest",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        409: {
          description: "Approved time entries cannot be edited.",
        },
      },
    },

    delete: {
      tags: ["Time Entries"],
      summary: "Delete time entry",
      description: "Deletes a pending time entry.",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],

      responses: {
        204: {
          description: "Time entry deleted",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        409: {
          description: "Approved time entries cannot be deleted.",
        },
      },
    },
  },

  "/time-entries/{id}/approve": {
    patch: {
      tags: ["Time Entries"],
      summary: "Approve or reject time entry",
      description: "Approves or rejects a time entry.",
      security: [{ BearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ModerateTimeEntryRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Time entry status updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TimeEntry",
              },
            },
          },
        },

        400: {
          $ref: "#/components/responses/BadRequest",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },
  },
};