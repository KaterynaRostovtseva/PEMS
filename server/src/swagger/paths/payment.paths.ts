export const paymentPaths = {
  "/payments": {
    get: {
      tags: ["Payments"],
      summary: "Get payments",
      description:
        "Returns payroll payments of the organization.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "userId",
          in: "query",
          description: "Filter by employee",
          schema: {
            type: "string",
            format: "uuid",
          },
        },

        {
          name: "periodMonth",
          in: "query",
          description: "Filter by month",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 12,
          },
        },

        {
          name: "periodYear",
          in: "query",
          description: "Filter by year",
          schema: {
            type: "integer",
            example: 2026,
          },
        },

        {
          name: "isPaid",
          in: "query",
          description: "Filter paid/unpaid payments",
          schema: {
            type: "boolean",
          },
        },
      ],


      responses: {
        200: {
          description: "Payments list",

          content: {
            "application/json": {
              schema: {
                type: "array",

                items: {
                  $ref:
                    "#/components/schemas/Payment",
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
  },


  "/payments/generate": {
    post: {
      tags: ["Payments"],

      summary: "Generate payment",

      description:
        "Creates payroll calculation based on approved time entries.",


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
                "#/components/schemas/GeneratePaymentRequest",
            },
          },
        },
      },


      responses: {

        201: {
          description:
            "Payment generated",

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/Payment",
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


  "/payments/{id}": {

    get: {

      tags: ["Payments"],

      summary: "Get payment by id",

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
            format: "uuid",
          },
        },

      ],


      responses: {

        200: {

          description:
            "Payment details",

          content: {

            "application/json": {

              schema: {

                $ref:
                  "#/components/schemas/Payment",

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

  },


  "/payments/{id}/mark-paid": {

    patch: {

      tags: ["Payments"],


      summary:
        "Mark payment as paid",


      description:
        "Marks payroll payment as completed.",


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

            format: "uuid",

          },

        },

      ],


      requestBody: {

        required: false,


        content: {

          "application/json": {

            schema: {

              $ref:
                "#/components/schemas/MarkPaymentPaidRequest",

            },

          },

        },

      },


      responses: {


        200: {

          description:
            "Payment marked as paid",

          content: {

            "application/json": {

              schema: {

                $ref:
                  "#/components/schemas/Payment",

              },

            },

          },

        },


        404: {

          $ref:
            "#/components/responses/NotFound",

        },


        409: {

          description:
            "Payment already paid",

        },


      },

    },

  },


  "/payments/{id}/export": {

    get: {

      tags: ["Payments"],


      summary:
        "Export payment PDF",


      description:
        "Downloads payroll calculation PDF.",


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

            format: "uuid",

          },

        },

      ],


      responses: {


        200: {

          description:
            "PDF file",


          content: {

            "application/pdf": {

              schema: {

                type: "string",

                format: "binary",

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

  },

};