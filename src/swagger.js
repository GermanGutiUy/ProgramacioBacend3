const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Proyecto - Documentación',
      version: '1.0.0',
      description: 'Documentación Swagger para el módulo Users (y otros endpoints).'
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routers/*.js', './src/models/*.js'], // lee comentarios en routers para generar docs
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
