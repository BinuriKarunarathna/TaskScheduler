const express = require("express");
const { pool } = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  const { username, password } = req.body; // plain text password

  pool.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password], // save password as is
    (err) => {
      if (err) {
        console.error("MySQL Error:", err);
        // Duplicate username
        if (err && err.code === 'ER_DUP_ENTRY') {
          return res.status(409).send("❌ Username already exists");
        }
        return res.status(500).send("❌ Error registering user");
      }
      res.send("✅ User registered successfully!");
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  pool.query("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, results) => {
    if (err || results.length === 0) 
      return res.status(401).send("❌ Invalid username or password");

    res.send("✅ Login success!");
  });
});

module.exports = router;
