const mysql = require("mysql2");
const path = require('path');

// ហៅ dotenv ម្ដងទៀតក្នុង File នេះដើម្បីការពារ error
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL using .env in database folder");
  }
});

module.exports = db;