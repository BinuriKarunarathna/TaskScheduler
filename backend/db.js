const mysql = require("mysql2");

// Resolve DB host dynamically - prefer environment variable
const resolvedHost = process.env.DB_HOST || "localhost";

console.log(`🔍 DB Configuration:`);
console.log(`   Host: ${resolvedHost}`);
console.log(`   User: ${process.env.DB_USER || "root"}`);
console.log(`   DB:   ${process.env.DB_NAME || "devops"}`);

const pool = mysql.createPool({
  host: resolvedHost,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "devops",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 8000
});

const exec = (sql, params = []) =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

const testConnection = () =>
  exec("SELECT 1 AS ok")
    .then(() => true)
    .catch(() => false);

module.exports = { pool, exec, testConnection, resolvedHost };
