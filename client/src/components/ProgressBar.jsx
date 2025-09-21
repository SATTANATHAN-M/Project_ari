// components/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 5, width: "100%", margin: "10px 0" }}>
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: "#4caf50",
          height: 20,
          borderRadius: 5,
          transition: "width 0.2s",
        }}
      />
      <p style={{ textAlign: "center", margin: 0 }}>
        {current} / {total} pages
      </p>
    </div>
  );
}
