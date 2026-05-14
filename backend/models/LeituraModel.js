import { create } from '../config/database.js';

class LeituraModel {
    static async registrar({ sensor_id, valor, unidade }) {
        // Removido status_vibracao para bater com o seu CREATE TABLE
        return await create('leituras', { 
            sensor_id, 
            valor, 
            unidade 
        });
    }
}

export default LeituraModel;