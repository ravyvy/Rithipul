const jwt = require("jsonwebtoken");
const path = require("path");

// 🔴 ហៅ dotenv ឱ្យចំទីតាំង .env ក្នុង folder database
require('dotenv').config({ path: path.join(__dirname, '..', 'database', '.env') });

// 🔴 ប្តូរពីការសរសេរអក្សរផ្ទាល់ មកជាការហៅពី process.env
const SECRET_KEY = process.env.SECRET_KEY;
const validate_token = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  };
};

module.exports = { validate_token };
