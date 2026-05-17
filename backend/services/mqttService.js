import mqtt from 'mqtt';
import dotenv from 'dotenv';
import LeituraModel from '../models/LeituraModel.js';
import AlertaLeituraModel from '../models/AlertaLeituraModel.js';
import { getConnection } from '../config/database.js';

dotenv.config();

// ── Configuração ──────────────────────────────────────────────────────────
const BROKER_URL  = process.env.MQTT_BROKER_URL  || 'mqtt://127.0.0.1';
const PORT        = parseInt(process.env.MQTT_PORT) || 1883;
const CLIENT_ID   = process.env.MQTT_CLIENT_ID   || 'predictguard_backend';

// Tópicos com wildcards para subscrever a múltiplos sensores
const TOPIC_TEMP_PATTERN = 'motor/temperatura/+';
const TOPIC_VIBRA_PATTERN = 'motor/vibracao/+';

// Limites de alerta
const TEMP_LIMITE = parseFloat(process.env.MQTT_TEMP_LIMITE) || 85.0;
const VIBRA_LIMITE = parseFloat(process.env.MQTT_VIBRA_LIMITE) || 7.1;

const sensorCache = new Map();

async function carregarSensoresEmCache() {
    const connection = await getConnection();

    try {
        const sql = `
            select id, maquina_id, tipo
            from sensores
            where tipo in ('temperatura', 'acelerometro')
        `;

        const [rows] = await connection.execute(sql);

        sensorCache.clear();

        for (const row of rows) {
            sensorCache.set(Number(row.id), {
                id: Number(row.id),
                maquina_id: Number(row.maquina_id),
                tipo: row.tipo
            });
        }
    }
    finally {
        connection.release();
    }
}



// ── Handler: temperatura ──────────────────────────────────────────────────
async function handleTemperatura(payload, sensorId) {
    const valor = parseFloat(payload);

    if (isNaN(valor)) {
        console.warn('[MQTT] Temperatura inválida recebida:', payload);
        return;
    }

    const sensor = sensorCache.get(sensorId);
    if (!sensor) {
        console.warn(`[MQTT] Sensor ${sensorId} não encontrado`);
        return;
    }

    const maquinaId = sensor.maquina_id;

    // Salva leitura
    await LeituraModel.registrar({
        sensor_id: sensorId,
        valor,
        unidade: 'celsius'
    });

    if (valor >= TEMP_LIMITE) {
        await AlertaLeituraModel.criar({
            maquina_id:         maquinaId,
            sensor_id:          sensorId,
            tipo_alerta:        'temperatura',
            severidade:         valor >= TEMP_LIMITE * 1.1 ? 'critica' : 'alta',
            valor_detectado:    valor,
            limite_configurado: TEMP_LIMITE,
            unidade:            'celsius',
            mensagem:           `Temperatura ${valor}°C acima do limite de ${TEMP_LIMITE}°C na máquina ${maquinaId}.`
        });
        console.warn(`[MQTT] ⚠️  Alerta de temperatura: M${maquinaId} S${sensorId} ${valor}°C (limite: ${TEMP_LIMITE}°C)`);
    }

    console.log(`[MQTT] 🌡️  S${sensorId} Temperatura salva: ${valor}°C`);
}

// ── Handler: vibração ─────────────────────────────────────────────────────
async function handleVibracao(payload, sensorId) {
    const valor = parseFloat(payload);

    if (isNaN(valor)) {
        console.warn('[MQTT] Vibração inválida recebida:', payload);
        return;
    }

    const sensor = sensorCache.get(sensorId);
    if (!sensor) {
        console.warn(`[MQTT] Sensor ${sensorId} não encontrado`);
        return;
    }

    const maquinaId = sensor.maquina_id;

    // Salva leitura
    await LeituraModel.registrar({
        sensor_id: sensorId,
        valor,
        unidade: 'mm/s' 
    });

    if (valor >= VIBRA_LIMITE) {
        await AlertaLeituraModel.criar({
            maquina_id:         maquinaId,
            sensor_id:          sensorId,
            tipo_alerta:        'vibracao',
            severidade:         valor >= VIBRA_LIMITE * 1.1 ? 'critica' : 'alta',
            valor_detectado:    valor,
            limite_configurado: VIBRA_LIMITE,
            unidade:            'mm/s',
            mensagem:           `Vibração ${valor} mm/s acima do limite de ${VIBRA_LIMITE} mm/s na máquina ${maquinaId}.`
        });
        console.warn(`[MQTT] ⚠️  Alerta de vibração: M${maquinaId} S${sensorId} ${valor} mm/s (limite: ${VIBRA_LIMITE} mm/s)`);
    }

    console.log(`[MQTT] 📳 S${sensorId} Vibração salva: ${valor} mm/s`);
}

// ── Extrai sensor_id do tópico ──────────────────────────────────────────
function extrairSensorId(topic) {
    const partes = topic.split('/');
    const sensorId = parseInt(partes[partes.length - 1], 10);
    return Number.isFinite(sensorId) ? sensorId : null;
}

// ── Inicialização do serviço ──────────────────────────────────────────────
async function iniciarMQTT() {
    try {
        await carregarSensoresEmCache();
        console.log(`[MQTT] Sensores carregados em cache: ${sensorCache.size}`);
    }
    catch (error) {
        console.error('[MQTT] Erro ao carregar sensores em cache:', error.message);
    }

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

        const topicos = [TOPIC_TEMP_PATTERN, TOPIC_VIBRA_PATTERN];
        client.subscribe(topicos, { qos: 1 }, (err) => {
            if (err) {
                console.error('[MQTT] Erro ao subscrever tópicos:', err.message);
                return;
            }
            console.log('[MQTT] 📡 Subscrito nos padrões:', topicos);
        });
    });

    client.on('message', async (topic, message) => {
        const payload = message.toString();
        const sensorId = extrairSensorId(topic);

        if (!sensorId) {
            console.warn('[MQTT] Não conseguiu extrair sensor_id do tópico:', topic);
            return;
        }

        try {
            if (topic.includes('temperatura')) {
                await handleTemperatura(payload, sensorId);
            } else if (topic.includes('vibracao')) {
                await handleVibracao(payload, sensorId);
            } else {
                console.warn('[MQTT] Tópico não reconhecido:', topic);
            }
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