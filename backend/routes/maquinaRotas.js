import express from 'express';
import MaquinaController from '../controllers/MaquinaController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Maquinas
 *   description: Rotas de maquinas
 *
 * components:
 *   schemas:
 *     Maquina:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Motor Esteira A1
 *         cod_registro:
 *           type: string
 *           example: MTR-L1-001
 *         modelo:
 *           type: string
 *           example: WEG W22
 *         serie:
 *           type: string
 *           example: A1S2026
 *         tipo:
 *           type: string
 *           example: Motor de Inducao Trifasico
 *         potencia_kw:
 *           type: number
 *           format: float
 *           example: 15.0
 *         tensao_faixa:
 *           type: string
 *           example: 220-380V
 *         corrente_nominal_a:
 *           type: number
 *           format: float
 *           example: 45.5
 *         frequencia_hz:
 *           type: number
 *           format: float
 *           example: 60.0
 *         rotacao_rpm:
 *           type: integer
 *           example: 1750
 *         grau_protecao_ip:
 *           type: string
 *           example: IP55
 *         classe_isolamento:
 *           type: string
 *           example: F
 *         fator_servico:
 *           type: number
 *           format: float
 *           example: 1.15
 *         rendimento_percentual:
 *           type: number
 *           format: float
 *           example: 93.2
 *         fator_potencia:
 *           type: number
 *           format: float
 *           example: 0.89
 *         temperatura_ambiente_min_c:
 *           type: number
 *           format: float
 *           example: 10.0
 *         temperatura_ambiente_max_c:
 *           type: number
 *           format: float
 *           example: 45.0
 *         certificacao_norma:
 *           type: string
 *           example: IEC 60034
 *         imagem:
 *           type: string
 *           example: motor_a1.jpg
 *         setor:
 *           type: string
 *           enum: [linha_1, linha_2, linha_3]
 *           example: linha_1
 *         nivel_criticidade:
 *           type: string
 *           enum: [baixa, media, alta]
 *           example: media
 *         status_operacional:
 *           type: string
 *           enum: [ativa, parada, manutencao]
 *           example: ativa
 *         status_saude:
 *           type: string
 *           enum: [ok, alerta]
 *           example: ok
 *         temperatura_limite_c:
 *           type: number
 *           format: float
 *           example: 85.0
 *         aceleracao_limite_mms:
 *           type: number
 *           format: float
 *           example: 3.5
 *         data_criacao:
 *           type: string
 *           format: date-time
 *           example: 2026-03-30T09:10:00.000Z
 *         data_atualizacao:
 *           type: string
 *           format: date-time
 *           example: 2026-03-30T09:10:00.000Z
 *     MaquinaCreate:
 *       type: object
 *       required: [nome, cod_registro, status_operacional, temperatura_limite_c, aceleracao_limite_mms]
 *       properties:
 *         nome:
 *           type: string
 *           example: Motor Esteira A1
 *         cod_registro:
 *           type: string
 *           example: MTR-L1-001
 *         modelo:
 *           type: string
 *           example: WEG W22
 *         serie:
 *           type: string
 *           example: A1S2026
 *         tipo:
 *           type: string
 *           example: Motor de Inducao Trifasico
 *         potencia_kw:
 *           type: number
 *           format: float
 *           example: 15.0
 *         tensao_faixa:
 *           type: string
 *           example: 220-380V
 *         corrente_nominal_a:
 *           type: number
 *           format: float
 *           example: 45.5
 *         frequencia_hz:
 *           type: number
 *           format: float
 *           example: 60.0
 *         rotacao_rpm:
 *           type: integer
 *           example: 1750
 *         grau_protecao_ip:
 *           type: string
 *           example: IP55
 *         classe_isolamento:
 *           type: string
 *           example: F
 *         fator_servico:
 *           type: number
 *           format: float
 *           example: 1.15
 *         rendimento_percentual:
 *           type: number
 *           format: float
 *           example: 93.2
 *         fator_potencia:
 *           type: number
 *           format: float
 *           example: 0.89
 *         temperatura_ambiente_min_c:
 *           type: number
 *           format: float
 *           example: 10.0
 *         temperatura_ambiente_max_c:
 *           type: number
 *           format: float
 *           example: 45.0
 *         certificacao_norma:
 *           type: string
 *           example: IEC 60034
 *         imagem:
 *           type: string
 *           example: motor_a1.jpg
 *         setor:
 *           type: string
 *           enum: [linha_1, linha_2, linha_3]
 *           example: linha_1
 *         nivel_criticidade:
 *           type: string
 *           enum: [baixa, media, alta]
 *           example: media
 *         status_operacional:
 *           type: string
 *           enum: [ativa, parada, manutencao]
 *           example: ativa
 *         status_saude:
 *           type: string
 *           enum: [ok, alerta]
 *           example: ok
 *         temperatura_limite_c:
 *           type: number
 *           format: float
 *           example: 85.0
 *         aceleracao_limite_mms:
 *           type: number
 *           format: float
 *           example: 3.5
 *     MaquinaUpdate:
 *       type: object
 *       properties: 
 *         status_operacional:
 *           type: string
 *           enum: [ativa, parada, manutencao]
 *           example: parada
 *         status_saude:
 *           type: string
 *           enum: [ok, alerta]
 *           example: alerta
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
 * /maquinas:
 *   get:
 *     summary: Lista maquinas com paginacao
 *     tags: [Maquinas]
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
 *         name: setor
 *         schema:
 *           type: string
 *           enum: [linha_1, linha_2, linha_3]
 *       - in: query
 *         name: status_operacional
 *         schema:
 *           type: string
 *           enum: [ativa, parada, manutencao]
 *       - in: query
 *         name: status_saude
 *         schema:
 *           type: string
 *           enum: [ok, alerta]
 *     responses:
 *       200:
 *         description: Lista de maquinas
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
 *                     $ref: '#/components/schemas/Maquina'
 *                 paginacao:
 *                   type: object
 *                   properties:
 *                     pagina:
 *                       type: integer
 *                       example: 1
 *                     limite:
 *                       type: integer
 *                       example: 10
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
router.get('/', authMiddleware, MaquinaController.listarTodos);

