import React from "react";
import { computeOverallScore } from "../util/computeOverallScore"; // adjust path if needed

export default function ScoreCard({ pages }) {
  if (!pages || pages.length === 0) return null;

  const score = computeOverallScore(pages);

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "20px",
        borderRadius: "12px",
        background: "#f5f7fa",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: 10 }}>Overall Accessibility Score</h2>
      <div
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: score >= 80 ? "green" : score >= 50 ? "orange" : "red",
        }}
      >
        {score}%
      </div>
      <p>
        {score >= 80
          ? "✅ Great! Your site is mostly accessible."
          : score >= 50
          ? "⚠️ Needs improvement in accessibility."
          : "❌ Accessibility issues are critical. Fix urgently."}
      </p>
    </div>
  );
}
