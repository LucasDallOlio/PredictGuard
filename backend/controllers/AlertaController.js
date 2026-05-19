import AlertaModel from '../models/AlertaModel.js';

class AlertaController {

	static async listarTodos(req, res) {
		try {
			let pagina = parseInt(req.query.pagina, 10) || 1;
			let limite = parseInt(req.query.limite, 10) || 10;
			const ordemBruta = String(req.query.ordem || 'asc').trim().toLowerCase();
			const ordem = ordemBruta === 'desc' ? 'desc' : 'asc';

			const filtroBruto = {
				tipo_alerta: req.query.tipo_alerta,
				maquina_id: req.query.maquina_id,
				sensor_id: req.query.sensor_id,
				severidade: req.query.severidade,
				periodo_dias: req.query.periodo_dias,
				data_inicio: req.query.data_inicio,
				data_fim: req.query.data_fim
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
						erro: 'Filtro invalido',
						mensagem: "O filtro 'maquina_id' deve ser um numero valido"
					});
				}

				filtro.maquina_id = maquinaIdNormalizado;
			}

			if (filtro.sensor_id !== undefined) {
				const sensorIdNormalizado = Number(filtro.sensor_id);

				if (Number.isNaN(sensorIdNormalizado) || sensorIdNormalizado <= 0) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Filtro invalido',
						mensagem: "O filtro 'sensor_id' deve ser um numero valido"
					});
				}

				filtro.sensor_id = sensorIdNormalizado;
			}

			if (filtro.tipo_alerta) {
				const tipoNormalizado = String(filtro.tipo_alerta).trim().toLowerCase();
				const tiposValidos = ['temperatura', 'vibracao', 'tendencia', 'offline'];

				if (!tiposValidos.includes(tipoNormalizado)) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Filtro invalido',
						mensagem: "O filtro 'tipo_alerta' deve ser 'temperatura', 'vibracao', 'tendencia' ou 'offline'"
					});
				}

				filtro.tipo_alerta = tipoNormalizado;
			}

			if (filtro.severidade) {
				const severidadeNormalizada = String(filtro.severidade).trim().toLowerCase();
				const severidadesValidas = ['baixa', 'media', 'alta', 'critica'];

				if (!severidadesValidas.includes(severidadeNormalizada)) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Filtro invalido',
						mensagem: "O filtro 'severidade' deve ser 'baixa', 'media', 'alta' ou 'critica'"
					});
				}

				filtro.severidade = severidadeNormalizada;
			}

			let dataInicio = filtro.data_inicio || null;
			let dataFim = filtro.data_fim || null;

			if (!dataInicio && !dataFim && filtro.periodo_dias) {
				const dias = Number(filtro.periodo_dias);

				if (Number.isNaN(dias) || dias <= 0) {
					return res.status(400).json({
						sucesso: false,
						erro: 'Filtro invalido',
						mensagem: "O filtro 'periodo_dias' deve ser um numero valido"
					});
				}

				dataFim = new Date();
				dataInicio = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
			}

			pagina = Math.max(pagina, 1);
			limite = Math.max(limite, 1);

			const resultado = await AlertaModel.listarTodos(
				pagina,
				limite,
				{
					maquina_id: filtro.maquina_id,
					sensor_id: filtro.sensor_id,
					tipo_alerta: filtro.tipo_alerta,
					severidade: filtro.severidade,
					data_inicio: dataInicio,
					data_fim: dataFim
				},
				ordem
			);

			res.status(200).json({
				sucesso: true,
				dados: resultado.alertas,
				paginacao: {
					pagina: resultado.page,
					limite: resultado.limit,
					total: resultado.total,
					totalPaginas: Math.ceil(resultado.total / resultado.limit)
				}
			});
		}
		catch (error) {
			console.error('Erro ao listar alertas:', error)
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Nao foi possivel listar os alertas'
			});
		}
	}

	static async buscarPorID(req, res) {
		try {
			const { id } = req.params;

			const alerta = await AlertaModel.buscarPorID(id);

			if (!alerta) {
				return res.status(404).json({
					sucesso: false,
					erro: 'Alerta nao encontrado',
					mensagem: `Alerta com ID ${id} nao foi encontrado`
				});
			}

			res.status(200).json({
				sucesso: true,
				dados: alerta
			});
		}
		catch (error) {
			console.error('Erro ao buscar alerta:', error)
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Nao foi possivel buscar o alerta'
			});
		}
	}
}

export default AlertaController;
