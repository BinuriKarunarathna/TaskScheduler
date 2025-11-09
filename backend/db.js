// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "db", 
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "1234",
//   database: process.env.DB_NAME || "devops"
// });

// db.connect((err) => {
//   if (err) console.error("❌ Database connection failed:", err.message);
//   else console.log("✅ Connected to MySQL database");
// });

// module.exports = db;
const mysql = require("mysql2");

// Determine host with simple fallback chain
// 1. Explicit DB_HOST env
// 2. localhost (preferred for local dev)
// 3. 'db' (docker-compose service) if a docker hint env is set
const explicitHost = process.env.DB_HOST;
let resolvedHost = explicitHost || "localhost";

// If no explicit host and running inside docker (heuristic: DOCKER env or absence of ProgramFiles), prefer service name 'db'
if (!explicitHost && process.env.DOCKER && process.env.DOCKER.toLowerCase() === "true") {
  resolvedHost = "db";
}

const pool = mysql.createPool({
  host: resolvedHost,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "devops",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 8000 // ms
});

// Promise wrapper for queries (do NOT override pool.query)
const exec = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Test function (returns promise boolean)
const testConnection = () => {
  return exec("SELECT 1 AS ok")
    .then(() => true)
    .catch(() => false);
};

module.exports = { pool, exec, testConnection, resolvedHost };