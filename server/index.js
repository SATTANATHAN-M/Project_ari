const express = require("express");
const cors = require("cors");
const path = require("path");
const { startCrawler } = require("./crawler");
const { computeOverallScore } = require("./scoring");
const { generatePDFReport } = require("./report");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/reports", express.static(path.join(__dirname, "reports")));

app.get("/api/crawl", async (req, res) => {
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
    const pages = await startCrawler(url, Number(concurrency), sendProgress);
    const score = computeOverallScore(pages);
    const pdfPath = `/reports/report_${Date.now()}.pdf`;
    await generatePDFReport(pages, path.join(__dirname, pdfPath));

    // send final result
    res.write(`data: ${JSON.stringify({ finished: true, pages, score, pdfPath })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message || "Failed to crawl" })}\n\n`);
    res.end();
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
