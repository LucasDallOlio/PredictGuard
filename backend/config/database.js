import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getConnection(){
    return pool.getConnection();
}


async function create(table, data){
    const connection = await getConnection();
    
    try{
        if(!data || typeof data !== 'object' || Object.keys(data).length === 0){
            throw new Error('Dados invalidos para insercao');
        }

        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map(() => '?').join(', ');

        const sql = `insert into ${table} (${columns.join(', ')}) values (${placeholders})`;
        const [result] = await connection.execute(sql, values);

        return {
            insertId: result.insertId,
            affectedRows: result.affectedRows
        };
    }
    finally{
        connection.release();
    }
}

async function read(table, where = null){
    const connection = await getConnection();

    try{
        let sql = `select * from ${table}`;
        if(where){
            sql += ` where ${where}`;
        }

        const [rows] = await connection.execute(sql);
        return rows;
    }
    finally{
        connection.release();
    }
}


export { 
    getConnection,
    create, 
    read
};