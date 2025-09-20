export default function CrawlForm({ url, setUrl, handleCrawl, loading }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ flex: 1, padding: "0.5rem" }}
      />
      <button onClick={handleCrawl} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Scanning..." : "Crawl"}
      </button>
    </div>
  );
}
