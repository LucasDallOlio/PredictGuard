import { create, read, count, getConnection } from '../config/database.js';
import normalizeDateTime from '../utils/normalizeDateTime.js';

class AlertaModel {
    static async criar({ maquina_id, sensor_id = null, tipo_alerta, severidade, valor_detectado = null, limite_configurado = null, unidade = null, mensagem }) {
        return await create('alertas', {
            maquina_id,
            sensor_id,
            tipo_alerta,
            severidade,
            valor_detectado,
            limite_configurado,
            unidade,
            mensagem
        });
    }

    static async buscarPorID(id) {
        const rows = await read('alertas', `id = ${Number(id)}`);
        return rows[0] || null;
    }

    static async listarTodos(page = 1, limit = 10, filtro = null, ordem = 'asc') {
        const connection = await getConnection();

        try {
            const whereParts = [];
            const whereParams = [];

            if (filtro) {
                const maquinaId = filtro.maquina_id ?? filtro.maquinaId;
                const sensorId = filtro.sensor_id ?? filtro.sensorId;
                const tipoAlerta = filtro.tipo_alerta ?? filtro.tipoAlerta;
                const severidade = filtro.severidade;
                const dataInicio = normalizeDateTime(filtro.data_inicio ?? filtro.dataInicio);
                const dataFim = normalizeDateTime(filtro.data_fim ?? filtro.dataFim);

                if (maquinaId !== undefined && maquinaId !== null) {
                    whereParts.push('maquina_id = ?');
                    whereParams.push(maquinaId);
                }

                if (sensorId !== undefined && sensorId !== null) {
                    whereParts.push('sensor_id = ?');
                    whereParams.push(sensorId);
                }

                if (tipoAlerta) {
                    whereParts.push('tipo_alerta = ?');
                    whereParams.push(tipoAlerta);
                }

                if (severidade) {
                    whereParts.push('severidade = ?');
                    whereParams.push(severidade);
                }

                if (dataInicio && dataFim) {
                    whereParts.push('data_alerta between ? and ?');
                    whereParams.push(dataInicio, dataFim);
                } else if (dataInicio) {
                    whereParts.push('data_alerta >= ?');
                    whereParams.push(dataInicio);
                } else if (dataFim) {
                    whereParts.push('data_alerta <= ?');
                    whereParams.push(dataFim);
                }
            }

            const whereClause = whereParts.join(' AND ');
            const whereSQL = whereClause ? `where ${whereClause}` : '';

            page = Number(page);
            limit = Number(limit);

            if (!Number.isFinite(page) || page <= 0) {
                page = 1;
            }

            if (!Number.isFinite(limit) || limit <= 0) {
                limit = 10;
            }

            const offset = (page - 1) * limit;

            const ordemSql = ordem === 'desc' ? 'desc' : 'asc';

            const sql = `
                select *
                from alertas
                ${whereSQL}
                order by data_alerta ${ordemSql}
                limit ${limit} offset ${offset}
            `;

            const [alertas] = await connection.execute(sql, whereParams);

            const totalRows = await count({
                table: 'alertas',
                where: whereClause || null,
                whereParams
            });

            const total = Number(totalRows?.[0]?.count ?? 0);

            return { alertas, total, page, limit };
        }
        finally {
            connection.release();
        }
    }
}

export default AlertaModel;