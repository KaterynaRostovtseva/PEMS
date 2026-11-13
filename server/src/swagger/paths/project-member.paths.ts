export const projectMemberPaths = {

  "/projects/{projectId}/members": {

    get: {

      tags: [
        "Project Members",
      ],

      summary:
        "Get project members",

      description:
        "Returns all employees assigned to project.",


      security: [
        {
          BearerAuth: [],
        },
      ],


      parameters: [

        {
          name: "projectId",

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

          description:
            "Project members list",

          content: {

            "application/json": {

              schema: {

                type: "array",

                items: {

                  $ref:
                    "#/components/schemas/ProjectMember",

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
        "Project Members",
      ],


      summary:
        "Assign employee to project",


      security: [
        {
          BearerAuth: [],
        },
      ],


      parameters: [

        {
          name: "projectId",

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

              $ref:
                "#/components/schemas/AssignProjectMemberRequest",

            },

          },

        },

      },



      responses: {


        201: {

          description:
            "Employee assigned",

          content: {

            "application/json": {

              schema: {

                $ref:
                  "#/components/schemas/ProjectMember",

              },

            },

          },

        },


        400: {

          $ref:
            "#/components/responses/BadRequest",

        },


        409: {

          $ref:
            "#/components/responses/Conflict",

        },


      },


    },

  },





  "/projects/{projectId}/members/{memberId}": {


    patch: {

      tags:[
        "Project Members",
      ],


      summary:
        "Update project member",


      security:[
        {
          BearerAuth:[],
        },
      ],


      parameters:[

        {

          name:"projectId",

          in:"path",

          required:true,


          schema:{
            type:"string",
            format:"uuid",
          },

        },


        {

          name:"memberId",

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
                "#/components/schemas/UpdateProjectMemberRequest",

            },

          },

        },

      },



      responses:{


        200:{

          description:
            "Project member updated",


          content:{

            "application/json":{

              schema:{

                $ref:
                  "#/components/schemas/ProjectMember",

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




    delete: {

      tags:[
        "Project Members",
      ],


      summary:
        "Remove employee from project",


      security:[
        {
          BearerAuth:[],
        },
      ],



      parameters:[

        {

          name:"projectId",

          in:"path",

          required:true,


          schema:{
            type:"string",
            format:"uuid",
          },

        },


        {

          name:"memberId",

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
            "Employee removed from project",

        },


        404:{

          $ref:
            "#/components/responses/NotFound",

        },


      },

    },


  },


};