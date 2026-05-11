import { create, update, getConnection } from '../config/database.js';

class ServicoModel {

    static async buscarPorID(id) {
        const connection = await getConnection();

        try {
            const sql = `
                select
                    s.*,
                    m.nome as maquina,
                    u.nome as usuario_responsavel
                from servicos s
                inner join maquinas m on m.id = s.maquina_id
                inner join usuarios u on u.id = s.usuario_responsavel_id
                where s.id = ?
            `;

            const [rows] = await connection.execute(sql, [Number(id)]);

            if (!rows[0]) return null;

            return rows[0];
        }
        catch (error) {
            throw new Error(`Erro ao buscar servico por ID: ${error.message}`);
        }
        finally {
            connection.release();
        }
    }

    static async criar(servico) {
        try {
            return await create('servicos', servico);
        }
        catch (error) {
            throw new Error(`Erro ao criar servico: ${error.message}`);
        }
    }
    
    static async atualizar(id, dadosServico) {
        try {
            return await update('servicos', dadosServico, 'id = ?', [id])
        }
        catch (error) {
            throw new Error(`Erro ao atualizar Servico: ${error.message}`);
        }
    }

    static async listarTodos(page = 1, limit = 10, filtro = null) {
        const connection = await getConnection();

        try {
            let whereSQL = '';
            let whereParams = [];

            if (filtro) {
                const columns = Object.keys(filtro);
                whereParams = Object.values(filtro);
                whereSQL = `where ${columns.map(column => `s.${column} = ?`).join(' AND ')}`;
            }

            const offset = (page - 1) * limit;

            const sql = `
                select
                    s.*,
                    m.nome as maquina,
                    u.nome as usuario_responsavel
                from servicos s
                inner join maquinas m on m.id = s.maquina_id
                inner join usuarios u on u.id = s.usuario_responsavel_id
                ${whereSQL}
                order by s.id asc
                limit ? offset ?
            `;

            const [servicos] = await connection.execute(sql, [
                ...whereParams,
                Number(limit),
                Number(offset)
            ]);

            const countSql = `select count(*) as count from servicos s ${whereSQL}`;
            const [totalRows] = await connection.execute(countSql, whereParams);
            const total = Number(totalRows?.[0]?.count ?? 0);

            return {
                servicos,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
        catch (error) {
            throw new Error(`Erro ao buscar servicos: ${error.message}`);
        }
        finally {
            connection.release();
        }
    }

}

export default ServicoModel