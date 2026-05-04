import mqtt from 'mqtt';
import dotenv from 'dotenv';
import LeituraModel from '../models/LeituraModel.js';
import AlertaLeituraModel from '../models/AlertaLeituraModel.js';

dotenv.config();

// ── Configuração ──────────────────────────────────────────────────────────
const BROKER_URL  = process.env.MQTT_BROKER_URL  || 'mqtt://192.168.4.2';
const PORT        = parseInt(process.env.MQTT_PORT) || 1883;
const CLIENT_ID   = process.env.MQTT_CLIENT_ID   || 'predictguard_backend';
const MAQUINA_ID  = parseInt(process.env.MQTT_MAQUINA_ID)   || 1;
const SENSOR_TEMP = parseInt(process.env.MQTT_SENSOR_ID_TEMP)  || 1;
const SENSOR_VIBRA= parseInt(process.env.MQTT_SENSOR_ID_VIBRA) || 2;

const TOPICS = {
    TEMPERATURA: 'motor/temperatura/motor',
    VIBRACAO:    'motor/vibracao/status',
};

// Mapeamento de status ISO 10816-3 → severidade do banco
const SEVERIDADE_VIBRACAO = {
    ATENCAO: 'baixa',
    ALERTA:  'média',
    CRITICO: 'crítica',
};

// ── Handler: temperatura ──────────────────────────────────────────────────
async function handleTemperatura(payload) {
    const valor = parseFloat(payload);

    if (isNaN(valor)) {
        console.warn('[MQTT] Temperatura inválida recebida:', payload);
        return;
    }

    // Salva leitura
    await LeituraModel.registrar({
        sensor_id: SENSOR_TEMP,
        valor,
        unidade: 'celsius'
    });

    // Gera alerta se ultrapassar o limite da máquina
    // (limite vem do .env ou pode ser buscado do banco — veja nota abaixo)
    const limite = parseFloat(process.env.MQTT_TEMP_LIMITE) || 85.0;

    if (valor >= limite) {
        await AlertaLeituraModel.criar({
            maquina_id:        MAQUINA_ID,
            sensor_id:         SENSOR_TEMP,
            tipo_alerta:       'temperatura',
            severidade:        valor >= limite * 1.1 ? 'crítica' : 'alta',
            valor_detectado:   valor,
            limite_configurado: limite,
            unidade:           'celsius',
            mensagem:          `Temperatura ${valor}°C acima do limite de ${limite}°C na máquina ${MAQUINA_ID}.`
        });
        console.warn(`[MQTT] ⚠️  Alerta de temperatura: ${valor}°C (limite: ${limite}°C)`);
    }

    console.log(`[MQTT] 🌡️  Temperatura salva: ${valor}°C`);
}

// ── Handler: vibração ─────────────────────────────────────────────────────
async function handleVibracao(payload) {
    const status = payload.trim().toUpperCase();
    const statusValidos = ['NORMAL', 'ATENCAO', 'ALERTA', 'CRITICO'];

    if (!statusValidos.includes(status)) {
        console.warn('[MQTT] Status de vibração inválido:', payload);
        return;
    }

    // Status NORMAL não gera alerta
    if (status === 'NORMAL') {
        console.log('[MQTT] 📳 Vibração: NORMAL');
        return;
    }

    const severidade = SEVERIDADE_VIBRACAO[status];

    await AlertaLeituraModel.criar({
        maquina_id:  MAQUINA_ID,
        sensor_id:   SENSOR_VIBRA,
        tipo_alerta: 'vibração',
        severidade,
        mensagem:    `Vibração com status ${status} detectada na máquina ${MAQUINA_ID} (ISO 10816-3).`
    });

    console.warn(`[MQTT] ⚠️  Alerta de vibração: ${status}`);
}

// ── Roteador de mensagens ─────────────────────────────────────────────────
const handlers = {
    [TOPICS.TEMPERATURA]: handleTemperatura,
    [TOPICS.VIBRACAO]:    handleVibracao,
};

// ── Inicialização do serviço ──────────────────────────────────────────────
function iniciarMQTT() {
    const client = mqtt.connect(BROKER_URL, {
        port:               PORT,
        clientId:           CLIENT_ID,
        clean:              true,
        reconnectPeriod:    5000,   // tenta reconectar a cada 5s
        connectTimeout:     10000,  // timeout de 10s
        keepalive:          60,
    });

    client.on('connect', () => {
        console.log(`[MQTT] ✅ Conectado ao broker: ${BROKER_URL}:${PORT}`);

        const topicos = Object.values(TOPICS);
        client.subscribe(topicos, { qos: 1 }, (err) => {
            if (err) {
                console.error('[MQTT] Erro ao subscrever tópicos:', err.message);
                return;
            }
            console.log('[MQTT] 📡 Subscrito nos tópicos:', topicos);
        });
    });

    client.on('message', async (topic, message) => {
        const payload = message.toString();
        const handler = handlers[topic];

        if (!handler) {
            console.warn('[MQTT] Tópico sem handler:', topic);
            return;
        }

        try {
            await handler(payload);
        } catch (error) {
            // Nunca derruba o processo por erro de um handler
            console.error(`[MQTT] Erro ao processar tópico "${topic}":`, error.message);
        }
    });

    client.on('reconnect', () => {
        console.log('[MQTT] 🔄 Reconectando ao broker...');
    });

    client.on('offline', () => {
        console.warn('[MQTT] 📴 Cliente offline — aguardando reconexão...');
    });

    client.on('error', (err) => {
        console.error('[MQTT] Erro de conexão:', err.message);
    });

    return client;
}

export default iniciarMQTT;