import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import iniciarMQTT from './services/mqttService.js';
import cookieParser from "cookie-parser";

// Importar rotas
import authRotas from './routes/authRotas.js'
import usuarioRotas from './routes/usuarioRotas.js'
import maquinaRotas from './routes/maquinaRotas.js'
import servicoRotas from './routes/servicoRotas.js'
import sensorRotas from './routes/sensorRotas.js'
import leituraRotas from './routes/leituraRotas.js'
import alertaRotas from './routes/alertaRotas.js'

import { logMiddleware } from './middlewares/logMiddleware.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false, // Deixa as rotas OPTIONS específicas serem processadas
    optionsSuccessStatus: 200 // Retorna 200 para OPTIONS em vez de 204
}));

app.use(cookieParser());

// Body parsers (necessários para req.body em JSON e forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logMiddleware);

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/auth', authRotas);
app.use('/usuarios', usuarioRotas);
app.use('/maquinas', maquinaRotas);
app.use('/servicos', servicoRotas);
app.use('/sensores', sensorRotas);
app.use('/leituras', leituraRotas);
app.use('/alertas', alertaRotas);

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Predict Guard API"
    })
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger em http://localhost:${PORT}/api-docs`);
    iniciarMQTT();
    console.log('Serviço MQTT iniciado.');
})