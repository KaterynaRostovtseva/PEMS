export const filePaths = {

  "/files/upload": {

    post: {

      tags: [
        "Files",
      ],

      summary:
        "Upload file",

      description:
        "Upload file to organization, project or task.",


      security: [
        {
          BearerAuth: [],
        },
      ],


      requestBody: {

        required: true,

        content: {

          "multipart/form-data": {

            schema: {

              type: "object",

              required: [
                "file",
              ],


              properties: {

                file: {

                  type: "string",

                  format:
                    "binary",

                },


                projectId: {

                  type: "string",

                  format:
                    "uuid",

                  nullable: true,

                },


                taskId: {

                  type: "string",

                  format:
                    "uuid",

                  nullable: true,

                },

              },

            },

          },

        },

      },


      responses: {


        201: {

          description:
            "File uploaded successfully",

          content: {

            "application/json": {

              schema: {

                $ref:
                  "#/components/schemas/UploadFileResponse",

              },

            },

          },

        },


        400: {

          $ref:
            "#/components/responses/BadRequest",

        },


        401: {

          $ref:
            "#/components/responses/Unauthorized",

        },


      },

    },

  },



  "/files/{id}": {


    get: {

      tags: [
        "Files",
      ],


      summary:
        "Get file by id",


      security: [
        {
          BearerAuth: [],
        },
      ],


      parameters: [

        {

          name: "id",

          in: "path",

          required: true,


          schema: {

            type: "string",

            format:
              "uuid",

          },

        },

      ],


      responses: {


        200: {

          description:
            "File information",

          content: {

            "application/json": {

              schema: {

                $ref:
                  "#/components/schemas/FileAsset",

              },

            },

          },

        },


        404: {

          $ref:
            "#/components/responses/NotFound",

        },


      },

    },



    delete: {

      tags: [
        "Files",
      ],


      summary:
        "Delete file",


      description:
        "Deletes file from storage and database.",


      security: [
        {
          BearerAuth: [],
        },
      ],


      parameters: [

        {

          name: "id",

          in: "path",

          required: true,


          schema: {

            type: "string",

            format:
              "uuid",

          },

        },

      ],


      responses: {


        204: {

          description:
            "File deleted",

        },


        404: {

          $ref:
            "#/components/responses/NotFound",

        },


      },

    },


  },



  "/files/project/{projectId}": {


    get: {

      tags: [
        "Files",
      ],


      summary:
        "Get project files",


      security: [
        {
          BearerAuth: [],
        },
      ],


      parameters: [

        {

          name:
            "projectId",

          in:
            "path",

          required:
            true,


          schema: {

            type:
              "string",

            format:
              "uuid",

          },

        },

      ],


      responses: {


        200: {

          description:
            "Project files list",

          content: {

            "application/json": {

              schema: {

                type:
                  "array",

                items: {

                  $ref:
                    "#/components/schemas/FileAsset",

                },

              },

            },

          },

        },

      },

    },

  },



  "/files/task/{taskId}": {


    get: {

      tags: [
        "Files",
      ],


      summary:
        "Get task files",


      security: [
        {
          BearerAuth: [],
        },
      ],


      parameters: [

        {

          name:
            "taskId",

          in:
            "path",

          required:
            true,


          schema: {

            type:
              "string",

            format:
              "uuid",

          },

        },

      ],


      responses: {


        200: {

          description:
            "Task files list",


          content: {

            "application/json": {

              schema: {

                type:
                  "array",

                items: {

                  $ref:
                    "#/components/schemas/FileAsset",

                },

              },

            },

          },

        },

      },

    },

  },


};