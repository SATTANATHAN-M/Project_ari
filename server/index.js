// server/index.js
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import axe from "axe-core";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Crawl and run axe-core accessibility tests on pages
 * Adds CSP bypass via --disable-web-security
 */
async function crawlAndAudit(url, maxDepth = 2, visited = new Set(), depth = 0) {
  if (depth > maxDepth || visited.has(url)) return [];
  visited.add(url);

  const browser = await puppeteer.launch({
    headless: false, // headless can cause issues with dynamic content
    args: [
      "--disable-web-security", // bypass CSP / TrustedHTML
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });
  const page = await browser.newPage();

  let results = [];

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });

    // Write axe-core script to temp file if not exists
    const axePath = path.join(process.cwd(), "axe.min.js");
    if (!fs.existsSync(axePath)) {
      fs.writeFileSync(axePath, axe.source);
    }

    // Inject axe-core from file (avoids TrustedHTML issues)
    await page.addScriptTag({ path: axePath });

    // Run axe-core inside page
    const axeResults = await page.evaluate(async () => {
      return await window.axe.run();
    });

    results.push({
      url,
      issues: axeResults.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map(n => n.html),
      })),
    });

    // Extract internal links
    const links = await page.$$eval("a[href]", anchors =>
      anchors.map(a => a.href).filter(href => href.startsWith(window.location.origin))
    );

    for (const link of links) {
      const childResults = await crawlAndAudit(link, maxDepth, visited, depth + 1);
      results = results.concat(childResults);
    }

  } catch (err) {
    console.error("Error crawling:", url, err.message);
  } finally {
    await browser.close();
  }

  return results;
}

// API endpoint
app.post("/api/crawl", async (req, res) => {
  const { url, maxDepth = 1 } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const results = await crawlAndAudit(url, Number(maxDepth));
    res.json(results);
  } catch (err) {
    console.error("Crawl error:", err);
    res.status(500).json({ error: "Failed to crawl" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
