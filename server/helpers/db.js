require('dotenv').config();
const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const query = (sql, values = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await pool.query(sql, values); // Use the pool object to execute the query
            resolve(result);
        } catch (error) {
            reject(error.message);
        }
    });
}

module.exports = { pool, query };
