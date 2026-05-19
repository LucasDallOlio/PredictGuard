import ServicoModel from '../models/ServicoModel.js';

class ServicoController {

    static async resumoStatus(req, res) {
        try {
            const resumo = await ServicoModel.ResumoStatus();

            res.status(200).json({
                sucesso: true,
                dados: resumo
            });
        }
        catch (error) {
            console.error('Erro ao buscar resumo de status dos servicos:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel buscar o resumo de status dos servicos'
            });
        }
    }

    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;
            const filtroBruto = {
                tipo: req.query.tipo,
                servico_status: req.query.servico_status
            };

            const filtro = Object.fromEntries(
                Object.entries(filtroBruto).filter(([_, valor]) => {
                    return valor !== undefined && valor !== null && String(valor).trim() !== '';
                })
            );

            if (filtro.tipo) {
                const tipoNormalizado = String(filtro.tipo).trim().toLowerCase();
                const tiposValidos = [
                    'manutencao_preditiva',
                    'manutencao_preventiva',
                    'manutencao_corretiva',
                    'analise_de_falha'
                ];

                if (!tiposValidos.includes(tipoNormalizado)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Filtro inválido',
                        mensagem: "O filtro 'tipo' deve ser 'manutencao_preditiva', 'manutencao_preventiva', 'manutencao_corretiva' ou 'analise_de_falha'"
                    });
                }

                filtro.tipo = tipoNormalizado;
            }

            if (filtro.servico_status) {
                const statusNormalizado = String(filtro.servico_status).trim().toLowerCase();
                const statusValidos = ['solicitado', 'em_andamento', 'concluido', 'cancelado'];

                if (!statusValidos.includes(statusNormalizado)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Filtro inválido',
                        mensagem: "O filtro 'servico_status' deve ser 'solicitado', 'em_andamento', 'concluido' ou 'cancelado'"
                    });
                }

                filtro.servico_status = statusNormalizado;
            }

            const resultado = await ServicoModel.listarTodos(pagina, limite, filtro);

            res.status(200).json({
                sucesso: true,
                dados: resultado.servicos,
                paginacao: {
                    pagina: resultado.page,
                    limite: resultado.limit,
                    total: resultado.total,
                    totalPaginas: resultado.totalPages
                }
            });
        }
        catch (error) {
            console.error('Erro ao listar servicos:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os servicos'
            });
        }
    }

    static async buscarPorID(req, res) {
        try {
            const { id } = req.params

            const servico = await ServicoModel.buscarPorID(id);

            if (!servico) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Serviço não encontrado',
                    mensagem: `Servico com ID ${id} não foi encontrado`
                });
            }

            res.status(200).json({
                sucesso: true,
                dados: servico
            });
        }
        catch (error) {
            console.error('Erro ao buscar servico:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o servico'
            });
        }
    }

    static async criar(req, res) {
        try {
            const servico = req.body;
            const usuario_solicitante_id = Number(req.usuario?.id);

            const servicoComSolicitante = { ...servico, usuario_solicitante_id }

            const resultado = await ServicoModel.criar(servicoComSolicitante);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Serviço criado com sucesso',
                dados: {
                    id: resultado.insertId,
                }
            });
        }
        catch (error) {
            console.error('Erro ao criar servico:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o servico'
            });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosServico = req.body;

            // ✅ NORMALIZA O STATUS ANTES DE SALVAR
            if (dadosServico.servico_status) {
                const statusMap = {
                    'em andamento': 'em_andamento',
                    'solicitado': 'solicitado',
                    'concluido': 'concluido',
                    'concluído': 'concluido',
                    'cancelado': 'cancelado',
                    'em_andamento': 'em_andamento',
                };
                const statusNormalizado = dadosServico.servico_status
                    .trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                const statusValidos = ['solicitado', 'em_andamento', 'concluido', 'cancelado'];
                const statusFinal = statusMap[dadosServico.servico_status.trim().toLowerCase()]
                    || statusNormalizado;

                if (!statusValidos.includes(statusFinal)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Status inválido',
                        mensagem: `Status deve ser: solicitado, em_andamento, concluido ou cancelado`
                    });
                }

                dadosServico.servico_status = statusFinal;
            }

            const servicoExistente = await ServicoModel.buscarPorID(id);

            if (!servicoExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Serviço não encontrado',
                    mensagem: `Serviço com ID ${id} não foi encontrado`
                });
            }

            const affectedRows = await ServicoModel.atualizar(id, dadosServico);

            if (affectedRows === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Serviço não encontrado',
                    mensagem: `Serviço com ID ${id} não foi encontrado`
                });
            }

            res.status(200).json({
                sucesso: true,
                mensagem: 'Serviço atualizado com sucesso',
                dados: { linhasAfetadas: affectedRows }
            });
        }
        catch (error) {
            console.error('Erro ao atualizar servico:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possivel atualizar o servico'
            });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;

            const servicoExistente = await ServicoModel.buscarPorID(id);

            if (!servicoExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Servico não encontrado',
                    mensagem: `Servico com ID ${id} não foi encontrado`
                });
            }

            const affectedRows = await ServicoModel.excluir(id);

            if (affectedRows === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Servico não encontrado',
                    mensagem: `Servico com ID ${id} não foi encontrado`
                });
            }

            res.status(200).json({
                sucesso: true,
                mensagem: 'Servico excluido com sucesso',
                dados: {
                    linhasAfetadas: affectedRows
                }
            });
        }
        catch (error) {
            console.error('Erro ao excluir servico:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o servico'
            });
        }
    }

}

export default ServicoController;