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

// Helper to get line/column of element in DOM
// Helper to approximate line/column in the DOM
// Helper to get a unique CSS path and approximate line/column
async function getNodeLocation(page, selector) {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { line: null, column: null, path: null };

    // Generate a unique CSS path for the element
    function cssPath(element) {
      if (!(element instanceof Element)) return '';
      const path = [];
      while (element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        if (element.id) selector += `#${element.id}`;
        else {
          const sib = Array.from(element.parentNode.children).filter(
            (s) => s.nodeName === element.nodeName
          );
          if (sib.length > 1) {
            selector += `:nth-of-type(${Array.from(element.parentNode.children).indexOf(element) + 1})`;
          }
        }
        path.unshift(selector);
        element = element.parentNode;
      }
      return path.join(' > ');
    }

    // Approximate line/column: find element's outerHTML position in document
    const html = document.documentElement.outerHTML;
    const outer = el.outerHTML;
    const index = html.indexOf(outer);
    let line = null, column = null;
    if (index !== -1) {
      const linesUpTo = html.slice(0, index).split("\n");
      line = linesUpTo.length;
      column = linesUpTo[linesUpTo.length - 1].length + 1;
    }

    return {
      line,
      column,
      path: cssPath(el),
    };
  }, selector);
}



/**
 * startCrawler
 * @param {string} startUrl
 * @param {number} concurrency
 * @param {function} onProgress optional callback({ current, total, errors })
 * @param {boolean} singlePage whether to crawl only the start URL
 */
async function startCrawler(startUrl, concurrency = 4, onProgress, singlePage = false) {
  const visited = new Set();
  const inProgress = new Set();
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
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: { width: 1366, height: 768 },
    },
  });

  const queueUrl = (url) => {
    if (!visited.has(url) && !inProgress.has(url)) {
      inProgress.add(url);
      totalQueued++;
      cluster.queue({ url });
      if (onProgress) onProgress({ current: pagesCrawled, total: totalQueued, errors });
    }
  };

  cluster.task(async ({ page, data }) => {
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
        if (["image", "media", "font", "stylesheet"].includes(req.resourceType())) req.abort();
        else req.continue();
      });

      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
      page.setDefaultNavigationTimeout(60000);

      let resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

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
      await sleep(1500);

      title = await page.title().catch(() => null);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href"))).catch(() => []);
      internalLinks = getInternalLinks(url, hrefs);

      if (!singlePage) internalLinks.forEach(queueUrl);

      // --- AXE analysis
      let axeResults;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          axeResults = await new AxePuppeteer(page).options({ iframes: false }).analyze();
          break;
        } catch (e) {
          if (attempt === 3) throw e;
          await sleep(1500);
        }
      }

      counts = {
        violations: axeResults.violations?.length || 0,
        passes: axeResults.passes?.length || 0,
        incomplete: axeResults.incomplete?.length || 0,
        inapplicable: axeResults.inapplicable?.length || 0,
      };

      // --- Map violations with line/column
      violations = await Promise.all(
        (axeResults.violations || []).map(async (v) => {
          const nodes = await Promise.all(
            (v.nodes || []).slice(0, 5).map(async (n) => {
              let location = { line: null, column: null };
              try {
                if (n.target?.[0]) {
                  location = await getNodeLocation(page, n.target[0]);
                }
              } catch {}
              return {
                target: n.target,
                html: n.html,
                failureSummary: n.failureSummary,
                location,
              };
            })
          );
          return {
            id: v.id,
            impact: v.impact,
            description: v.description,
            helpUrl: v.helpUrl,
            nodes,
          };
        })
      );

      console.log(`✅ ${url} → ${counts.violations} violations`);
    } catch (e) {
      error = e?.message || String(e);
      console.error(`❌ ${url}: ${error}`);
      errors++;
    } finally {
      pagesCrawled++;
      inProgress.delete(url);
      results.push({ url, title, links: internalLinks, counts, violations, error });

      if (onProgress) onProgress({ current: pagesCrawled, total: totalQueued, errors });

      console.log(`[${pagesCrawled}/${totalQueued}] Workers: ${cluster.workers.map(w => w.idle ? "IDLE" : "BUSY").join(", ")}`);
    }
  });

  queueUrl(startUrl);
  await cluster.idle();
  await cluster.close();

  console.log(`\n🌍 Finished crawl: ${pagesCrawled} total pages`);
  return results;
}

module.exports = { startCrawler };
