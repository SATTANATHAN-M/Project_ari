require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { auditSite } = require("./audit"); // your existing audit logic
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const { runLint } = require("./lint");


const upload = multer({ dest: "uploads/" });
const app = express();

app.use(cors());
app.use(express.json());

app.use("/reports", express.static(path.join(__dirname, "reports")));

// ==================== ZIP Upload & Lint Endpoint ====================
app.post("/api/upload-zip", upload.single("zipfile"), async (req, res) => {
  try {
    const zipPath = req.file.path;
    const extractPath = path.join(__dirname, "temp", Date.now().toString());
    fs.mkdirSync(extractPath, { recursive: true });

    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // Lint all JS/TS files under extracted folder (even nested)
    const lintResults = await runLint(extractPath);

    // Optionally include the files found for debug
    res.json({ results: lintResults, filesFound: lintResults.map(r => r.file) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Linting failed", details: err.message });
  }
});

// ==================== Audit Endpoint (SSE) ====================
app.get("/api/audit", async (req, res) => {
  const { url, concurrency = 4 } = req.query;
  if (!url) return res.status(400).send("URL is required");

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendProgress = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const result = await auditSite(url, Number(concurrency), sendProgress);
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message || "Audit failed" })}\n\n`);
    res.end();
  }
});

// ==================== Start Server ====================
app.listen(3001, () => console.log("✅ Server running at http://localhost:3001"));
