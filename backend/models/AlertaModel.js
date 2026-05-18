import { create, read, readWithPagination, count } from '../config/database.js';

class AlertaLeituraModel {
    static async criar({ maquina_id, sensor_id = null, tipo_alerta, severidade, valor_detectado = null, limite_configurado = null, unidade = null, mensagem }) {
        return await create('alertas', {
            maquina_id,
            sensor_id,
            tipo_alerta,
            severidade,
            valor_detectado,
            limite_configurado,
            unidade,
            mensagem
        });
    }

    static async buscarPorID(id) {
        const rows = await read('alertas', `id = ${Number(id)}`);
        return rows[0] || null;
    }

    static async listarTodos(page = 1, limit = 10) {
        const alertas = await readWithPagination({ table: 'alertas', page, limit });
        const [total] = await count({ table: 'alertas' });
        return { alertas, total: total.count, page, limit };
    }
}

export default AlertaLeituraModel;