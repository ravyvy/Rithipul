const db = require("../database/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path');
// ដោយសារ admin.controler.js នៅក្នុង folder controller 
// យើងត្រូវថយក្រោយមួយជំហាន (..) រួចចូលទៅ folder database
require('dotenv').config({ path: path.join(__dirname, '..', 'database', '.env') });

const SECRET_KEY = process.env.SECRET_KEY; // 🔴 use same everywhere

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const SQL = "SELECT * FROM admin_login WHERE username = ?";
    const [result] = await db.promise().query(SQL, [username]);
    const user = result[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successfully",
      token
    });

  } catch (e) {
    res.status(500).json({ message: "Login error", error: e.message });
  }
};
const create = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ❗ 1. Check username duplicate
    const [exists] = await db.promise().query(
      "SELECT id FROM admin_login WHERE username = ?",
      [username]
    );
    if (exists.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // ❗ 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ❗ 3. Insert
    await db.promise().query(
      "INSERT INTO admin_login (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.json({
      message: "Admin created successfully",
      username
    });

  } catch (e) {
    res.status(500).json({ message: "Create admin error", error: e.message });
  }
};

module.exports = { login , create };
