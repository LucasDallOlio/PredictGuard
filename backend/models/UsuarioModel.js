import { create, read, update, deleteRecord, readWithPagination } from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.js';

class UsuarioModel {

    static async buscarPorID(id) {
        try {
            const rows = await read('usuarios', `id = ${Number(id)}`);

            if (!rows[0]) return null;

            const { senha, ...usuario } = rows[0];
            return usuario;
        }
        catch (error) {
            throw new Error(`Erro ao buscar usuario por ID: ${error.message}`);
        }
    }

    static async criar(usuario) {
        usuario.senha = await hashPassword(usuario.senha)
        try {
            return await create('usuarios', usuario);
        }
        catch (error) {
            throw new Error(`Erro ao criar usuario: ${error.message}`);
        }
    }

    static async atualizar(id, dadosUsuario) {
        try {
            if (dadosUsuario.senha) {
                dadosUsuario.senha = await hashPassword(dadosUsuario.senha)
            }
            return await update('usuarios', dadosUsuario, 'id = ?', [id])
        }
        catch (error) {
            throw new Error(`Erro ao atualizar usuario: ${error.message}`);
        }
    }

    static async excluir(id) {
        try {
            return await deleteRecord('usuarios', 'id = ?', [id])
        }
        catch (error) {
            throw new Error(`Erro ao excluir usuario: ${error.message}`);
        }
    }

    static async listarTodos(page, limit) {
        try {
            
            const usuarios = await readWithPagination({
                table: 'usuarios',
                page,
                limit
            })
            
            return {
                usuarios,
                page,
                limit
            }
        }
        catch (error) {
            throw new Error(`Erro ao buscar usuarios: ${error.message}`);
        }
    }
}

export default UsuarioModel