/**
 * @swagger
 * /maquinas/resumo-status:
 *   get:
 *     summary: Retorna resumo por status das maquinas
 *     tags: [Maquinas]
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
 *                     totalMaquinas:
 *                       type: integer
 *                       example: 4
 *                     statusOperacional:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         ativa: 2
 *                         parada: 1
 *                         manutencao: 1
 *                     statusSaude:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         ok: 3
 *                         alerta: 1
 *       401:
 *         description: Nao autenticado
 *       500:
 *         description: Erro interno
 */
router.get('/resumo-status', authMiddleware, MaquinaController.resumoStatus);

/**
 * @swagger
 * /maquinas/{id}:
 *   get:
 *     summary: Busca maquina por ID
 *     tags: [Maquinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Maquina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   $ref: '#/components/schemas/Maquina'
 *       401:
 *         description: Nao autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseErro'
 *       404:
 *         description: Maquina nao encontrada
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
router.get('/:id', authMiddleware, MaquinaController.buscarPorID);

/**
 * @swagger
 * /maquinas:
 *   post:
 *     summary: Cria uma nova maquina
 *     tags: [Maquinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaquinaCreate'
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/MaquinaCreate'
 *               - type: object
 *                 properties:
 *                   imagem:
 *                     type: string
 *                     format: binary
 *     responses:
 *       201:
 *         description: Maquina criada
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
 *                   example: Maquina criada com sucesso
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
router.post('/', authMiddleware, adminMiddleware, upload.single('imagem'), MaquinaController.criar);

/**
 * @swagger
 * /maquinas/{id}:
 *   put:
 *     summary: Atualiza uma maquina por ID
 *     tags: [Maquinas]
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
 *             $ref: '#/components/schemas/MaquinaUpdate'
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/MaquinaUpdate'
 *               - type: object
 *                 properties:
 *                   imagem:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: Maquina atualizada
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
 *                   example: Maquina atualizada com sucesso
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
 *         description: Maquina nao encontrada
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
router.put('/:id', authMiddleware, adminMiddleware, upload.single('imagem'), MaquinaController.atualizar);

/**
 * @swagger
 * /maquinas/{id}:
 *   delete:
 *     summary: Exclui uma maquina por ID
 *     tags: [Maquinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Maquina excluida
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
 *                   example: Maquina excluida com sucesso
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
 *         description: Maquina nao encontrada
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
router.delete('/:id', authMiddleware, adminMiddleware, MaquinaController.excluir);

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