export default function ReportViewer({ pdfPath }) {
  if (!pdfPath) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <h3>PDF Report</h3>
      <a href={`http://localhost:3001${pdfPath}`} target="_blank" rel="noreferrer">Download/View PDF</a>
    </div>
  );
}
