import { create } from '../config/database.js';

class LeituraModel {
    static async registrar({ sensor_id, valor = null, unidade, status_vibracao = null }) {
        return await create('leituras', { 
            sensor_id, 
            valor, 
            unidade, 
            status_vibracao 
        });
    }
}

export default LeituraModel;