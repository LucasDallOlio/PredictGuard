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
    VIBRACAO:    'motor/vibracao/rms',
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

    const limite = parseFloat(process.env.MQTT_TEMP_LIMITE) || 85.0;

    if (valor >= limite) {
        await AlertaLeituraModel.criar({
            maquina_id:         MAQUINA_ID,
            sensor_id:          SENSOR_TEMP,
            tipo_alerta:        'temperatura',
            severidade:         valor >= limite * 1.1 ? 'critica' : 'alta',
            valor_detectado:    valor,
            limite_configurado: limite,
            unidade:            'celsius',
            mensagem:           `Temperatura ${valor}°C acima do limite de ${limite}°C na máquina ${MAQUINA_ID}.`
        });
        console.warn(`[MQTT] ⚠️  Alerta de temperatura: ${valor}°C (limite: ${limite}°C)`);
    }

    console.log(`[MQTT] 🌡️  Temperatura salva: ${valor}°C`);
}

// ── Handler: vibração ─────────────────────────────────────────────────────
async function handleVibracao(payload) {
    const valor = parseFloat(payload);

    if (isNaN(valor)) {
        console.warn('[MQTT] Vibração inválida recebida:', payload);
        return;
    }

    // Salva leitura - Ajustado para 'mm/s' conforme seu ENUM do banco
    await LeituraModel.registrar({
        sensor_id: SENSOR_VIBRA,
        valor,
        unidade: 'mm/s' 
    });

    const limite = parseFloat(process.env.MQTT_VIBRA_LIMITE) || 7.1;

    if (valor >= limite) {
        await AlertaLeituraModel.criar({
            maquina_id:         MAQUINA_ID,
            sensor_id:          SENSOR_VIBRA,
            tipo_alerta:        'vibracao', // Sem acento conforme ENUM do banco
            severidade:         valor >= limite * 1.1 ? 'critica' : 'alta', // Sem acento conforme ENUM
            valor_detectado:    valor,
            limite_configurado: limite,
            unidade:            'mm/s',
            mensagem:           `Vibração ${valor} mm/s acima do limite de ${limite} mm/s na máquina ${MAQUINA_ID}.`
        });
        console.warn(`[MQTT] ⚠️  Alerta de vibração: ${valor} mm/s (limite: ${limite} mm/s)`);
    }

    console.log(`[MQTT] 📳 Vibração salva: ${valor} mm/s`);
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
        reconnectPeriod:    5000,
        connectTimeout:     10000,
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