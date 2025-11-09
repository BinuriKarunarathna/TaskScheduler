// Safe dotenv load (won't crash if module missing temporarily)
try { require('dotenv').config(); } catch (e) { console.warn('⚠️ dotenv not loaded (module missing?). Proceeding with env vars only.'); }
const express = require("express");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const cors = require("cors");
const bodyParser = require("body-parser");
const { pool, exec, testConnection, resolvedHost } = require("./db");
const app = express();

app.use(cors(
  { origin: "*" }
)); // ✅ allows requests from any origin

app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

app.get("/", (req, res) => res.send("✅ Backend running"));

// Optional: DB health endpoint to manually verify connectivity
app.get('/api/health/db', async (req, res) => {
  try {
    await exec('SELECT 1 AS ok');
    res.json({ ok: true, host: resolvedHost });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, host: resolvedHost });
  }
});

// Start server
const PORT = 5000;
// Removed duplicate require of db (already imported components above)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);

  // Quick DB smoke-test so startup shows connectivity status
  console.log(`ℹ️  DB host resolved to: ${resolvedHost}`);
  console.log(`ℹ️  Attempting initial DB connection (host=${resolvedHost})`);

  // Retry mechanism
  let attempts = 0;
  const maxAttempts = 5;
  const attemptDelayMs = 2000;

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
          console.log(`⏳ Retrying in ${attemptDelayMs / 1000}s (remaining attempts: ${maxAttempts - attempts})...`);
          setTimeout(tryConnect, attemptDelayMs);
        } else {
          console.error("🚨 All DB connection attempts failed. Verify MySQL is running and credentials are correct.");
        }
      });
  };

  tryConnect();
});
