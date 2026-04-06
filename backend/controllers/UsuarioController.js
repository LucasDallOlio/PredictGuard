import UsuarioModel from '../models/UsuarioModel.js';

class UsuarioController {
    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            const resultado = await UsuarioModel.listarTodos(pagina, limite);
            
            res.status(200).json({
                sucesso: true,
                dados: resultado.usuarios,
                paginacao: {
                    pagina: resultado.page,
                    limite: resultado.limit
                }
            });
        }
        catch (error) {
            console.error('Erro ao listar usuarios:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuarios'
            });
        }
    }
}

export default UsuarioController;