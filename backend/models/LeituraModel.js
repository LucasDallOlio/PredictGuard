import { create } from '../config/database.js';

class LeituraModel {
    static async registrar({ sensor_id, valor, unidade }) {
        return await create('leituras', { sensor_id, valor, unidade });
    }
}

export default LeituraModel;