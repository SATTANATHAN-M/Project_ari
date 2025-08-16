// index.js
const express = require("express");
const cors = require("cors");
const { startCrawler } = require("./crawler");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/crawl", async (req, res) => {
  const {
    url,
    maxDepth = 2,
    maxPages = 100,
    concurrency = 4,
  } = req.body || {};

  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const result = await startCrawler(url, Number(maxDepth), Number(maxPages), Number(concurrency));
    res.json(result); // array of page results
  } catch (err) {
    console.error("Crawl error:", err);
    res.status(500).json({ error: "Failed to crawl" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
