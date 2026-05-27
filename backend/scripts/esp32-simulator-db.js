import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConnection } from '../config/database.js';
import LeituraModel from '../models/LeituraModel.js';
import AlertaModel from '../models/AlertaModel.js';
import MaquinaModel from '../models/MaquinaModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env.simulator ou .env como fallback
dotenv.config({ path: path.join(__dirname, '..', '.env.simulator') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const INTERVAL_MS = parseInt(process.env.SIM_DB_INTERVAL_MS || process.env.MQTT_PUBLISH_INTERVAL_MS || '1000', 10);

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

const TEMP_LIMITE = parseFloat(process.env.MQTT_TEMP_LIMITE) || 85.0;
const VIBRA_LIMITE = parseFloat(process.env.MQTT_VIBRA_LIMITE) || 7.1;

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

const MAQUINA_IDS = (process.env.SIM_DEVICE_IDS || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean)
  .map((v) => parseInt(v, 10))
  .filter((v) => Number.isFinite(v));

let publishTimer = null;
let t0 = Date.now();
let isTicking = false;
const maquinaLimitesCache = new Map();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function buildSensorState(sensor, index) {
  const isTemperatura = sensor.tipo === 'temperatura';

  return {
    sensorId: sensor.id,
    maquinaId: sensor.maquina_id,
    tipo: sensor.tipo,
    base: isTemperatura
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

function describeMode(tempIds, vibraIds, maquinaIds) {
  if (tempIds.length > 0 || vibraIds.length > 0) {
    console.log('[SIM-DB] Modo sensor ativo. Temperatura:', tempIds.join(', ') || '-');
    console.log('[SIM-DB] Modo sensor ativo. Vibracao:', vibraIds.join(', ') || '-');
    return;
  }

  if (maquinaIds.length > 0) {
    console.log('[SIM-DB] Modo maquina ativo. Maquinas:', maquinaIds.join(', ') || '-');
    return;
  }

  console.log('[SIM-DB] Modo geral ativo. Todos os sensores de temperatura e acelerometro.');
}

async function carregarSensores() {
  const connection = await getConnection();

  try {
    const whereParts = ["tipo in ('temperatura', 'acelerometro')"];
    const params = [];

    if (TEMP_SENSOR_IDS.length > 0 || VIBRA_SENSOR_IDS.length > 0) {
      const allIds = [...new Set([...TEMP_SENSOR_IDS, ...VIBRA_SENSOR_IDS])];
      const placeholders = allIds.map(() => '?').join(', ');
      whereParts.push(`id in (${placeholders})`);
      params.push(...allIds);
    } else if (MAQUINA_IDS.length > 0) {
      const placeholders = MAQUINA_IDS.map(() => '?').join(', ');
      whereParts.push(`maquina_id in (${placeholders})`);
      params.push(...MAQUINA_IDS);
    }

    const sql = `select id, maquina_id, tipo from sensores where ${whereParts.join(' and ')}`;
    const [rows] = await connection.execute(sql, params);

    return rows.map((row) => ({
      id: Number(row.id),
      maquina_id: Number(row.maquina_id),
      tipo: row.tipo,
    }));
  } finally {
    connection.release();
  }
}

function filtrarSensores(sensores, tipo, ids) {
  return sensores.filter((sensor) => {
    if (sensor.tipo !== tipo) return false;
    if (ids.length === 0) return true;
    return ids.includes(sensor.id);
  });
}

async function obterLimitesMaquina(maquinaId) {
  if (!maquinaId) return null;

  if (maquinaLimitesCache.has(maquinaId)) {
    return maquinaLimitesCache.get(maquinaId);
  }

  const connection = await getConnection();

  try {
    const sql = 'select temperatura_limite_c, aceleracao_limite_mms from maquinas where id = ? limit 1';
    const [rows] = await connection.execute(sql, [maquinaId]);
    const row = rows[0];

    if (!row) return null;

    const limites = {
      temperatura_limite_c: row.temperatura_limite_c !== undefined ? Number(row.temperatura_limite_c) : null,
      aceleracao_limite_mms: row.aceleracao_limite_mms !== undefined ? Number(row.aceleracao_limite_mms) : null,
    };

    maquinaLimitesCache.set(maquinaId, limites);
    return limites;
  } finally {
    connection.release();
  }
}

async function iniciarSimulacao() {
  describeMode(TEMP_SENSOR_IDS, VIBRA_SENSOR_IDS, MAQUINA_IDS);

  const sensores = await carregarSensores();
  const tempSelecionados = filtrarSensores(sensores, 'temperatura', TEMP_SENSOR_IDS);
  const vibraSelecionados = filtrarSensores(sensores, 'acelerometro', VIBRA_SENSOR_IDS);

  if (sensores.length === 0) {
    console.warn('[SIM-DB] Nenhum sensor encontrado para simulação.');
    process.exit(1);
  }

  if (tempSelecionados.length === 0) {
    console.warn('[SIM-DB] Nenhum sensor de temperatura selecionado.');
  }

  if (vibraSelecionados.length === 0) {
    console.warn('[SIM-DB] Nenhum sensor de acelerometro selecionado.');
  }

  const tempSensors = tempSelecionados.map(buildSensorState);
  const vibraSensors = vibraSelecionados.map(buildSensorState);

  console.log(`[SIM-DB] Sensores ativos: ${tempSensors.length} temperatura, ${vibraSensors.length} acelerometro.`);

  startPublishing({ tempSensors, vibraSensors });
}

function startPublishing({ tempSensors, vibraSensors }) {
  if (publishTimer) return;

  publishTimer = setInterval(() => {
    if (isTicking) return;

    isTicking = true;

    Promise.resolve()
      .then(async () => {
        const now = Date.now();

        for (const sensor of tempSensors) {
          const temp = nextTemperatura(sensor, now);
          await LeituraModel.registrar({
            sensor_id: sensor.sensorId,
            valor: Number(temp.toFixed(1)),
            unidade: 'celsius',
          });
          console.log(`[SIM-DB] S${sensor.sensorId} Temp: ${temp.toFixed(1)} C`);

          const limites = await obterLimitesMaquina(sensor.maquinaId);
          const limiteUsado = (limites && limites.temperatura_limite_c) != null
            ? limites.temperatura_limite_c
            : TEMP_LIMITE;

          if (temp >= limiteUsado) {
            await AlertaModel.criar({
              maquina_id: sensor.maquinaId,
              sensor_id: sensor.sensorId,
              tipo_alerta: 'temperatura',
              severidade: temp >= limiteUsado * 1.1 ? 'critica' : 'alta',
              valor_detectado: Number(temp.toFixed(1)),
              limite_configurado: limiteUsado,
              unidade: 'celsius',
              mensagem: `Temperatura ${temp.toFixed(1)}°C acima do limite de ${limiteUsado}°C na máquina ${sensor.maquinaId}.`,
            });

            await MaquinaModel.atualizar(sensor.maquinaId, {
              status_saude: 'alerta',
            });

            console.warn(`[SIM-DB] ⚠️  Alerta de temperatura: M${sensor.maquinaId} S${sensor.sensorId} ${temp.toFixed(1)}°C (limite: ${limiteUsado}°C)`);
          }
        }

        for (const sensor of vibraSensors) {
          const vibra = nextVibracao(sensor, now);
          await LeituraModel.registrar({
            sensor_id: sensor.sensorId,
            valor: Number(vibra.toFixed(2)),
            unidade: 'mm/s',
          });
          console.log(`[SIM-DB] S${sensor.sensorId} Vibracao: ${vibra.toFixed(2)} mm/s`);

          const limites = await obterLimitesMaquina(sensor.maquinaId);
          const limiteUsado = (limites && limites.aceleracao_limite_mms) != null
            ? limites.aceleracao_limite_mms
            : VIBRA_LIMITE;

          if (vibra >= limiteUsado) {
            await AlertaModel.criar({
              maquina_id: sensor.maquinaId,
              sensor_id: sensor.sensorId,
              tipo_alerta: 'vibracao',
              severidade: vibra >= limiteUsado * 1.1 ? 'critica' : 'alta',
              valor_detectado: Number(vibra.toFixed(2)),
              limite_configurado: limiteUsado,
              unidade: 'mm/s',
              mensagem: `Vibração ${vibra.toFixed(2)} mm/s acima do limite de ${limiteUsado} mm/s na máquina ${sensor.maquinaId}.`,
            });

            await MaquinaModel.atualizar(sensor.maquinaId, {
              status_saude: 'alerta',
            });

            console.warn(`[SIM-DB] ⚠️  Alerta de vibração: M${sensor.maquinaId} S${sensor.sensorId} ${vibra.toFixed(2)} mm/s (limite: ${limiteUsado} mm/s)`);
          }
        }
      })
      .catch((error) => {
        console.error('[SIM-DB] Erro ao salvar leituras:', error.message);
      })
      .finally(() => {
        isTicking = false;
      });
  }, INTERVAL_MS);
}

function stopPublishing() {
  if (publishTimer) {
    clearInterval(publishTimer);
    publishTimer = null;
  }
}

process.on('SIGINT', () => {
  console.log('\n[SIM-DB] Encerrando simulador...');
  stopPublishing();
  process.exit(0);
});

iniciarSimulacao().catch((error) => {
  console.error('[SIM-DB] Falha ao iniciar simulador:', error.message);
  process.exit(1);
});
