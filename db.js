// require('dotenv').config()

// import pg from 'pg';
const pg = require("pg");
const {Pool} = pg;

let localPoolConfig = {
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE
}
console.log("test: ", process.env.DATABASE_URL)
const poolConfig = process.env.DATABASE_URL? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
} : localPoolConfig;

const pool = new Pool(poolConfig);

module.exports = {
    getPool: function () {
        return pool
    }
};

// export default pool;