import { create, read, update, readWithPagination, count } from '../config/database.js';

class ServicoModel {

    static async buscarPorID(id) {
        try {
            const rows = await read('servicos', `id = ${Number(id)}`);

            if (!rows[0]) return null;
            
            return rows[0];
        }
        catch (error) {
            throw new Error(`Erro ao buscar servico por ID: ${error.message}`);
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
        try {
            let where = '';
            let whereParams = [];

            if (filtro) {
                const columns = Object.keys(filtro);
                whereParams = Object.values(filtro);

                where = `${columns.map(column => `${column} = ?`).join(' AND ')}`
            }
            const servicos = await readWithPagination({
                table: 'servicos',
                page,
                limit,
                where,
                whereParams
            })
            
            const [total] = await count({
                table: 'servicos',
                where,
                whereParams
            });

            return {
                servicos,
                total: total.count,
                page,
                limit,
                totalPages: Math.ceil(total.count / limit)
            }
        }
        catch (error) {
            throw new Error(`Erro ao buscar servicos: ${error.message}`);
        }
    }

}

export default ServicoModel