import { create, getConnection } from '../config/database.js';
import { normalizeDateTime } from '../utils/normalizeDateTime.js';

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
            const whereParts = [];
            const whereParams = [];
            const bucketMinutos = filtro?.bucket_minutos ?? filtro?.bucketMinutos;
            const agregacao = filtro?.agregacao;

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

            if (bucketMinutos) {
                const bucketSegundos = Number(bucketMinutos) * 60;
                const bucketExpr = 'from_unixtime(floor(unix_timestamp(l.data_leitura) / ?) * ?)';
                const baseSql = `
                    select
                        l.sensor_id as sensor_id,
                        l.unidade as unidade,
                        s.tipo as tipo_sensor,
                        s.maquina_id as maquina_id,
                        l.valor as valor,
                        ${bucketExpr} as bucket_data
                    from leituras l
                    inner join sensores s on s.id = l.sensor_id
                    ${whereSQL}
                `;

                const sql = `
                    select
                        t.bucket_data as data_leitura,
                        min(t.sensor_id) as sensor_id,
                        min(t.unidade) as unidade,
                        t.tipo_sensor as tipo_sensor,
                        t.maquina_id as maquina_id,
                        avg(t.valor) as valor_media,
                        min(t.valor) as valor_min,
                        max(t.valor) as valor_max
                    from (
                        ${baseSql}
                    ) as t
                    group by t.bucket_data, t.tipo_sensor, t.maquina_id
                    order by t.bucket_data ${ordem}
                    limit ${limit}
                `;

                const [leituras] = await connection.execute(
                    sql,
                    [bucketSegundos, bucketSegundos, ...whereParams]
                );

                const countSql = `
                    select count(*) as count
                    from (
                        select 1
                        from (
                            ${baseSql}
                        ) as t
                        group by t.bucket_data, t.tipo_sensor, t.maquina_id
                    ) as totalizador
                `;
                const [totalRows] = await connection.execute(
                    countSql,
                    [bucketSegundos, bucketSegundos, ...whereParams]
                );
                const total = Number(totalRows?.[0]?.count ?? 0);

                const leiturasNormalizadas = leituras.map((leitura) => {
                    const valorMedia = Number(leitura.valor_media);
                    return {
                        ...leitura,
                        valor: Number.isFinite(valorMedia) ? valorMedia : leitura.valor_media,
                        valor_min: leitura.valor_min,
                        valor_max: leitura.valor_max
                    };
                });

                if (agregacao === 'media') {
                    return {
                        leituras: leiturasNormalizadas.map((leitura) => ({
                            ...leitura,
                            valor_min: undefined,
                            valor_max: undefined
                        })),
                        total,
                        limit
                    };
                }

                return {
                    leituras: leiturasNormalizadas,
                    total,
                    limit
                };
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