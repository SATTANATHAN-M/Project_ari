const express = require("express");
const cors = require("cors");
const path = require("path");
const { startCrawler } = require("./crawler");
const { computeOverallScore } = require("./scoring");
const { generatePDFReport } = require("./report");

const app = express();
app.use(cors());
app.use(express.json());

// Serve reports folder
app.use("/reports", express.static(path.join(__dirname, "reports")));

app.post("/api/crawl", async (req, res) => {
  const { url, concurrency = 4 } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const pages = await startCrawler(url, Number(concurrency));
    const score = computeOverallScore(pages);
    const pdfPath = path.join(__dirname, "reports", `report_${Date.now()}.pdf`);

    try {
      await generatePDFReport(pages, pdfPath);
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
    }

    res.json({ pages, score, pdfPath: `/reports/${path.basename(pdfPath)}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to crawl" });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
