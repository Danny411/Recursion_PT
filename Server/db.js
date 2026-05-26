require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recursion_visualizer',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
});

db.connect((err) => {
  if (err) {
    console.log("⚠️ Database connection failed");
    console.log("Error:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

module.exports = db;