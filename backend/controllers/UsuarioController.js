import { JWT_CONFIG } from '../config/jwt.js';
import UsuarioModel from '../models/UsuarioModel.js';
import jwt from 'jsonwebtoken';

class UsuarioController {
    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;
            const filtroBruto = {
                tipo: req.query.tipo
            };

            const filtro = Object.fromEntries(
                Object.entries(filtroBruto).filter(([_, valor]) => {
                    return valor !== undefined && valor !== null && String(valor).trim() !== '';
                })
            );

            if (filtro.tipo) {
                const tipoNormalizado = String(filtro.tipo).trim().toLowerCase();
                const mapaTipos = {
                    admin: 'admin',
                    tecnico: 'técnico',
                    'técnico': 'técnico'
                };

                if (!mapaTipos[tipoNormalizado]) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Filtro inválido',
                        mensagem: "O filtro 'tipo' deve ser 'admin' ou 'técnico'"
                    });
                }

                filtro.tipo = mapaTipos[tipoNormalizado];
            }


            const resultado = await UsuarioModel.listarTodos(pagina, limite, filtro);

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

    static async buscarPorID(req, res) {
        try {
            const { id } = req.params

            const usuario = await UsuarioModel.buscarPorID(id);

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

    static async criar(req, res) {
        try {
            const usuario = req.body

            const resultado = await UsuarioModel.criar(usuario);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuario criado com sucesso',
                dados: {
                    id: resultado.insertId,
                }
            });
        }
        catch (error) {
            console.error('Erro ao criar usuario:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o usuario'
            });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosUsuario = req.body;

            const affectedRows = await UsuarioModel.atualizar(id, dadosUsuario)

            if (affectedRows === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuario não encontrado',
                    mensagem: `Usuario com ID ${id} não foi encontrado`
                });
            }

            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuario atualizado com sucesso',
                dados: {
                    linhasAfetadas: affectedRows
                }
            });
        }
        catch (error) {
            console.error('Erro ao atualziar usuario:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possivel atualizar o usuario'
            });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;

            const usuarioExistente = await UsuarioModel.buscarPorID(id);

            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuario não encontrado',
                    mensagem: `Usuario com ID ${id} não foi encontrado`
                });
            }

            const affectedRows = await UsuarioModel.excluir(id);

            if (affectedRows === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuario não encontrado',
                    mensagem: `Usuario com ID ${id} não foi encontrado`
                });
            }

            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuario excluido com sucesso',
                dados: {
                    linhasAfetadas: affectedRows
                }
            });
        }
        catch (error) {
            console.error('Erro ao excluir usuario:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o usuario'
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, senha, canal } = req.body
            
            const usuario = await UsuarioModel.verificarCredenciais(email, senha);

            if (!usuario) {
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Credenciais inválidas',
                    mensagem: 'Email ou senha incorretos'
                });
            }

            if (!['web', 'mobile'].includes(canal)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Canal inválido',
                    mensagem: 'O canal deve ser web ou mobile'
                });
            }

            if (canal === 'web' && usuario.tipo !== 'admin') {
                return res.status(403).json({
                    sucesso: false,
                    erro: 'Acesso negado',
                    mensagem: 'Apenas administradores podem acessar esta funcionalidade'
                });
            }

            if (canal === 'mobile' && usuario.tipo !== 'técnico') {
                return res.status(403).json({
                    sucesso: false,
                    erro: 'Acesso negado',
                    mensagem: 'Apenas técnicos podem acessar esta funcionalidade'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    tipo: usuario.tipo
                },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );
            res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    token,
                    usuario
                }
            })
        }
        catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível processar o login'
            });
        }
    }

}

export default UsuarioController;