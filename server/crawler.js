// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());
// async function crawl(url) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   await page.goto(url, { waitUntil: 'domcontentloaded' });

//   const title = await page.title();
//   const links = await page.$$eval('a', anchors => anchors.map(a => a.href));

//   await browser.close();

//   return { title, links };
// }

// module.exports = crawl;
// crawler.js
// crawler.js
// crawler.js
const { Cluster } = require("puppeteer-cluster");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { AxePuppeteer } = require("@axe-core/puppeteer");

puppeteer.use(StealthPlugin());

// keep only internal links of the same host, and normalize them
function getInternalLinks(baseUrl, links) {
  const baseHost = new URL(baseUrl).hostname;
  return links
    .map((link) => {
      try { return new URL(link, baseUrl).href; } catch { return null; }
    })
    .filter((href) => href && new URL(href).hostname === baseHost);
}

async function startCrawler(startUrl, maxDepth = 2, maxPages = 100, concurrency = 4) {
  const visited = new Set();
  const results = [];
  let pagesCrawled = 0;

  const cluster = await Cluster.launch({
    puppeteer,
    concurrency: Cluster.CONCURRENCY_CONTEXT, // fast + isolated contexts
    maxConcurrency: concurrency,
    timeout: 60 * 1000,
    puppeteerOptions: { headless: true, args: ["--no-sandbox"] },
  });

  await cluster.task(async ({ page, data }) => {
    const { url, depth } = data;

    if (visited.has(url) || depth > maxDepth || pagesCrawled >= maxPages) return;
    visited.add(url);
    pagesCrawled++;

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      const title = await page.title();

      // collect links on page
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
      const internalLinks = getInternalLinks(url, hrefs);

      // queue deeper links
      if (depth < maxDepth) {
        for (const next of internalLinks) {
          if (!visited.has(next) && pagesCrawled < maxPages) {
            cluster.queue({ url: next, depth: depth + 1 });
          }
        }
      }

      // run axe-core
      const axe = new AxePuppeteer(page);
      const axeResults = await axe.analyze();

      // trim the payload to essentials for UI
      const violations = axeResults.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.slice(0, 5).map((n) => ({
          target: n.target,
          html: n.html,
          failureSummary: n.failureSummary,
        })),
      }));

      results.push({
        url,
        depth,
        title,
        links: internalLinks,
        counts: {
          violations: axeResults.violations.length,
          passes: axeResults.passes?.length || 0,
          incomplete: axeResults.incomplete?.length || 0,
          inapplicable: axeResults.inapplicable?.length || 0,
        },
        violations,
      });

      console.log(`✅ ${url} (d=${depth}) → ${violations.length} violations`);
    } catch (err) {
      console.error(`❌ ${url}:`, err.message);
      results.push({ url, depth, title: null, links: [], error: err.message, counts: { violations: 0 } });
    }
  });

  cluster.queue({ url: startUrl, depth: 0 });

  await cluster.idle();
  await cluster.close();

  return results;
}

module.exports = { startCrawler };


