// Safe dotenv load
try {
  require('dotenv').config();
} catch (e) {
  console.warn('⚠️ dotenv not loaded (module missing?). Proceeding with env vars only.');
}

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const { pool, exec, testConnection, resolvedHost } = require("./db");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

// Basic health check
app.get("/", (req, res) => res.send("✅ Backend running"));

// Database health endpoint
app.get("/api/health/db", async (req, res) => {
  try {
    await exec("SELECT 1 AS ok");
    res.json({ ok: true, host: resolvedHost });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, host: resolvedHost });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`ℹ️  DB host resolved to: ${resolvedHost}`);

  // Initial DB connection test
  let attempts = 0;
  const maxAttempts = 5;
  const delay = 2000;

  const tryConnect = () => {
    attempts++;
    testConnection()
      .then((ok) => {
        if (ok) {
          console.log("✅ DB connection established.");
        } else {
          throw new Error("Unknown failure");
        }
      })
      .catch((err) => {
        console.error(`❌ DB connection attempt ${attempts} failed: ${err.message}`);
        if (attempts < maxAttempts) {
          console.log(`⏳ Retrying in ${delay / 1000}s (remaining: ${maxAttempts - attempts})...`);
          setTimeout(tryConnect, delay);
        } else {
          console.error("🚨 All DB connection attempts failed. Verify MySQL is running and credentials are correct.");
        }
      });
  };

  tryConnect();
});
