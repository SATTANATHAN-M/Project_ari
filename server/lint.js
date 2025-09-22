// server/lint.js
const fs = require("fs");
const path = require("path");
const { ESLint } = require("eslint");

async function runLint(projectPath) {
  const srcFolder = fs.existsSync(path.join(projectPath, "src"))
    ? path.join(projectPath, "src")
    : projectPath;

  console.log("Linting folder:", srcFolder);

  const eslint = new ESLint({
    fix: true,
    overrideConfigFile: path.join(__dirname, "eslint.config.cjs"),
    ignore: true,
  });

  const results = await eslint.lintFiles([`${srcFolder}/**/*.{js,jsx,ts,tsx}`]);
  await ESLint.outputFixes(results);

  // ✅ Format only files with non-empty messages
  return results
    .map((r) => ({
      file: path.relative(projectPath, r.filePath),
      messages: r.messages.map((m) => ({
        line: m.line,
        column: m.column,
        rule: m.ruleId,
        message: m.message,
        suggestions: m.suggestions?.map((s) => s.desc) || [],
      })),
    }))
    .filter((f) => f.messages.length > 0); // <-- keep only with issues
}

module.exports = { runLint };

if (require.main === module) {
  const testFolder = path.join(__dirname, "temp/1758554080617");
  runLint(testFolder)
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch((err) => console.error(err));
}
