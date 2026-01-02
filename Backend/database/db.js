const mysql = require("mysql2");
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', 'database', '.env') });
require('dotenv').config(); 

const db = mysql.createConnection({
  host: process.env.HOST,        // ត្រូវនឹង Render
  user: process.env.USERNAME,    // ត្រូវនឹង Render
  password: process.env.PASSWORD, // ត្រូវនឹង Render
  database: process.env.DATABASE, // ត្រូវនឹង Render
  port: process.env.DB_PORT || 4000, // ប្រើ DB_PORT ដែលទើបកែ
  ssl: {
    rejectUnauthorized: false    // ត្រូវតែមានដើម្បីភ្ជាប់ទៅ TiDB
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to TiDB Cloud!");
  }
});

module.exports = db;