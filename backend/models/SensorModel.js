import { create, update, deleteRecord, getConnection } from '../config/database.js';

class SensorModel {

	static async buscarPorID(id) {
		const connection = await getConnection();

		try {
			const sql = `
				select
					s.*,
					m.nome as maquina
				from sensores s
				left join maquinas m on m.id = s.maquina_id
				where s.id = ?
			`;

			const [rows] = await connection.execute(sql, [Number(id)]);

			if (!rows[0]) return null;

			return rows[0];
		}
		catch (error) {
			throw new Error(`Erro ao buscar sensor por ID: ${error.message}`);
		}
		finally {
			connection.release();
		}
	}

	static async criar(sensor) {
		try {
			return await create('sensores', sensor);
		}
		catch (error) {
			throw new Error(`Erro ao criar sensor: ${error.message}`);
		}
	}

	static async atualizar(id, dadosSensor) {
		try {
			return await update('sensores', dadosSensor, 'id = ?', [id])
		}
		catch (error) {
			throw new Error(`Erro ao atualizar sensor: ${error.message}`);
		}
	}

	static async excluir(id) {
		try {
			return await deleteRecord('sensores', 'id = ?', [id])
		}
		catch (error) {
			throw new Error(`Erro ao excluir sensor: ${error.message}`);
		}
	}

	static async listarTodos(page = 1, limit = 10, filtro = null) {
		const connection = await getConnection();

		try {
			let whereSQL = '';
			let whereParams = [];

			if (filtro) {
				const columns = Object.keys(filtro);

				if (columns.length > 0) {
					whereParams = Object.values(filtro);
					whereSQL = `where ${columns.map(column => `s.${column} = ?`).join(' AND ')}`;
				}
			}

			const offset = (page - 1) * limit;

			const sql = `
				select
					s.*,
					m.nome as maquina
				from sensores s
				left join maquinas m on m.id = s.maquina_id
				${whereSQL}
				order by s.id asc
				limit ${limit} offset ${offset}
			`;

			const [sensores] = await connection.execute(sql, [
				...whereParams
			]);

			const countSql = `select count(*) as count from sensores s ${whereSQL}`;
			const [totalRows] = await connection.execute(countSql, whereParams);
			const total = Number(totalRows?.[0]?.count ?? 0);

			return {
				sensores,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		}
		catch (error) {
			throw new Error(`Erro ao buscar sensores: ${error.message}`);
		}
		finally {
			connection.release();
		}
	}

}

export default SensorModel;
