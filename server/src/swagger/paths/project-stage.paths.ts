export const projectStagePaths = {


  "/projects/{projectId}/stages": {


    get: {

      tags: [
        "Project Stages",
      ],


      summary:
        "Get project stages",


      description:
        "Returns Kanban stages of project.",


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
            "Stages list",


          content: {

            "application/json": {

              schema: {

                type:
                  "array",

                items: {

                  $ref:
                    "#/components/schemas/ProjectStage",

                },

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





    post: {


      tags: [
        "Project Stages",
      ],


      summary:
        "Create project stage",


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



      requestBody: {

        required:
          true,


        content: {

          "application/json": {


            schema: {

              type:
                "object",


              required: [

                "name",

              ],



              properties: {


                name: {

                  type:
                    "string",

                  example:
                    "Development",

                },


                order: {

                  type:
                    "integer",

                  example:
                    1,

                },


                status: {

                  $ref:
                    "#/components/schemas/StageStatus",

                },


              },


            },

          },

        },

      },



      responses: {


        201: {


          description:
            "Stage created",


          content: {


            "application/json": {


              schema: {


                $ref:
                  "#/components/schemas/ProjectStage",


              },


            },


          },


        },


        400: {

          $ref:
            "#/components/responses/BadRequest",

        },


      },


    },


  },







  "/projects/{projectId}/stages/{stageId}": {


    patch: {


      tags: [

        "Project Stages",

      ],


      summary:

        "Update project stage",


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


        {

          name:
            "stageId",

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



      requestBody: {


        required:
          true,


        content: {


          "application/json": {


            schema: {


              type:
                "object",



              properties: {


                name: {

                  type:
                    "string",

                },


                order: {

                  type:
                    "integer",

                },


                status: {

                  $ref:
                    "#/components/schemas/StageStatus",

                },


              },


            },


          },


        },


      },



      responses: {



        200: {


          description:
            "Stage updated",


          content: {


            "application/json": {


              schema: {

                $ref:
                  "#/components/schemas/ProjectStage",

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

        "Project Stages",

      ],



      summary:

        "Delete project stage",



      security: [

        {

          BearerAuth: [],

        },

      ],



      parameters: [


        {

          name:
            "stageId",

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


        204: {

          description:
            "Stage deleted",

        },


        404: {

          $ref:
            "#/components/responses/NotFound",

        },


      },


    },


  },







  "/projects/{projectId}/stages/{stageId}/history": {


    get: {


      tags: [

        "Project Stages",

      ],


      summary:

        "Get stage history",



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


        {

          name:
            "stageId",

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
            "Stage history",



          content: {


            "application/json": {


              schema: {


                type:
                  "array",


                items: {


                  $ref:
                    "#/components/schemas/ProjectStageHistory",


                },


              },


            },


          },


        },


      },


    },


  },


};