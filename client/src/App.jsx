import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCrawl = async () => {
    if (!url) return alert("Enter a URL");
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("http://localhost:3001/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, maxDepth: 1 }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Error crawling site");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🌐 Accessibility Scanner</h1>
      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "8px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleCrawl} disabled={loading}>
        {loading ? "Scanning..." : "Scan"}
      </button>

      <div style={{ marginTop: "2rem" }}>
        {results.map((r, i) => (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <h3>{r.url}</h3>
            {r.issues.length === 0 ? (
              <p>✅ No issues found</p>
            ) : (
              <ul>
                {r.issues.map((issue, j) => (
                  <li key={j}>
                    <strong>{issue.id}</strong> ({issue.impact}) - {issue.description}
                    <ul>
                      {issue.nodes.map((node, k) => (
                        <li key={k}>
                          <code>{node}</code>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
