import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Rotas de usuarios e autenticacao
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Ana Souza
 *         email:
 *           type: string
 *           example: ana.souza@predictguard.com
 *         telefone:
 *           type: string
 *           example: (11) 99999-1001
 *         tipo:
 *           type: string
 *           enum: [admin, tecnico]
 *           example: admin
 *         foto:
 *           type: string
 *           example: ana.jpg
 *         data_criacao:
 *           type: string
 *           format: date-time
 *           example: 2026-03-30T09:10:00.000Z
 *         data_atualizacao:
 *           type: string
 *           format: date-time
 *           example: 2026-03-30T09:10:00.000Z
 *     UsuarioCreate:
 *       type: object
 *       required: [nome, email, senha, telefone, tipo]
 *       properties:
 *         nome:
 *           type: string
 *           example: Joao Silva
 *         email:
 *           type: string
 *           example: joao.silva@predictguard.com
 *         senha:
 *           type: string
 *           example: joao123
 *         telefone:
 *           type: string
 *           example: (11) 99999-2000
 *         tipo:
 *           type: string
 *           enum: [admin, tecnico]
 *           example: tecnico
 *         foto:
 *           type: string
 *           example: profile_placeholder.jpg
 *     UsuarioUpdate:
 *       type: object
 *       properties:
 *         telefone:
 *           type: string
 *           example: (11) 99999-3000
 *         senha:
 *           type: string
 *           example: ana1234
 *     UsuarioLogin:
 *       type: object
 *       required: [email, senha, canal]
 *       properties:
 *         email:
 *           type: string
 *           example: ana.souza@predictguard.com
 *         senha:
 *           type: string
 *           example: ana123
 *         canal:
 *           type: string
 *           enum: [web, mobile]
 *           example: web
 *     ApiResponseSucesso:
 *       type: object
 *       properties:
 *         sucesso:
 *           type: boolean
 *           example: true
 *         mensagem:
 *           type: string
 *           example: Operacao realizada com sucesso
 *         dados:
 *           type: object
 *     ApiResponseErro:
 *       type: object
 *       properties:
 *         sucesso:
 *           type: boolean
 *           example: false
 *         erro:
 *           type: string
 *           example: Erro interno do servidor
 *         mensagem:
 *           type: string
 *           example: Nao foi possivel processar a solicitacao
 */

const router = express.Router();

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autentica um usuario e retorna token JWT
 *     tags: [Usuarios]
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
router.post('/login', UsuarioController.login);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista usuarios com paginacao e filtro opcional
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [admin, tecnico]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 paginacao:
 *                   type: object
 *                   properties:
 *                     pagina:
 *                       type: integer
 *                       example: 1
 *                     limite:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Filtro invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
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
router.get('/', authMiddleware, UsuarioController.listarTodos);
/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Nao autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 *       404:
 *         description: Usuario nao encontrado
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
router.get('/:id', authMiddleware, UsuarioController.buscarPorID);
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UsuarioCreate'
 *               - type: object
 *                 properties:
 *                   foto:
 *                     type: string
 *                     format: binary
 *     responses:
 *       201:
 *         description: Usuario criado
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
 *                   example: Usuario criado com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Nao autenticado
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
router.post('/', authMiddleware, adminMiddleware, upload.single('foto'), UsuarioController.criar);
/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdate'
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UsuarioUpdate'
 *               - type: object
 *                 properties:
 *                   foto:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: Usuario atualizado
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
 *                   example: Usuario atualizado com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     linhasAfetadas:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Nao autenticado
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
 *       404:
 *         description: Usuario nao encontrado
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
router.put('/:id', authMiddleware, adminMiddleware, upload.single('foto'), UsuarioController.atualizar);
/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario excluido
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
 *                   example: Usuario excluido com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     linhasAfetadas:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Nao autenticado
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
 *       404:
 *         description: Usuario nao encontrado
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
router.delete('/:id', authMiddleware, adminMiddleware, UsuarioController.excluir);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;