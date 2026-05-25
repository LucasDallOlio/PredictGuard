import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticacao
 */

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuario e retorna token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLogin'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Canal invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 *       401:
 *         description: Credenciais invalidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Encerra a sessao do usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: Logout realizado com sucesso
 *       401:
 *         description: Nao autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 */
router.post('/logout', authMiddleware, AuthController.logout);

/**
 * @swagger
 * /auth/usuario:
 *   get:
 *     summary: Retorna o usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Usuario retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: Usuario retornado com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Nao autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 */
router.get('/usuario', authMiddleware, AuthController.retornarUsuario);

/**
 * @swagger
 * /auth/usuario:
 *   patch:
 *     summary: Atualiza o usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               senha:
 *                 type: string
 *                 example: 'novaSenha123'
 *               telefone:
 *                 type: string
 *                 example: '(11) 98765-4321'
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario atualizado com sucesso
 *       400:
 *         description: Dados insuficientes
 *       401:
 *         description: Nao autenticado
 *       404:
 *         description: Usuario nao encontrado
 *       500:
 *         description: Erro interno
 */
router.patch('/usuario', authMiddleware, upload.single('foto'), AuthController.atualizar);

export default router;
