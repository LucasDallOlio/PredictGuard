import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Importar rotas
import usuarioRotas from './routes/usuarioRotas.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(helmet());

// Body parsers (necessários para req.body em JSON e forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/usuarios', usuarioRotas);

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Predict Guard API"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger em http://localhost:${PORT}/api-docs`);
})