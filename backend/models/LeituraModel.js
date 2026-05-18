import { create, getConnection } from '../config/database.js';

class LeituraModel {
    static async registrar({ sensor_id, valor, unidade }) {
        return await create('leituras', {
            sensor_id,
            valor,
            unidade
        });
    }


    static async listarSerie(filtro = null, limit = 500, ordem = 'asc') {
        const connection = await getConnection();

        try {
            const normalizeDateTime = (value) => {
                if (!value) return value;

                if (value instanceof Date && Number.isFinite(value.getTime())) {
                    const pad = (n) => String(n).padStart(2, '0');
                    const year = value.getFullYear();
                    const month = pad(value.getMonth() + 1);
                    const day = pad(value.getDate());
                    const hour = pad(value.getHours());
                    const minute = pad(value.getMinutes());
                    const second = pad(value.getSeconds());
                    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                }

                return value;
            };

            const whereParts = [];
            const whereParams = [];

            if (filtro) {
                const sensorId = filtro.sensor_id ?? filtro.sensorId;
                const maquinaId = filtro.maquina_id ?? filtro.maquinaId;
                const tipo = filtro.tipo;
                const dataInicio = normalizeDateTime(filtro.data_inicio ?? filtro.dataInicio);
                const dataFim = normalizeDateTime(filtro.data_fim ?? filtro.dataFim);

                if (sensorId !== undefined && sensorId !== null) {
                    whereParts.push('l.sensor_id = ?');
                    whereParams.push(sensorId);
                }

                if (maquinaId !== undefined && maquinaId !== null) {
                    whereParts.push('s.maquina_id = ?');
                    whereParams.push(maquinaId);
                }

                if (tipo) {
                    whereParts.push('s.tipo = ?');
                    whereParams.push(tipo);
                }

                if (dataInicio && dataFim) {
                    whereParts.push('l.data_leitura between ? and ?');
                    whereParams.push(dataInicio, dataFim);
                } else if (dataInicio) {
                    whereParts.push('l.data_leitura >= ?');
                    whereParams.push(dataInicio);
                } else if (dataFim) {
                    whereParts.push('l.data_leitura <= ?');
                    whereParams.push(dataFim);
                }
            }

            const whereSQL = whereParts.length > 0 ? `where ${whereParts.join(' AND ')}` : '';

            limit = Number(limit);
            if (!Number.isFinite(limit) || limit <= 0) {
                limit = 500;
            }

            const sql = `
                select
                    l.id as id,
                    l.sensor_id as sensor_id,
                    l.valor as valor,
                    l.unidade as unidade,
                    l.data_leitura as data_leitura,
                    s.tipo as tipo_sensor,
                    maquina_id
                from leituras l
                inner join sensores s on s.id = l.sensor_id
                ${whereSQL}
                order by l.data_leitura ${ordem}
                limit ${limit}
            `;

            const [leituras] = await connection.execute(sql, whereParams);

            const countSql = `
                select count(*) as count
                from leituras l
                inner join sensores s on s.id = l.sensor_id
                ${whereSQL}
            `;
            const [totalRows] = await connection.execute(countSql, whereParams);

            const total = Number(totalRows?.[0]?.count ?? 0);

            return {
                leituras,
                total,
                limit
            }
        }
        catch (error) {
            throw new Error(`Erro ao buscar leituras: ${error.message}`);
        }
        finally {
            connection.release();
        }
    }

}

export default LeituraModel;