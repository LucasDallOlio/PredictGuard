import LeituraModel from '../models/LeituraModel.js';

class LeituraController {

    static async listarSerie(req, res) {
        try {
            let limite = parseInt(req.query.limite, 10);

            if (Number.isNaN(limite) || limite <= 0) {
                limite = 500;
            }

            limite = Math.min(limite, 2000);

            const ordemBruta = String(req.query.ordem || 'asc').trim().toLowerCase();
            const ordem = ordemBruta === 'desc' ? 'desc' : 'asc';

            const filtroBruto = {
                sensor_id: req.query.sensor_id,
                maquina_id: req.query.maquina_id,
                tipo: req.query.tipo,
                data_inicio: req.query.data_inicio,
                data_fim: req.query.data_fim,
                periodo_horas: req.query.periodo_horas,
                periodo_dias: req.query.periodo_dias
            };

            const filtro = Object.fromEntries(
                Object.entries(filtroBruto).filter(([_, valor]) => {
                    return valor !== undefined && valor !== null && String(valor).trim() !== '';
                })
            );

            if (filtro.sensor_id !== undefined) {
                const sensorIdNormalizado = Number(filtro.sensor_id);

                if (Number.isNaN(sensorIdNormalizado) || sensorIdNormalizado <= 0) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Filtro inválido',
                        mensagem: "O filtro 'sensor_id' deve ser um número válido"
                    });
                }

                filtro.sensor_id = sensorIdNormalizado;
            }

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

            let dataInicio = filtro.data_inicio || null;
            let dataFim = filtro.data_fim || null;

            if (!dataInicio && !dataFim) {
                if (filtro.periodo_horas) {
                    const horas = Number(filtro.periodo_horas);

                    if (Number.isNaN(horas) || horas <= 0) {
                        return res.status(400).json({
                            sucesso: false,
                            erro: 'Filtro inválido',
                            mensagem: "O filtro 'periodo_horas' deve ser um número válido"
                        });
                    }

                    dataFim = new Date();
                    dataInicio = new Date(Date.now() - horas * 60 * 60 * 1000);
                }

                if (filtro.periodo_dias) {
                    const dias = Number(filtro.periodo_dias);

                    if (Number.isNaN(dias) || dias <= 0) {
                        return res.status(400).json({
                            sucesso: false,
                            erro: 'Filtro inválido',
                            mensagem: "O filtro 'periodo_dias' deve ser um número válido"
                        });
                    }

                    dataFim = new Date();
                    dataInicio = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
                }
            }

            const leituras = await LeituraModel.listarSerie(
                {
                    sensorId: filtro.sensor_id,
                    maquinaId: filtro.maquina_id,
                    tipo: filtro.tipo,
                    dataInicio,
                    dataFim
                },
                limite,
                ordem
            );

            res.status(200).json({
                sucesso: true,
                dados: leituras
            });
        }
        catch (error) {
            console.error('Erro ao listar leituras:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel listar as leituras'
            });
        }
    }
}

export default LeituraController;
