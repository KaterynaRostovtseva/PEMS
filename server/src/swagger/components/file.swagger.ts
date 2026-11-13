export const fileSchemas = {

  FileAsset: {

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


      projectId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },


      taskId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },


      uploadedById: {
        type: "string",
        format: "uuid",
      },


      uploadedBy: {
        $ref:
          "#/components/schemas/UserBrief",
      },


      originalName: {
        type: "string",
        example:
          "requirements.pdf",
      },


      mimeType: {
        type: "string",
        example:
          "application/pdf",
      },


      size: {
        type: "integer",
        example:
          254000,
      },


      storagePath: {
        type: "string",
        example:
          "uploads/2026/requirements.pdf",
      },


      url: {
        type: "string",
        example:
          "/uploads/requirements.pdf",
      },


      createdAt: {
        type: "string",
        format:
          "date-time",
      },


      updatedAt: {
        type: "string",
        format:
          "date-time",
      },


    },

  },



  UploadFileResponse: {

    type: "object",

    properties: {


      message: {
        type: "string",
        example:
          "File uploaded successfully",
      },


      file: {

        $ref:
          "#/components/schemas/FileAsset",

      },


    },

  },



  UpdateFileRequest: {

    type: "object",

    properties: {


      originalName: {

        type: "string",

        example:
          "updated-contract.pdf",

      },


    },

  },


};