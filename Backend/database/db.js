const mysql = require("mysql2");
const path = require('path');

// ហៅ dotenv ឱ្យត្រូវផ្លូវសម្រាប់ Local និង Render
require('dotenv').config({ path: path.join(__dirname, '..', 'database', '.env') });
require('dotenv').config(); 

const db = mysql.createConnection({
  host: process.env.HOST,        // ប្តូរពី DB_HOST មក HOST
  user: process.env.USERNAME,    // ប្តូរពី DB_USER មក USERNAME
  password: process.env.PASSWORD, // ប្តូរពី DB_PASS មក PASSWORD
  database: process.env.DATABASE, // ប្តូរពី DB_NAME មក DATABASE
  port: process.env.PORT || 4000, // TiDB ប្រើ Port 4000
  ssl: {
    rejectUnauthorized: false    // ត្រូវតែមានដើម្បីភ្ជាប់ទៅ TiDB Cloud
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to TiDB Cloud successfully");
  }
});

module.exports = db;