import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import iniciarMQTT from './services/mqttService.js';

// Importar rotas
import usuarioRotas from './routes/usuarioRotas.js'
import maquinaRotas from './routes/maquinaRotas.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false, // Deixa as rotas OPTIONS específicas serem processadas
    optionsSuccessStatus: 200 // Retorna 200 para OPTIONS em vez de 204
}));

// Body parsers (necessários para req.body em JSON e forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/usuarios', usuarioRotas);
app.use('/maquinas', maquinaRotas);

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Predict Guard API"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger em http://localhost:${PORT}/api-docs`);
    iniciarMQTT();
    console.log('Serviço MQTT iniciado.');
})