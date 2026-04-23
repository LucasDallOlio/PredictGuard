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

async function getConnection() {
    return pool.getConnection();
}


async function create(table, data) {
    const connection = await getConnection();

    try {
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
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
    finally {
        connection.release();
    }
}

async function read(table, where = null) {
    const connection = await getConnection();

    try {
        let sql = `select * from ${table}`;
        if (where) {
            sql += ` where ${where}`;
        }

        const [rows] = await connection.execute(sql);
        return rows;
    }
    finally {
        connection.release();
    }
}

async function update(table, data, where, whereParams = []) {
    const connection = await getConnection();

    try {
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            throw new Error('Dados invalidos para atualizacao');
        }
        if (typeof where !== 'string' || !where.trim()) {
            throw new Error('Where obrigatório para atualização');
        }
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = `set ${columns.map(column => `${column} = ?`).join(', ')}`
        const sql = `update ${table} ${placeholders} where ${where}`;
        const [result] = await connection.execute(sql, [...values, ...whereParams]);
        return result.affectedRows

    }
    finally {
        connection.release();
    }
}

async function deleteRecord(table, where, whereParams = []) {
    const connection = await getConnection();

    try {

        if (typeof where !== 'string' || !where.trim()) {
            throw new Error('Where obrigatório para exclusão');
        }

        const sql = `delete from ${table} where ${where}`;
        const [result] = await connection.execute(sql, whereParams);
        return result.affectedRows
    }
    finally {
        connection.release();
    }
}

async function readWithPagination({
    table,
    where = null,
    whereParams = [],
    page = 1,
    limit = 10
}) {
    const connection = await getConnection();

    try {
        const offset = (page - 1) * limit;
        let sql = `select * from ${table}`;

        if (typeof where === 'string' && where.trim()) {
            sql += ` where ${where}`;
        }
        sql += ` order by id asc limit ${limit} offset ${offset}`
        const [rows] = await connection.execute(sql, whereParams);
        return rows;
    }
    finally {
        connection.release();
    }
}

async function count({
    table,
    where = null,
    whereParams = [],
    groupBy = null
}) {
    const connection = await getConnection();

    try {

        let selectSQL = `select count(*) as count from ${table}`;
        let whereSQL = '';
        let groupBySQL = '';

        if (typeof where === 'string' && where.trim()) {
            whereSQL = ` where ${where}`;
        }
         if (typeof groupBy === 'string' && groupBy.trim()) {
            groupBySQL = ` group by ${groupBy}`;
            selectSQL = `select ${groupBy}, count(*) as count from ${table}`;
        }
        const sql = selectSQL + whereSQL + groupBySQL;
        const [rows] = await connection.execute(sql, whereParams);
        return rows;
    }
    finally {
        connection.release();
    }
}

export {
    getConnection,
    create,
    read,
    update,
    deleteRecord,
    readWithPagination,
    count
};