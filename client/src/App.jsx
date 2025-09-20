import React, { useState } from "react";
import CrawlForm from "./components/CrawlForm";
import ResultsTable from "./components/ResultsTable";
import ReportViewer from "./components/ReportViewer";
import axios from "axios";

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCrawl = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const resp = await axios.post("http://localhost:3001/api/crawl", { url });
      setResult(resp.data);
    } catch (err) {
      console.error(err);
      setResult({ error: err.message || "Failed to crawl" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Accessibility Crawler</h1>
      <CrawlForm url={url} setUrl={setUrl} handleCrawl={handleCrawl} loading={loading} />
      {loading && <p>Scanning...</p>}
      {result?.error && <p style={{ color: "red" }}>{result.error}</p>}
      {result && !result.error && (
        <>
          <ReportViewer pdfPath={result.pdfPath} />
          <ResultsTable result={result} />
        </>
      )}
    </div>
  );
}
