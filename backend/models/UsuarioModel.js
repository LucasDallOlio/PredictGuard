import { create, read, update, deleteRecord, readWithPagination, count } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';

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

    static async buscarPorEmail(email) {
        try {
            const rows = await read('usuarios', `email = '${email}'`);

            return rows[0] || null;
        }
        catch (error) {
            throw new Error(`Erro ao buscar usuario por email: ${error.message}`);
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

    static async listarTodos(page = 1, limit = 10, filtro = null) {
        try {
            let where = '';
            let whereParams = [];

            if (filtro) {
                const columns = Object.keys(filtro);
                whereParams = Object.values(filtro);

                where = `${columns.map(column => `${column} = ?`).join(' AND ')}`
            }
            const usuarios = await readWithPagination({
                table: 'usuarios',
                page,
                limit,
                where,
                whereParams
            })

            const usuariosSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);

            const [total] = await count({
                table: 'usuarios'
            });

            return {
                usuarios: usuariosSemSenha,
                total: total.count,
                page,
                limit,
                totalPages: Math.ceil(total.count / limit)
            }
        }
        catch (error) {
            throw new Error(`Erro ao buscar usuarios: ${error.message}`);
        }
    }

    static async verificarCredenciais(email, senhaInformada) {
        try {
            const usuario = await this.buscarPorEmail(email);
            if (!usuario) {
                return null;
            }

            const senhaValida = await comparePassword(senhaInformada, usuario.senha);

            if (!senhaValida) {
                return null;
            }

            const { senha, ...usuarioSemSenha } = usuario;
            return usuarioSemSenha;
        }
        catch (error) {
            throw new Error(`Erro ao verificar credenciais: ${error.message}`);
        }
    }
}

export default UsuarioModel