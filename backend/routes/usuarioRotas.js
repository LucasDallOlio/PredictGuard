import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', UsuarioController.login);

router.get('/', authMiddleware, UsuarioController.listarTodos);
router.get('/:id', authMiddleware, UsuarioController.buscarPorID);
router.post('/', authMiddleware, adminMiddleware, UsuarioController.criar);
router.put('/:id', authMiddleware, adminMiddleware, UsuarioController.atualizar);
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