const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'recursion_visualizer'
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