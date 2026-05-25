import { JWT_CONFIG } from '../config/jwt.js';
import UsuarioModel from '../models/UsuarioModel.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { deleteFile } from '../utils/file.js';

class AuthController {
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

			if (canal === 'mobile' && usuario.tipo !== 'tecnico') {
				return res.status(403).json({
					sucesso: false,
					erro: 'Acesso negado',
					mensagem: 'Apenas tecnicos podem acessar esta funcionalidade'
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

			usuario.foto = `${process.env.BASE_URL}${process.env.UPLOAD_PATH.replace(/^\.\//, '/')}/${usuario.foto}`;

			res.cookie('auth_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				maxAge: 1000 * 60 * 60,
				path: '/'
			});

			res.status(200).json({
				sucesso: true,
				mensagem: 'Login realizado com sucesso',
				dados: {
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

	static async logout(req, res) {
		try {
			res.clearCookie('auth_token', {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				path: '/'
			});

			return res.status(200).json({
				sucesso: true,
				mensagem: 'Logout realizado com sucesso'
			})
		}
		catch (error) {
			console.error('Erro ao fazer o logout:', error);
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Nao foi possivel processar o logout'
			})
		}
	}

	static async retornarUsuario(req, res) {
		try {
			const id = req.usuario.id;

			const usuario = await UsuarioModel.buscarPorID(id)

			usuario.foto = `${process.env.BASE_URL}${process.env.UPLOAD_PATH.replace(/^\.\//, '/')}/${usuario.foto}`;
			
			res.status(200).json({
				sucesso: true,
				mensagem: 'Usuario retornado com sucesso',
				dados: {
					usuario
				}
			})
		}
		catch (error) {
			console.error('Erro ao retornar usuario autenticado:', error);
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Nao foi possivel retornar o usuario autenticado'
			})
		}
	}

	static async atualizar(req, res) {
		try {
			const { senha, telefone } = req.body;
			let foto = req.body.foto;
			const id = req.usuario.id;

			const usuarioAtual = await UsuarioModel.buscarPorID(id);
			const fotoAnterior = usuarioAtual?.foto || null;

			if (req.file) {
				foto = req.file.filename;
			}

			const dadosAtualizacao = {};
			if (senha) dadosAtualizacao.senha = senha;
			if (typeof telefone !== 'undefined') dadosAtualizacao.telefone = telefone;
			if (typeof foto !== 'undefined') dadosAtualizacao.foto = foto;

			if (Object.keys(dadosAtualizacao).length === 0) {
				return res.status(400).json({
					sucesso: false,
					erro: 'Dados insuficientes',
					mensagem: 'Nenhum campo informado para atualização'
				});
			}

			const affectedRows = await UsuarioModel.atualizar(id, dadosAtualizacao)

			if (affectedRows === 0) {
				if (req.file) {
					await deleteFile(req.file.filename);
				}

				return res.status(404).json({
					sucesso: false,
					erro: 'Usuario não encontrado',
					mensagem: `Usuario com ID ${id} não foi encontrado`
				});
			}

			if (req.file && fotoAnterior) {
				const nomeFotoAnterior = path.basename(fotoAnterior);
				if (nomeFotoAnterior && nomeFotoAnterior !== foto) {
					await deleteFile(nomeFotoAnterior);
				}
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
			console.error('Erro ao atualizar usuario autenticado:', error);
			res.status(500).json({
				sucesso: false,
				erro: 'Erro interno do servidor',
				mensagem: 'Nao foi possivel atualizar o usuario autenticado'
			})
		}
	}
}

export default AuthController;
