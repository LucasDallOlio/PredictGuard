import express from 'express';
import AlertaController from '../controllers/AlertaController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Alertas
 *   description: Rotas de alertas das maquinas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Alerta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         maquina_id:
 *           type: integer
 *           example: 1
 *         sensor_id:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         tipo_alerta:
 *           type: string
 *           enum: [temperatura, vibracao, tendencia, offline]
 *         severidade:
 *           type: string
 *           enum: [baixa, media, alta, critica]
 *         valor_detectado:
 *           type: number
 *           nullable: true
 *         limite_configurado:
 *           type: number
 *           nullable: true
 *         unidade:
 *           type: string
 *           enum: [celsius, mm/s]
 *           nullable: true
 *         mensagem:
 *           type: string
 *         data_alerta:
 *           type: string
 *           format: date-time
 *     ApiRespostaAlertaLista:
 *       type: object
 *       properties:
 *         sucesso:
 *           type: boolean
 *         dados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Alerta'
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
 *     ApiRespostaAlertaItem:
 *       type: object
 *       properties:
 *         sucesso:
 *           type: boolean
 *         dados:
 *           $ref: '#/components/schemas/Alerta'
 */

/**
 * @swagger
 * /alertas:
 *   get:
 *     summary: Lista alertas das maquinas
 *     tags: [Alertas]
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
 *         name: tipo_alerta
 *         schema:
 *           type: string
 *           enum: [temperatura, vibracao, tendencia, offline]
 *       - in: query
 *         name: maquina_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sensor_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: severidade
 *         schema:
 *           type: string
 *           enum: [baixa, media, alta, critica]
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: periodo_dias
 *         schema:
 *           type: integer
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Lista de alertas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiRespostaAlertaLista'
 *       401:
 *         description: Nao autenticado
 *       500:
 *         description: Erro interno
 */
router.get('/', authMiddleware, AlertaController.listarTodos);

/**
 * @swagger
 * /alertas/{id}:
 *   get:
 *     summary: Busca alerta por ID
 *     tags: [Alertas]
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
 *         description: Alerta encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiRespostaAlertaItem'
 *       401:
 *         description: Nao autenticado
 *       404:
 *         description: Alerta nao encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/:id', authMiddleware, AlertaController.buscarPorID);

export default router;
