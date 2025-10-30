const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

function createApp() {
  const app = express();
  app.use(express.json());

  // --- Configuración de Swagger ---
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Proyecto Backend - Users & Adoptions',
        version: '1.0.0',
        description: 'Documentación de la API (Módulos Users, Mocks y Adoptions)',
      },
      servers: [
        {
          url: 'http://localhost:' + (process.env.PORT || 3000),
          description: 'Servidor local',
        },
      ],
    },
    apis: ['./src/routers/*.js', './src/docs/*.yaml'],
  };

  const swaggerSpecs = swaggerJsdoc(swaggerOptions);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // --- Routers ---
  const mockRouter = require('./routers/mock.router');
  const userRouter = require('./routers/user.router');
  const adoptionRouter = require('./routers/adoption.router');

  app.use('/api/mocks', mockRouter);
  app.use('/api/users', userRouter);
  app.use('/api/adoptions', adoptionRouter);

  // --- Middleware de errores ---
  app.use((err, req, res, next) => {
    console.error('❌ Error capturado:', err);
    res.status(500).json({ status: 'error', error: err.message });
  });

  return app;
}

module.exports = createApp;
