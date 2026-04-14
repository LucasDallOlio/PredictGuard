import MaquinaModel from '../models/MaquinaModel';

class MaquinaController {


    static async buscarPorID(req, res) {
        try {
            const { id } = req.params

            const usuario = await MaquinaModel.buscarPorID(id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuario não encontrado',
                    mensagem: `Usuario com ID ${id} não foi encontrado`
                });
            }
            res.status(200).json({
                sucesso: true,
                dados: usuario
            });
        }
        catch (error) {
            console.error('Erro ao buscar usuario:', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o usuario'
            });
        }
    }

    

}

export default MaquinaController;