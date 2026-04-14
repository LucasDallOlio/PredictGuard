import { create, read, update, deleteRecord, readWithPagination } from '../config/database.js';

class MaquinaModel {

    static async buscarPorID(id) {
        try {
            const rows = await read('maquinas', `id = ${Number(id)}`);

            if (!rows[0]) return null;
            
            return rows[0];
        }
        catch (error) {
            throw new Error(`Erro ao buscar maquina por ID: ${error.message}`);
        }
    }

    static async criar(maquina) {
        try {
            return await create('maquinas', maquina);
        }
        catch (error) {
            throw new Error(`Erro ao criar maquina: ${error.message}`);
        }
    }
    
    static async atualizar(id, dadosMaquina) {
        try {
            return await update('maquinas', dadosMaquina, 'id = ?', [id])
        }
        catch (error) {
            throw new Error(`Erro ao atualizar Maquina: ${error.message}`);
        }
    }

    static async excluir(id) {
        try {
            return await deleteRecord('maquinas', 'id = ?', [id])
        }
        catch (error) {
            throw new Error(`Erro ao excluir maquina: ${error.message}`);
        }
    }

    static async listarTodos(page = 1, limit = 10, filtro = null) {
        try {
            let where = '';
            let whereParams = [];

            if (filtro) {
                const columns = Object.keys(filtro);
                whereParams = Object.values(filtro);

                where = `${columns.map(column => `${column} = ?`).join(', ')}`
            }
            const maquinas = await readWithPagination({
                table: 'maquinas',
                page,
                limit,
                where,
                whereParams
            })

            return {
                maquinas,
                page,
                limit
            }
        }
        catch (error) {
            throw new Error(`Erro ao buscar maquinas: ${error.message}`);
        }
    }

}

export default MaquinaModel