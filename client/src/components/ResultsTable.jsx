export default function ResultsTable({ result }) {
  return (
    <div>
      <h2>Pages Scanned: {result.pages.length}</h2>
      {result.pages.map((page, i) => (
        <div key={i} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <h3>{page.title || "(No title)"} — <a href={page.url} target="_blank" rel="noreferrer">{page.url}</a></h3>
          <p>Violations: {page.counts?.violations || 0}</p>
          {page.error && <p style={{ color: "red" }}>Error: {page.error}</p>}
          {page.violations?.length > 0 && (
            <details>
              <summary>View violations</summary>
              <ul>
                {page.violations.map((v, idx) => (
                  <li key={idx}>{v.id} ({v.impact}) — {v.description}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
