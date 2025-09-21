const { Cluster } = require("puppeteer-cluster");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { AxePuppeteer } = require("@axe-core/puppeteer");

puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getInternalLinks(baseUrl, links) {
  const base = new URL(baseUrl);
  const set = new Set();
  for (const raw of links || []) {
    try {
      const u = new URL(raw, baseUrl);
      if (u.hostname === base.hostname) {
        u.hash = "";
        set.add(u.href);
      }
    } catch {}
  }
  return [...set];
}

/**
 * startCrawler
 * @param {string} startUrl
 * @param {number} concurrency
 * @param {function} onProgress optional callback({ current, total, errors })
 */
async function startCrawler(startUrl, concurrency = 4, onProgress) {
  const visited = new Set();
  const inProgress = new Set(); // tracks URLs being crawled
  const results = [];
  let pagesCrawled = 0;
  let errors = 0;
  let totalQueued = 0;

  const cluster = await Cluster.launch({
    puppeteer,
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: Math.max(1, Number(concurrency) || 4),
    retryLimit: 2,
    retryDelay: 1500,
    timeout: 90 * 1000,
    puppeteerOptions: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      defaultViewport: { width: 1366, height: 768 },
    },
  });

  const queueUrl = (url) => {
    if (!visited.has(url) && !inProgress.has(url)) {
      inProgress.add(url);
      totalQueued++;
      cluster.queue({ url });
      // Update progress whenever a new URL is queued
      if (onProgress) {
        onProgress({ current: pagesCrawled, total: totalQueued, errors });
      }
    }
  };

  await cluster.task(async ({ page, data }) => {
    const { url } = data;
    visited.add(url);

    let title = null;
    let internalLinks = [];
    let counts = { violations: 0, passes: 0, incomplete: 0, inapplicable: 0 };
    let violations = [];
    let error;

    try {
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (["image", "media", "font", "stylesheet"].includes(req.resourceType()))
          req.abort();
        else req.continue();
      });

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
      page.setDefaultNavigationTimeout(60000);

      let resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

      // SPA retry for 404
      if (resp && typeof resp.status === "function" && resp.status() >= 400) {
        await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.evaluate((spaPath) => {
          history.pushState({}, "", spaPath);
          window.dispatchEvent(new Event("popstate"));
        }, new URL(url).pathname);
        await page.waitForSelector("body", { timeout: 10000 });
        await sleep(1500);
      }

      await page.waitForFunction(() => document.readyState === "complete", { timeout: 60000 });
      await page.waitForSelector("body", { timeout: 60000 });
      await sleep(2000);

      title = await page.title().catch(() => null);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href"))).catch(() => []);
      internalLinks = getInternalLinks(url, hrefs);

      for (const link of internalLinks) queueUrl(link);

      // AXE Analysis
      let axeResults;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          axeResults = await new AxePuppeteer(page).options({ iframes: false }).analyze();
          break;
        } catch (e) {
          if (attempt === 3) throw e;
          await sleep(2000);
        }
      }

      counts = {
        violations: axeResults.violations?.length || 0,
        passes: axeResults.passes?.length || 0,
        incomplete: axeResults.incomplete?.length || 0,
        inapplicable: axeResults.inapplicable?.length || 0,
      };

      violations = (axeResults.violations || []).map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: (v.nodes || []).slice(0, 5).map((n) => ({
          target: n.target,
          html: n.html,
          failureSummary: n.failureSummary,
        })),
      }));

      console.log(`✅ ${url} → ${counts.violations} violations`);
    } catch (e) {
      error = e?.message || String(e);
      console.error(`❌ ${url}: ${error}`);
      errors++;
    } finally {
      pagesCrawled++;
      inProgress.delete(url);
      results.push({ url, title, links: internalLinks, counts, violations, error });

      // Progress update
      if (onProgress) {
        onProgress({ current: pagesCrawled, total: totalQueued, errors });
      }
    }
  });

  cluster.queue({ url: startUrl });
  await cluster.idle();
  await cluster.close();

  console.log(`\n🌍 Finished crawl: ${pagesCrawled} total pages`);
  return results;
}

module.exports = { startCrawler };
