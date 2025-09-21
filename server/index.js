// backend/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const { auditSite } = require("./audit");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/reports", express.static(path.join(__dirname, "reports")));

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

app.listen(3001, () => console.log("✅ Server running at http://localhost:3001"));
