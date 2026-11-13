export const projectSchemas = {

  Project: {
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


      code: {
        type: "string",
        example: "PEMS-001",
      },


      color: {
        type: "string",
        nullable: true,
        example: "#2563EB",
      },


      name: {
        type: "string",
        example: "PEMS CRM",
      },


      description: {
        type: "string",
        nullable: true,
      },


      status: {
        $ref:
          "#/components/schemas/ProjectStatus",
      },


      budget: {
        type: "number",
        nullable: true,
        example: 15000,
      },


      clientId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },


      managerId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },


      startDate: {
        type: "string",
        format: "date-time",
        nullable: true,
      },


      endDate: {
        type: "string",
        format: "date-time",
        nullable: true,
      },


      client: {
        $ref:
          "#/components/schemas/Client",
      },


      manager: {
        $ref:
          "#/components/schemas/UserBrief",
      },


      members: {
        type: "array",
        items: {
          $ref:
            "#/components/schemas/ProjectMember",
        },
      },


      stages: {
        type: "array",
        items: {
          $ref:
            "#/components/schemas/ProjectStage",
        },
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


  CreateProjectRequest: {
    type: "object",

    required: [
      "name",
      "code",
    ],

    properties: {

      name: {
        type: "string",
      },

      code: {
        type: "string",
      },

      color: {
        type: "string",
      },

      description: {
        type: "string",
      },

      clientId: {
        type: "string",
        format: "uuid",
      },

      managerId: {
        type: "string",
        format: "uuid",
      },

      budget: {
        type: "number",
      },

      status: {
        $ref:
          "#/components/schemas/ProjectStatus",
      },

      startDate: {
        type: "string",
        format: "date-time",
      },

      endDate: {
        type: "string",
        format: "date-time",
      },

    },

  },


  UpdateProjectRequest: {
    type: "object",

    properties: {

      name: {
        type: "string",
      },

      code: {
        type: "string",
      },

      color: {
        type: "string",
      },

      description: {
        type: "string",
      },

      clientId: {
        type: "string",
        format: "uuid",
      },

      managerId: {
        type: "string",
        format: "uuid",
      },

      budget: {
        type: "number",
      },

      status: {
        $ref:
          "#/components/schemas/ProjectStatus",
      },

      startDate: {
        type: "string",
        format: "date-time",
      },

      endDate: {
        type: "string",
        format: "date-time",
      },

    },

  },

};
