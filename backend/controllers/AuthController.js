import { JWT_CONFIG } from '../config/jwt.js';
import UsuarioModel from '../models/UsuarioModel.js';
import jwt from 'jsonwebtoken';

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
}

export default AuthController;
