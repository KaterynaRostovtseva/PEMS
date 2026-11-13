export const projectPaths = {

  "/projects": {

    get: {

      tags: [
        "Projects",
      ],

      summary:
        "Get projects",

      description:
        "Returns projects of current organization.",


      security: [
        {
          BearerAuth: [],
        },
      ],


      parameters: [

        {
          name: "status",

          in: "query",

          schema: {
            $ref:
              "#/components/schemas/ProjectStatus",
          },
        },

      ],


      responses: {

        200: {

          description:
            "Projects list",

          content: {

            "application/json": {

              schema: {

                type: "array",

                items: {

                  $ref:
                    "#/components/schemas/Project",

                },

              },

            },

          },

        },


        401: {

          $ref:
            "#/components/responses/Unauthorized",

        },

      },

    },



    post: {

      tags: [
        "Projects",
      ],


      summary:
        "Create project",


      security: [
        {
          BearerAuth: [],
        },
      ],


      requestBody: {

        required: true,


        content: {

          "application/json": {

            schema: {

              $ref:
                "#/components/schemas/CreateProjectRequest",

            },

          },

        },

      },


      responses: {


        201: {

          description:
            "Project created",

          content: {

            "application/json": {

              schema: {

                $ref:
                  "#/components/schemas/Project",

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




  "/projects/{id}": {


    get: {

      tags:[
        "Projects",
      ],


      summary:
        "Get project by id",


      security:[
        {
          BearerAuth:[],
        },
      ],


      parameters:[

        {

          name:"id",

          in:"path",

          required:true,


          schema:{

            type:"string",

            format:"uuid",

          },

        },

      ],



      responses:{


        200:{

          description:
            "Project details",


          content:{

            "application/json":{

              schema:{

                $ref:
                  "#/components/schemas/Project",

              },

            },

          },

        },


        404:{

          $ref:
            "#/components/responses/NotFound",

        },


      },


    },



    patch:{


      tags:[
        "Projects",
      ],


      summary:
        "Update project",


      security:[
        {
          BearerAuth:[],
        },
      ],


      parameters:[

        {

          name:"id",

          in:"path",

          required:true,


          schema:{
            type:"string",
            format:"uuid",
          },

        },

      ],



      requestBody:{

        required:true,


        content:{

          "application/json":{

            schema:{

              $ref:
                "#/components/schemas/UpdateProjectRequest",

            },

          },

        },

      },



      responses:{


        200:{

          description:
            "Project updated",


          content:{

            "application/json":{

              schema:{

                $ref:
                  "#/components/schemas/Project",

              },

            },

          },

        },



        404:{

          $ref:
            "#/components/responses/NotFound",

        },


      },


    },



    delete:{


      tags:[
        "Projects",
      ],


      summary:
        "Delete project",


      security:[
        {
          BearerAuth:[],
        },
      ],


      parameters:[

        {

          name:"id",

          in:"path",

          required:true,


          schema:{

            type:"string",

            format:"uuid",

          },

        },

      ],



      responses:{


        204:{

          description:
            "Project deleted",

        },


        404:{

          $ref:
            "#/components/responses/NotFound",

        },

      },


    },


  },

};