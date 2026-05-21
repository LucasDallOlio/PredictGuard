import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const PORT = process.env.PORT || 3001;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Predict Guard API',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos com anotações
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;