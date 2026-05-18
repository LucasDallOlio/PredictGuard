import MaquinaModel from '../models/MaquinaModel.js';
import { invalidarLimitesMaquina } from '../services/mqttService.js';
import { deleteFile } from '../utils/file.js'

class MaquinaController {

    static async resumoStatus(req, res) {
        try {
            const resumo = await MaquinaModel.ResumoStatus();

            res.status(200).json({
                sucesso: true,
                dados: resumo
            });
        }
        catch (error) {
            console.error('Erro ao buscar resumo de status das maquinas:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel buscar o resumo de status das maquinas'
            });
        }
    }

    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;
            const filtroBruto = {
                setor: req.query.setor,
                status_operacional: req.query.status_operacional,
                status_saude: req.query.status_saude
            };

            const filtro = Object.fromEntries(
                Object.entries(filtroBruto).filter(([_, valor]) => {
                    return valor !== undefined && valor !== null && String(valor).trim() !== '';
                })
            );

            if (filtro.setor) {
                const setorNormalizado = String(filtro.setor).trim().toLowerCase();
                const setoresValidos = ['linha_1', 'linha_2', 'linha_3'];

                if (!setoresValidos.includes(setorNormalizado)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Filtro inválido',
                        mensagem: "O filtro 'setor' deve ser 'linha_1', 'linha_2' ou 'linha_3'"
                    });
                }

                filtro.setor = setorNormalizado;
            }

            if (filtro.status_operacional) {
                const statusOperacionalNormalizado = String(filtro.status_operacional).trim().toLowerCase();
                const statusOperacionalValidos = ['ativa', 'parada', 'manutencao'];

                if (!statusOperacionalValidos.includes(statusOperacionalNormalizado)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Filtro inválido',
                        mensagem: "O filtro 'status_operacional' deve ser 'ativa', 'parada' ou 'manutencao'"
                    });
                }

                filtro.status_operacional = statusOperacionalNormalizado;
            }

            if (filtro.status_saude) {
                const statusSaudeNormalizado = String(filtro.status_saude).trim().toLowerCase();
                const statusSaudeValidos = ['ok', 'alerta'];

                if (!statusSaudeValidos.includes(statusSaudeNormalizado)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Filtro inválido',
                        mensagem: "O filtro 'status_saude' deve ser 'ok' ou 'alerta'"
                    });
                }

                filtro.status_saude = statusSaudeNormalizado;
            }

            const resultado = await MaquinaModel.listarTodos(pagina, limite, filtro);

            const maquinaComImagemURL = resultado.maquinas.map(maquina => ({
                ...maquina,
                imagem: `${process.env.BASE_URL}${process.env.UPLOAD_PATH.replace(/^\.\//, '/')}/${maquina.imagem}`
            }))

            res.status(200).json({
                sucesso: true,
                dados: maquinaComImagemURL,
                paginacao: {
                    pagina: resultado.page,
                    limite: resultado.limit,
                    total: resultado.total,
                    totalPaginas: resultado.totalPages
                }
            });
        }
        catch (error) {
            console.error('Erro ao listar maquinas:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os maquinas'
            });
        }
    }

    static async buscarPorID(req, res) {
        try {
            const { id } = req.params

            const maquina = await MaquinaModel.buscarPorID(id);

            if (!maquina) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Maquina não encontrado',
                    mensagem: `Maquina com ID ${id} não foi encontrado`
                });
            }

            maquina.imagem = `${process.env.BASE_URL}${process.env.UPLOAD_PATH.replace(/^\.\//, '/')}/${maquina.imagem}`

            res.status(200).json({
                sucesso: true,
                dados: maquina
            });
        }
        catch (error) {
            console.error('Erro ao buscar maquina:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o maquina'
            });
        }
    }

    static async criar(req, res) {
        try {
            const maquina = req.body

            if (req.file) {
                maquina.imagem = req.file.filename;
            }
            const resultado = await MaquinaModel.criar(maquina);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Maquina criado com sucesso',
                dados: {
                    id: resultado.insertId,
                }
            });
        }
        catch (error) {
            console.error('Erro ao criar maquina:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o maquina'
            });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosMaquina = req.body;

            const maquinaExistente = await MaquinaModel.buscarPorID(id);

            if (!maquinaExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Máquina não encontrada',
                    mensagem: `Máquina com ID ${id} não foi encontrada`
                });
            }

            if (req.file) {
                dadosMaquina.imagem = req.file.filename;
            }

            const affectedRows = await MaquinaModel.atualizar(id, dadosMaquina)

            if (affectedRows === 0) {

                if (req.file) {
                    await deleteFile(req.file.filename);
                }

                return res.status(404).json({
                    sucesso: false,
                    erro: 'Máquina não encontrada',
                    mensagem: `Máquina com ID ${id} não foi encontrada`
                });
            }

            if (maquinaExistente.imagem && req.file) {
                await deleteFile(maquinaExistente.imagem);
            }

            invalidarLimitesMaquina(id);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Máquina atualizada com sucesso',
                dados: {
                    linhasAfetadas: affectedRows
                }
            });
        }
        catch (error) {
            console.error('Erro ao atualziar maquina:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possivel atualizar o maquina'
            });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;

            const maquinaExistente = await MaquinaModel.buscarPorID(id);

            if (!maquinaExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Maquina não encontrado',
                    mensagem: `Maquina com ID ${id} não foi encontrado`
                });
            }

            const affectedRows = await MaquinaModel.excluir(id);

            if (affectedRows === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Maquina não encontrado',
                    mensagem: `Maquina com ID ${id} não foi encontrado`
                });
            }

            if (maquinaExistente.imagem) {
                await deleteFile(maquinaExistente.imagem);
            }

            res.status(200).json({
                sucesso: true,
                mensagem: 'Maquina excluido com sucesso',
                dados: {
                    linhasAfetadas: affectedRows
                }
            });
        }
        catch (error) {
            console.error('Erro ao excluir maquina:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o maquina'
            });
        }
    }

}

export default MaquinaController;