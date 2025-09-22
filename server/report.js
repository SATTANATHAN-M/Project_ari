// backend/report.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function generatePDFReport(pages, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text("Accessibility Report", { underline: true });
  doc.moveDown();

  pages.forEach((page, i) => {
    doc.fontSize(14).text(`${i + 1}. ${page.title || "(No title)"} — ${page.url}`);
    doc.fontSize(12).text(`Violations: ${page.counts?.violations || 0}`);
    if (page.error) doc.fillColor("red").text(`Error: ${page.error}`).fillColor("black");

   if (page.violations?.length) {
  page.violations.forEach((v) => {
    doc.text(`  - ${v.id} (${v.impact}) — ${v.description}`);
    v.nodes?.forEach((n) => {
      doc.text(`      Target: ${n.target?.join(", ")}`);
      doc.text(`      Line: ${n.location?.line ?? "N/A"}, Column: ${n.location?.column ?? "N/A"}`);
      doc.text(`      Failure: ${n.failureSummary}`);
    });
  });
}


    doc.moveDown();
  });

  doc.end();
  return outputPath;
}
// backend/report.js (append this)
async function generateEslintPDF(eslintResults, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text("ESLint Accessibility Report", { underline: true });
  doc.moveDown();

  eslintResults.forEach((file) => {
    doc.fontSize(14).text(file.filePath);
    if (file.messages.length === 0) {
      doc.fontSize(12).fillColor("green").text("✅ No issues").fillColor("black");
    } else {
      file.messages.forEach((msg) => {
        doc.fontSize(12)
          .fillColor("red")
          .text(`Line ${msg.line}, Col ${msg.column}: ${msg.message} (${msg.ruleId})`)
          .fillColor("black");
      });
    }
    doc.moveDown();
  });

  doc.end();
  return outputPath;
}

module.exports = { generatePDFReport, generateEslintPDF };

