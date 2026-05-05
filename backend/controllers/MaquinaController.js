import MaquinaModel from '../models/MaquinaModel.js';
import { deleteFile } from '../utils/file.js'

class MaquinaController {

    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            const resultado = await MaquinaModel.listarTodos(pagina, limite);

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