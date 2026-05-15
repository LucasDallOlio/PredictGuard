import mqtt from 'mqtt';

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

const DEVICE_IDS = (process.env.SIM_DEVICE_IDS || '1')
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
    .replaceAll('{maquinaId}', String(ctx.maquinaId))
    .replaceAll('{sensorTempId}', String(ctx.sensorTempId))
    .replaceAll('{sensorVibraId}', String(ctx.sensorVibraId));
}

function buildDeviceState(maquinaId, index) {
  return {
    maquinaId,
    sensorTempId: maquinaId * 2 - 1,
    sensorVibraId: maquinaId * 2,
    tempBase: TEMP_BASE + rand(-TEMP_BASE_JITTER, TEMP_BASE_JITTER),
    vibraBase: VIBRA_BASE + rand(-VIBRA_BASE_JITTER, VIBRA_BASE_JITTER),
    tempOffset: 0,
    phaseTemp: rand(0, Math.PI * 2),
    phaseVibra: rand(0, Math.PI * 2),
    tempSpikeUntil: 0,
    tempSpikeValue: 0,
    vibraSpikeUntil: 0,
    vibraSpikeValue: 0,
    index,
  };
}

function nextTemperatura(state, now) {
  state.tempOffset += rand(-TEMP_DRIFT, TEMP_DRIFT);
  const wave = Math.sin((now - t0) / 30000 + state.phaseTemp) * 0.8;
  const noise = rand(-TEMP_NOISE, TEMP_NOISE);

  if (now >= state.tempSpikeUntil && Math.random() < TEMP_SPIKE_PROB) {
    state.tempSpikeValue = rand(1.2, TEMP_SPIKE_MAX);
    state.tempSpikeUntil = now + TEMP_SPIKE_DURATION_MS;
  }

  const spike = now < state.tempSpikeUntil ? state.tempSpikeValue : 0;
  return state.tempBase + state.tempOffset + wave + noise + spike;
}

function nextVibracao(state, now) {
  const wave = Math.sin((now - t0) / 15000 + state.phaseVibra) * 0.4;
  const noise = rand(-VIBRA_NOISE, VIBRA_NOISE);

  if (now >= state.vibraSpikeUntil && Math.random() < VIBRA_SPIKE_PROB) {
    state.vibraSpikeValue = rand(0.8, VIBRA_SPIKE_MAX);
    state.vibraSpikeUntil = now + VIBRA_SPIKE_DURATION_MS;
  }

  const spike = now < state.vibraSpikeUntil ? state.vibraSpikeValue : 0;
  return Math.max(0, state.vibraBase + wave + noise + spike);
}

const devices = DEVICE_IDS.map((id, index) => buildDeviceState(id, index));

function startPublishing(client) {
  if (publishTimer) return;

  publishTimer = setInterval(() => {
    const now = Date.now();

    devices.forEach((device) => {
      const temp = nextTemperatura(device, now);
      const vibra = nextVibracao(device, now);
      const topicTemp = resolveTopic(TOPIC_TEMP_TEMPLATE, device);
      const topicVibra = resolveTopic(TOPIC_VIBRA_TEMPLATE, device);

      client.publish(topicTemp, temp.toFixed(1));
      client.publish(topicVibra, vibra.toFixed(2));

      console.log(
        `[SIM] M${device.maquinaId} Temp: ${temp.toFixed(1)} C | ` +
        `Vibracao: ${vibra.toFixed(2)} mm/s`
      );
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
