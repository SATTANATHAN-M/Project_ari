import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null); // array from backend
  const [loading, setLoading] = useState(false);

  const handleCrawl = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const resp = await axios.post("http://localhost:3001/api/crawl", {
        url,
        // optionally allow user controls:
        // maxDepth: 2,
        // maxPages: 100,
        // concurrency: 4,
      });
      setResult(resp.data);
    } catch (e) {
      console.error("Crawl failed:", e);
      setResult({ error: "Failed to crawl the URL" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Accessibility Crawler</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: 420, padding: "0.5rem" }}
        />
        <button onClick={handleCrawl} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Scanning..." : "Crawl"}
        </button>
      </div>

      {loading && <p>Loading…</p>}

      {result && (
        <div style={{ marginTop: "1rem" }}>
          {"error" in result ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : Array.isArray(result) ? (
            <>
              <h2>Pages Scanned: {result.length}</h2>
              {result.map((page, idx) => (
                <div key={idx} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <h3 style={{ margin: 0 }}>
                    {page.title || "(No title)"} —{" "}
                    <a href={page.url} target="_blank" rel="noreferrer">
                      {page.url}
                    </a>{" "}
                    <small>(depth {page.depth})</small>
                  </h3>

                  {page.error && <p style={{ color: "crimson" }}>Error: {page.error}</p>}

                  <p style={{ margin: "6px 0" }}>
                    <strong>Links:</strong> {page.links?.length || 0} |{" "}
                    <strong>Violations:</strong> {page.counts?.violations ?? 0}
                  </p>

                  {page.violations && page.violations.length > 0 && (
                    <details>
                      <summary>View violations</summary>
                      <ul>
                        {page.violations.map((v, i) => (
                          <li key={i} style={{ marginBottom: 8 }}>
                            <strong>{v.id}</strong> ({v.impact}) — {v.description}{" "}
                            {v.helpUrl && (
                              <a href={v.helpUrl} target="_blank" rel="noreferrer">
                                Learn more
                              </a>
                            )}
                            {v.nodes?.length > 0 && (
                              <details style={{ marginTop: 4 }}>
                                <summary>Examples ({v.nodes.length})</summary>
                                <ul>
                                  {v.nodes.map((n, j) => (
                                    <li key={j} style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                                      <div><em>Target:</em> {Array.isArray(n.target) ? n.target.join(" ") : n.target}</div>
                                      <div><em>Snippet:</em> {n.html}</div>
                                      {n.failureSummary && <div><em>Why:</em> {n.failureSummary}</div>}
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p>Unexpected response format.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
