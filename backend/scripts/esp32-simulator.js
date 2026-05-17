import mqtt from 'mqtt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env.simulator ou .env como fallback
dotenv.config({ path: path.join(__dirname, '..', '.env.simulator') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://127.0.0.1';
const PORT = parseInt(process.env.MQTT_PORT || '1883', 10);
const CLIENT_ID = process.env.MQTT_CLIENT_ID || 'esp32_simulator';

const TOPIC_TEMP_TEMPLATE = process.env.MQTT_TOPIC_TEMP || 'motor/temperatura/motor';
const TOPIC_VIBRA_TEMPLATE = process.env.MQTT_TOPIC_VIBRA || 'motor/vibracao/rms';

const INTERVAL_MS = parseInt(process.env.MQTT_PUBLISH_INTERVAL_MS || '1000', 10);

const TEMP_BASE = parseFloat(process.env.SIM_TEMP_BASE || '70.0');
const TEMP_NOISE = parseFloat(process.env.SIM_TEMP_NOISE || '1.5');
const TEMP_DRIFT = parseFloat(process.env.SIM_TEMP_DRIFT || '0.02');
const TEMP_BASE_JITTER = parseFloat(process.env.SIM_TEMP_BASE_JITTER || '3.0');
const TEMP_SPIKE_PROB = parseFloat(process.env.SIM_TEMP_SPIKE_PROB || '0.02');
const TEMP_SPIKE_MAX = parseFloat(process.env.SIM_TEMP_SPIKE_MAX || '8.0');
const TEMP_SPIKE_DURATION_MS = parseInt(process.env.SIM_TEMP_SPIKE_DURATION_MS || '8000', 10);

const VIBRA_BASE = parseFloat(process.env.SIM_VIBRA_BASE || '2.0');
const VIBRA_NOISE = parseFloat(process.env.SIM_VIBRA_NOISE || '0.25');
const VIBRA_BASE_JITTER = parseFloat(process.env.SIM_VIBRA_BASE_JITTER || '0.6');
const VIBRA_SPIKE_PROB = parseFloat(process.env.SIM_VIBRA_SPIKE_PROB || '0.04');
const VIBRA_SPIKE_MAX = parseFloat(process.env.SIM_VIBRA_SPIKE_MAX || '6.0');
const VIBRA_SPIKE_DURATION_MS = parseInt(process.env.SIM_VIBRA_SPIKE_DURATION_MS || '5000', 10);

const TEMP_SENSOR_IDS = (process.env.SIM_TEMP_SENSOR_IDS || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean)
  .map((v) => parseInt(v, 10))
  .filter((v) => Number.isFinite(v));

const VIBRA_SENSOR_IDS = (process.env.SIM_VIBRA_SENSOR_IDS || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean)
  .map((v) => parseInt(v, 10))
  .filter((v) => Number.isFinite(v));

const LEGACY_DEVICE_IDS = (process.env.SIM_DEVICE_IDS || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean)
  .map((v) => parseInt(v, 10))
  .filter((v) => Number.isFinite(v));

let publishTimer = null;
let t0 = Date.now();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function resolveTopic(template, ctx) {
  return template
    .replaceAll('{maquinaId}', String(ctx.maquinaId ?? ctx.sensorId))
    .replaceAll('{sensorId}', String(ctx.sensorId))
    .replaceAll('{sensorTempId}', String(ctx.sensorId))
    .replaceAll('{sensorVibraId}', String(ctx.sensorId));
}

function buildSensorState(sensorId, tipo, index) {
  return {
    sensorId,
    tipo,
    base: tipo === 'temperatura'
      ? TEMP_BASE + rand(-TEMP_BASE_JITTER, TEMP_BASE_JITTER)
      : VIBRA_BASE + rand(-VIBRA_BASE_JITTER, VIBRA_BASE_JITTER),
    offset: 0,
    phase: rand(0, Math.PI * 2),
    spikeUntil: 0,
    spikeValue: 0,
    index,
  };
}

function nextTemperatura(state, now) {
  state.offset += rand(-TEMP_DRIFT, TEMP_DRIFT);
  const wave = Math.sin((now - t0) / 30000 + state.phase) * 0.8;
  const noise = rand(-TEMP_NOISE, TEMP_NOISE);

  if (now >= state.spikeUntil && Math.random() < TEMP_SPIKE_PROB) {
    state.spikeValue = rand(1.2, TEMP_SPIKE_MAX);
    state.spikeUntil = now + TEMP_SPIKE_DURATION_MS;
  }

  const spike = now < state.spikeUntil ? state.spikeValue : 0;
  return state.base + state.offset + wave + noise + spike;
}

function nextVibracao(state, now) {
  const wave = Math.sin((now - t0) / 15000 + state.phase) * 0.4;
  const noise = rand(-VIBRA_NOISE, VIBRA_NOISE);

  if (now >= state.spikeUntil && Math.random() < VIBRA_SPIKE_PROB) {
    state.spikeValue = rand(0.8, VIBRA_SPIKE_MAX);
    state.spikeUntil = now + VIBRA_SPIKE_DURATION_MS;
  }

  const spike = now < state.spikeUntil ? state.spikeValue : 0;
  return Math.max(0, state.base + wave + noise + spike);
}

const usingSensorMode = TEMP_SENSOR_IDS.length > 0 || VIBRA_SENSOR_IDS.length > 0;

const tempSensors = usingSensorMode
  ? (TEMP_SENSOR_IDS.length > 0 ? TEMP_SENSOR_IDS : LEGACY_DEVICE_IDS).map((sensorId, index) => (
      buildSensorState(sensorId, 'temperatura', index)
    ))
  : LEGACY_DEVICE_IDS.map((maquinaId, index) => ({
      maquinaId,
      sensorId: maquinaId * 2 - 1,
      tipo: 'temperatura',
      base: TEMP_BASE + rand(-TEMP_BASE_JITTER, TEMP_BASE_JITTER),
      offset: 0,
      phase: rand(0, Math.PI * 2),
      spikeUntil: 0,
      spikeValue: 0,
      index,
    }));

const vibraSensors = usingSensorMode
  ? (VIBRA_SENSOR_IDS.length > 0 ? VIBRA_SENSOR_IDS : LEGACY_DEVICE_IDS).map((sensorId, index) => (
      buildSensorState(sensorId, 'vibracao', index)
    ))
  : LEGACY_DEVICE_IDS.map((maquinaId, index) => ({
      maquinaId,
      sensorId: maquinaId * 2,
      tipo: 'vibracao',
      base: VIBRA_BASE + rand(-VIBRA_BASE_JITTER, VIBRA_BASE_JITTER),
      offset: 0,
      phase: rand(0, Math.PI * 2),
      spikeUntil: 0,
      spikeValue: 0,
      index,
    }));

if (usingSensorMode) {
  console.log('[SIM] Modo sensor ativo. Temperatura:', tempSensors.map((sensor) => sensor.sensorId).join(', ') || '-');
  console.log('[SIM] Modo sensor ativo. Vibracao:', vibraSensors.map((sensor) => sensor.sensorId).join(', ') || '-');
} else {
  console.log('[SIM] Modo legado ativo. Maquinas:', LEGACY_DEVICE_IDS.join(', ') || '-');
}

function startPublishing(client) {
  if (publishTimer) return;

  publishTimer = setInterval(() => {
    const now = Date.now();

    tempSensors.forEach((sensor) => {
      const temp = nextTemperatura(sensor, now);
      const topicTemp = resolveTopic(TOPIC_TEMP_TEMPLATE, sensor);

      client.publish(topicTemp, temp.toFixed(1));
      console.log(`[SIM] S${sensor.sensorId} Temp: ${temp.toFixed(1)} C`);
    });

    vibraSensors.forEach((sensor) => {
      const vibra = nextVibracao(sensor, now);
      const topicVibra = resolveTopic(TOPIC_VIBRA_TEMPLATE, sensor);

      client.publish(topicVibra, vibra.toFixed(2));
      console.log(`[SIM] S${sensor.sensorId} Vibracao: ${vibra.toFixed(2)} mm/s`);
    });
  }, INTERVAL_MS);
}

function stopPublishing() {
  if (publishTimer) {
    clearInterval(publishTimer);
    publishTimer = null;
  }
}

const client = mqtt.connect(BROKER_URL, {
  port: PORT,
  clientId: CLIENT_ID,
  clean: true,
  reconnectPeriod: 3000,
  connectTimeout: 10000,
  keepalive: 60,
});

client.on('connect', () => {
  console.log(`[SIM] Conectado ao broker: ${BROKER_URL}:${PORT}`);
  startPublishing(client);
});

client.on('reconnect', () => {
  console.log('[SIM] Reconectando ao broker...');
});

client.on('offline', () => {
  console.log('[SIM] Offline. Aguardando reconexao...');
  stopPublishing();
});

client.on('error', (err) => {
  console.error('[SIM] Erro MQTT:', err.message);
});

process.on('SIGINT', () => {
  console.log('\n[SIM] Encerrando simulador...');
  stopPublishing();
  client.end(true, () => process.exit(0));
});
