import express from 'express';
import LeituraController from '../controllers/LeituraController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Leituras
 *   description: Rotas de leituras
 *
 * components:
 *   schemas:
 *     Leitura:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         sensor_id:
 *           type: integer
 *           example: 2
 *         valor:
 *           type: number
 *           example: 82.4
 *         unidade:
 *           type: string
 *           enum: [celsius, mm/s]
 *         data_leitura:
 *           type: string
 *           format: date-time
 *         tipo_sensor:
 *           type: string
 *           enum: [temperatura, acelerometro]
 *         maquina_id:
 *           type: integer
 *           example: 1
 */

const router = express.Router();

/**
 * @swagger
 * /leituras/serie:
 *   get:
 *     summary: Lista leituras para graficos
 *     tags: [Leituras]
 *     parameters:
 *       - in: query
 *         name: sensor_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maquina_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [temperatura, acelerometro]
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
 *         name: periodo_horas
 *         schema:
 *           type: integer
 *       - in: query
 *         name: periodo_dias
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 500
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Lista de leituras
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
 *                     $ref: '#/components/schemas/Leitura'
 *       400:
 *         description: Filtro invalido
 *       401:
 *         description: Nao autenticado
 *       500:
 *         description: Erro interno
 */
router.get('/serie', authMiddleware, LeituraController.listarSerie);

export default router;
