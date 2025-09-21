// client/src/components/ProgressBar.jsx
export default function ProgressBar({ current, total }) {
  const percent = Math.min(100, Math.round((current / total) * 100));
  return (
    <div style={{ background: "#eee", borderRadius: 8, overflow: "hidden", margin: "1rem 0" }}>
      <div
        style={{
          width: `${percent}%`,
          background: "#4caf50",
          height: 20,
          transition: "width 0.3s",
        }}
      />
      <p style={{ textAlign: "center", margin: 0 }}>{current} / {total} pages</p>
    </div>
  );
}
