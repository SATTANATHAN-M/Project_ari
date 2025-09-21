import React, { useState } from "react";
import CrawlForm from "./components/CrawlForm";
import ProgressBar from "./components/ProgressBar";
import ResultsTable from "./components/ResultsTable";
import ReportViewer from "./components/ReportViewer";
import ScoreCard from "./components/ScoreCard";

export default function App() {
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCrawl = () => {
    if (!url) return;

    setLoading(true);
    setProgress({ current: 0, total: 1 });
    setResult(null);

    const source = new EventSource(`http://localhost:3001/api/crawl?url=${encodeURIComponent(url)}`);

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.finished) {
        setResult(data);
        setProgress({ current: data.pages.length, total: data.pages.length });
        setLoading(false);
        source.close();
      } else if (data.error) {
        setResult({ error: data.error });
        setLoading(false);
        source.close();
      } else {
        setProgress({ current: data.current, total: data.total });
      }
    };

    source.onerror = () => {
      source.close();
      setLoading(false);
    };
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Accessibility Crawler</h1>
      <CrawlForm url={url} setUrl={setUrl} handleCrawl={handleCrawl} loading={loading} />
      {loading && <ProgressBar current={progress.current} total={progress.total} />}
      {result?.error && <p style={{ color: "red" }}>{result.error}</p>}
      {result?.pages && <ScoreCard pages={result.pages} />}
      {result?.pages && (
        <>
          <ReportViewer pdfPath={result.pdfPath} />
          <ResultsTable result={result} />
        </>
      )}
    </div>
  );
}
