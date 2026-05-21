import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Rotas de usuarios
 *
 * components:
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
 * /usuarios/resumo-tipos:
 *   get:
 *     summary: Retorna resumo de usuarios por tipo
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Resumo de usuarios retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   type: object
 *                   properties:
 *                     totalUsuarios:
 *                       type: integer
 *                       example: 12
 *                     totalTecnicos:
 *                       type: integer
 *                       example: 9
 *                     totalAdmins:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Nao autenticado
 *       500:
 *         description: Erro interno
 */
router.get('/resumo-tipos', authMiddleware, UsuarioController.resumoTipos);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista usuarios com paginacao e filtro opcional
 *     tags: [Usuarios]
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