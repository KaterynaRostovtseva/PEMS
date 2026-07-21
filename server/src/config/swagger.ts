import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PEMS API',
      version: '1.0.0',
      description: 'Документация для бэкенда PEMS',
    },
    servers: [
      {
        url: 'https://pems-i9a1.onrender.com',
        description: 'Production сервер',
      },
      {
        url: 'http://localhost:5000',
        description: 'Локальный сервер',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);