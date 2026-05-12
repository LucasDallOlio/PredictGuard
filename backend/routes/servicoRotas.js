import express from 'express';
import ServicoController from '../controllers/ServicoController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Serviços
 *   description: Gestão de serviços
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Servico:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         maquina_id:
 *           type: integer
 *           example: 1
 *         usuario_responsavel_id:
 *           type: integer
 *           example: 2
 *         usuario_solicitante_id:
 *           type: integer
 *           example: 5
 *         tipo:
 *           type: string
 *           enum: [manutencao_preditiva, manutencao_preventiva, manutencao_corretiva, alerta_de_falha]
 *           example: manutencao_preditiva
 *         servico_status:
 *           type: string
 *           enum: [solicitado, em_andamento, concluido]
 *           example: solicitado
 *         descricao:
 *           type: string
 *           example: "Analise de vibracao para identificar desalinhamento."
 *         observacao:
 *           type: string
 *           example: "Aguardando janela de parada."
 *         data_alerta:
 *           type: string
 *           format: date-time
 *           example: "2026-05-10T13:45:00.000Z"
 *         data_criacao:
 *           type: string
 *           format: date-time
 *           example: "2026-05-10T13:50:00.000Z"
 *         data_encerramento:
 *           type: string
 *           format: date-time
 *           example: "2026-05-11T10:30:00.000Z"
 *         maquina:
 *           type: string
 *           example: "Compressor 3"
 *         usuario_responsavel:
 *           type: string
 *           example: "Maria Souza"
 *     ServicoCreate:
 *       type: object
 *       required:
 *         - maquina_id
 *         - usuario_responsavel_id
 *         - tipo
 *       properties:
 *         maquina_id:
 *           type: integer
 *           example: 1
 *         usuario_responsavel_id:
 *           type: integer
 *           example: 2
 *         tipo:
 *           type: string
 *           enum: [manutencao_preditiva, manutencao_preventiva, manutencao_corretiva, alerta_de_falha]
 *         descricao:
 *           type: string
 *           example: "Analise de vibracao para identificar desalinhamento."
 *         data_alerta:
 *           type: string
 *           format: date-time
 *     ServicoUpdate:
 *       type: object
 *       properties:
 *         servico_status:
 *           type: string
 *           enum: [solicitado, em_andamento, concluido]
 *           example: "em_andamento"
 *     ApiRespostaServicoLista:
 *       type: object
 *       properties:
 *         sucesso:
 *           type: boolean
 *         dados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Servico'
 *         paginacao:
 *           type: object
 *           properties:
 *             pagina:
 *               type: integer
 *             limite:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPaginas:
 *               type: integer
 *     ApiRespostaServicoItem:
 *       type: object
 *       properties:
 *         sucesso:
 *           type: boolean
 *         dados:
 *           $ref: '#/components/schemas/Servico'
 */

/**
 * @swagger
 * /servicos:
 *   get:
 *     tags: [Serviços]
 *     summary: Lista serviços
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
 *           enum: [manutencao_preditiva, manutencao_preventiva, manutencao_corretiva, analise_de_falha]
 *       - in: query
 *         name: servico_status
 *         schema:
 *           type: string
 *           enum: [solicitado, em_andamento, concluido, cancelado]
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiRespostaServicoLista'
 *       500:
 *         description: Erro interno
 */
router.get('/', authMiddleware, ServicoController.listarTodos);

/**
 * @swagger
 * /servicos/resumo-status:
 *   get:
 *     summary: Retorna resumo por status dos servicos
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo de status retornado com sucesso
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
 *                     totalServicos:
 *                       type: integer
 *                       example: 8
 *                     statusServicos:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         solicitado: 3
 *                         em_andamento: 2
 *                         concluido: 2
 *                         cancelado: 1
 *       401:
 *         description: Nao autenticado
 *       500:
 *         description: Erro interno
 */
router.get('/resumo-status', authMiddleware, ServicoController.resumoStatus);

/**
 * @swagger
 * /servicos/{id}:
 *   get:
 *     tags: [Serviços]
 *     summary: Busca serviço por ID
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
 *         description: Serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiRespostaServicoItem'
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/:id', authMiddleware, ServicoController.buscarPorID);
/**
 * @swagger
 * /servicos:
 *   post:
 *     tags: [Serviços]
 *     summary: Cria um serviço
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicoCreate'
 *     responses:
 *       201:
 *         description: Serviço criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *       500:
 *         description: Erro interno
 */
router.post('/', authMiddleware, adminMiddleware, ServicoController.criar);
/**
 * @swagger
 * /servicos/{id}:
 *   put:
 *     tags: [Serviços]
 *     summary: Atualiza um serviço
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
 *             $ref: '#/components/schemas/ServicoUpdate'
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: object
 *                   properties:
 *                     linhasAfetadas:
 *                       type: integer
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro interno
 */
router.put('/:id', authMiddleware, ServicoController.atualizar);

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