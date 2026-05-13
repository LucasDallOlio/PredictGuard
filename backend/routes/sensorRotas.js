import express from 'express';
import SensorController from '../controllers/SensorController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Sensores
 *   description: Rotas de sensores
 *
 * components:
 *   schemas:
 *     Sensor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         maquina_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         modelo:
 *           type: string
 *           example: PT100-XR
 *         tipo:
 *           type: string
 *           enum: [temperatura, acelerometro]
 *           example: temperatura
 *         data_criacao:
 *           type: string
 *           format: date-time
 *           example: 2026-03-30T09:10:00.000Z
 *         data_atualizacao:
 *           type: string
 *           format: date-time
 *           example: 2026-03-30T09:10:00.000Z
 *         maquina:
 *           type: string
 *           nullable: true
 *           example: Motor Esteira A1
 *     SensorCreate:
 *       type: object
 *       required: [modelo, tipo]
 *       properties:
 *         maquina_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         modelo:
 *           type: string
 *           example: PT100-XR
 *         tipo:
 *           type: string
 *           enum: [temperatura, acelerometro]
 *           example: temperatura
 *     SensorUpdate:
 *       type: object
 *       properties:
 *         maquina_id:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         modelo:
 *           type: string
 *           example: PT100-IND
 *         tipo:
 *           type: string
 *           enum: [temperatura, acelerometro]
 *           example: acelerometro
 */

const router = express.Router();

/**
 * @swagger
 * /sensores:
 *   get:
 *     summary: Lista sensores com paginacao
 *     tags: [Sensores]
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
 *         name: maquina_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [temperatura, acelerometro]
 *     responses:
 *       200:
 *         description: Lista de sensores
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
 *                     $ref: '#/components/schemas/Sensor'
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
 *       401:
 *         description: Nao autenticado
 *       500:
 *         description: Erro interno
 */
router.get('/', authMiddleware, SensorController.listarTodos);

/**
 * @swagger
 * /sensores/{id}:
 *   get:
 *     summary: Busca sensor por ID
 *     tags: [Sensores]
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
 *         description: Sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   $ref: '#/components/schemas/Sensor'
 *       401:
 *         description: Nao autenticado
 *       404:
 *         description: Sensor nao encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/:id', authMiddleware, SensorController.buscarPorID);

/**
 * @swagger
 * /sensores:
 *   post:
 *     summary: Cria um sensor
 *     tags: [Sensores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorCreate'
 *     responses:
 *       201:
 *         description: Sensor criado
 *       401:
 *         description: Nao autenticado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno
 */
router.post('/', authMiddleware, adminMiddleware, SensorController.criar);

/**
 * @swagger
 * /sensores/{id}:
 *   put:
 *     summary: Atualiza um sensor por ID
 *     tags: [Sensores]
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
 *             $ref: '#/components/schemas/SensorUpdate'
 *     responses:
 *       200:
 *         description: Sensor atualizado
 *       401:
 *         description: Nao autenticado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Sensor nao encontrado
 *       500:
 *         description: Erro interno
 */
router.put('/:id', authMiddleware, adminMiddleware, SensorController.atualizar);

/**
 * @swagger
 * /sensores/{id}:
 *   delete:
 *     summary: Exclui um sensor por ID
 *     tags: [Sensores]
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
 *         description: Sensor excluido
 *       401:
 *         description: Nao autenticado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Sensor nao encontrado
 *       500:
 *         description: Erro interno
 */
router.delete('/:id', authMiddleware, adminMiddleware, SensorController.excluir);

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
