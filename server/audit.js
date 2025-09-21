// backend/audit.js
const { startCrawler } = require("./crawler");
const { computeOverallScore } = require("./scoring");
const { generatePDFReport } = require("./report");
const path = require("path");

async function auditSite(url, concurrency = 4, sendProgress) {
  // 1️⃣ Crawl site
  const pages = await startCrawler(url, concurrency, sendProgress);

  // 2️⃣ Compute score
  const score = computeOverallScore(pages);

  // 3️⃣ Generate PDF
  const pdfPath = `/reports/report_${Date.now()}.pdf`;
  await generatePDFReport(pages, path.join(__dirname, pdfPath));

  // 4️⃣ Return full result
  return {
    finished: true,
    pages,
    score,
    pdfPath,
  };
}

module.exports = { auditSite };
