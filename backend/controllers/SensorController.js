import SensorModel from '../models/SensorModel.js';

class SensorController {

	static async listarTodos(req, res) {
		try {
			let pagina = parseInt(req.query.pagina) || 1;
			let limite = parseInt(req.query.limite) || 10;
			const filtroBruto = {
				maquina_id: req.query.maquina_id,
				tipo: req.query.tipo
			};

			const filtro = Object.fromEntries(
				Object.entries(filtroBruto).filter(([_, valor]) => {
					return valor !== undefined && valor !== null && String(valor).trim() !== '';
				})
			);

			if (filtro.maquina_id !== undefined) {
				const maquinaIdNormalizado = Number(filtro.maquina_id);

				if (Number.isNaN(maquinaIdNormalizado) || maquinaIdNormalizado <= 0) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Filtro inválido',
						mensagem: "O filtro 'maquina_id' deve ser um número válido"
					});
				}

				filtro.maquina_id = maquinaIdNormalizado;
			}

			if (filtro.tipo) {
				const tipoNormalizado = String(filtro.tipo).trim().toLowerCase();
				const tiposValidos = ['temperatura', 'acelerometro'];

				if (!tiposValidos.includes(tipoNormalizado)) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Filtro inválido',
						mensagem: "O filtro 'tipo' deve ser 'temperatura' ou 'acelerometro'"
					});
				}

				filtro.tipo = tipoNormalizado;
			}

			const resultado = await SensorModel.listarTodos(pagina, limite, filtro);

			res.status(200).json({
				sucesso: true,
				dados: resultado.sensores,
				paginacao: {
					pagina: resultado.page,
					limite: resultado.limit,
					total: resultado.total,
					totalPaginas: resultado.totalPages
				}
			});
		}
		catch (error) {
			console.error('Erro ao listar sensores:', error)
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Não foi possível listar os sensores'
			});
		}
	}

	static async buscarPorID(req, res) {
		try {
			const { id } = req.params

			const sensor = await SensorModel.buscarPorID(id);

			if (!sensor) {
				return res.status(404).json({
					sucesso: false,
					erro: 'Sensor não encontrado',
					mensagem: `Sensor com ID ${id} não foi encontrado`
				});
			}

			res.status(200).json({
				sucesso: true,
				dados: sensor
			});
		}
		catch (error) {
			console.error('Erro ao buscar sensor:', error)
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Não foi possível buscar o sensor'
			});
		}
	}

	static async criar(req, res) {
		try {
			const sensor = req.body;

			if (!sensor?.modelo || String(sensor.modelo).trim() === '') {
				return res.status(400).json({
					sucesso: false,
					erro: 'Dados inválidos',
					mensagem: 'O campo modelo é obrigatório'
				});
			}

			if (!sensor?.tipo || String(sensor.tipo).trim() === '') {
				return res.status(400).json({
					sucesso: false,
					erro: 'Dados inválidos',
					mensagem: 'O campo tipo é obrigatório'
				});
			}

			const tipoNormalizado = String(sensor.tipo).trim().toLowerCase();
			const tiposValidos = ['temperatura', 'acelerometro'];

			if (!tiposValidos.includes(tipoNormalizado)) {
				return res.status(400).json({
					sucesso: false,
					erro: 'Dados inválidos',
					mensagem: "O campo 'tipo' deve ser 'temperatura' ou 'acelerometro'"
				});
			}

			sensor.tipo = tipoNormalizado;

			if (sensor.maquina_id !== undefined && sensor.maquina_id !== null && String(sensor.maquina_id).trim() !== '') {
				const maquinaIdNormalizado = Number(sensor.maquina_id);

				if (Number.isNaN(maquinaIdNormalizado) || maquinaIdNormalizado <= 0) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Dados inválidos',
						mensagem: "O campo 'maquina_id' deve ser um número válido"
					});
				}

				sensor.maquina_id = maquinaIdNormalizado;
			} else {
				sensor.maquina_id = null;
			}

			const resultado = await SensorModel.criar(sensor);

			res.status(201).json({
				sucesso: true,
				mensagem: 'Sensor criado com sucesso',
				dados: {
					id: resultado.insertId,
				}
			});
		}
		catch (error) {
			console.error('Erro ao criar sensor:', error);
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Não foi possível criar o sensor'
			});
		}
	}

	static async atualizar(req, res) {
		try {
			const { id } = req.params;
			const dadosSensor = req.body;

			const sensorExistente = await SensorModel.buscarPorID(id);

			if (!sensorExistente) {
				return res.status(404).json({
					sucesso: false,
					erro: 'Sensor não encontrado',
					mensagem: `Sensor com ID ${id} não foi encontrado`
				});
			}

			if (dadosSensor?.tipo !== undefined) {
				const tipoNormalizado = String(dadosSensor.tipo).trim().toLowerCase();
				const tiposValidos = ['temperatura', 'acelerometro'];

				if (!tiposValidos.includes(tipoNormalizado)) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Dados inválidos',
						mensagem: "O campo 'tipo' deve ser 'temperatura' ou 'acelerometro'"
					});
				}

				dadosSensor.tipo = tipoNormalizado;
			}

			if (dadosSensor?.maquina_id !== undefined) {
				if (dadosSensor.maquina_id === null || String(dadosSensor.maquina_id).trim() === '') {
					dadosSensor.maquina_id = null;
				} else {
					const maquinaIdNormalizado = Number(dadosSensor.maquina_id);

					if (Number.isNaN(maquinaIdNormalizado) || maquinaIdNormalizado <= 0) {
						return res.status(400).json({
							sucesso: false,
							erro: 'Dados inválidos',
							mensagem: "O campo 'maquina_id' deve ser um número válido"
						});
					}

					dadosSensor.maquina_id = maquinaIdNormalizado;
				}
			}

			const affectedRows = await SensorModel.atualizar(id, dadosSensor)

			if (affectedRows === 0) {
				return res.status(404).json({
					sucesso: false,
					erro: 'Sensor não encontrado',
					mensagem: `Sensor com ID ${id} não foi encontrado`
				});
			}

			res.status(200).json({
				sucesso: true,
				mensagem: 'Sensor atualizado com sucesso',
				dados: {
					linhasAfetadas: affectedRows
				}
			});
		}
		catch (error) {
			console.error('Erro ao atualizar sensor:', error);
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Não foi possivel atualizar o sensor'
			});
		}
	}

	static async excluir(req, res) {
		try {
			const { id } = req.params;

			const sensorExistente = await SensorModel.buscarPorID(id);

			if (!sensorExistente) {
				return res.status(404).json({
					sucesso: false,
					erro: 'Sensor não encontrado',
					mensagem: `Sensor com ID ${id} não foi encontrado`
				});
			}

			const affectedRows = await SensorModel.excluir(id);

			if (affectedRows === 0) {
				return res.status(404).json({
					sucesso: false,
					erro: 'Sensor não encontrado',
					mensagem: `Sensor com ID ${id} não foi encontrado`
				});
			}

			res.status(200).json({
				sucesso: true,
				mensagem: 'Sensor excluido com sucesso',
				dados: {
					linhasAfetadas: affectedRows
				}
			});
		}
		catch (error) {
			console.error('Erro ao excluir sensor:', error);
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Não foi possível excluir o sensor'
			});
		}
	}

}

export default SensorController;
