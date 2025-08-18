// server/index.js
// ================================================
// Backend: Crawls a website, runs axe-core checks,
// and serves results to the frontend.
// ================================================

import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import AxePuppeteer from "@axe-core/puppeteer";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Utility function: Run axe-core on a single page
 */
async function analyzePage(page, url) {
  const results = await new AxePuppeteer(page).analyze();

  return {
    url,
    issues: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map((n) => n.html),
    })),
  };
}

/**
 * POST /crawl
 * Body: { url: "https://example.com" }
 */
app.post("/crawl", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`🔍 Crawling: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Run accessibility check
    const report = await analyzePage(page, url);

    res.json(report);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
