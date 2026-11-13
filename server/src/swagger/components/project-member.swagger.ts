export const projectMemberSchemas = {

  ProjectMember: {

    type: "object",

    properties: {

      id: {
        type: "string",
        format: "uuid",
      },

      projectId: {
        type: "string",
        format: "uuid",
      },

      userId: {
        type: "string",
        format: "uuid",
      },


      isActive: {
        type: "boolean",
        example: true,
      },


      roleInProject: {

        $ref:
          "#/components/schemas/ProjectRole",

        nullable: true,

      },


      user: {
        $ref:
          "#/components/schemas/UserBrief",
      },


      createdAt: {
        type: "string",
        format: "date-time",
      },

    },

  },


  AssignProjectMemberRequest: {

    type: "object",

    required:[
      "userId",
    ],


    properties: {

      userId:{
        type:"string",
        format:"uuid",
      },


      roleInProject:{
        $ref:
          "#/components/schemas/ProjectRole",
      },


    },

  },


  UpdateProjectMemberRequest: {

    type:"object",

    properties:{

      roleInProject:{
        $ref:
          "#/components/schemas/ProjectRole",
      },


      isActive:{
        type:"boolean",
      },

    },

  },

};