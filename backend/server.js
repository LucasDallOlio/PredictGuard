import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(helmet());

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Predict Guard API"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})