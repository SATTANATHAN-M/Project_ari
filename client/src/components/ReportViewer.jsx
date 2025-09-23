// ReportViewer.js
export default function ReportViewer({ pdfPath }) {
  if (!pdfPath) return null;

  return (
    <div
      style={{
        marginBottom: "2rem",
        color: "#2F4F2F",
        fontFamily: "'Inter', 'Playfair Display', serif",
        background: "linear-gradient(135deg, rgba(154, 205, 50, 0.08), rgba(107, 142, 35, 0.05))",
        borderRadius: "20px",
        padding: "2.5rem",
        border: "2px solid rgba(107, 142, 35, 0.25)",
        boxShadow: "0 12px 35px rgba(107, 142, 35, 0.15)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(15px)"
      }}
    >
      {/* Decorative background pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(45deg, rgba(154, 205, 50, 0.03) 0%, rgba(107, 142, 35, 0.05) 100%)",
        zIndex: -1,
      }} />

      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #9ACD32, #6B8E23, #556B2F)",
        borderRadius: "20px 20px 0 0"
      }} />

      {/* PDF Icon */}
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #9ACD32, #6B8E23)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        color: "white",
        margin: "0 auto 1.5rem",
        boxShadow: "0 8px 25px rgba(107, 142, 35, 0.3)",
        border: "3px solid rgba(255, 255, 255, 0.2)"
      }}>
        📄
      </div>

      {/* Title */}
      <h3 style={{
        color: "#556B2F",
        fontSize: "1.4rem",
        fontWeight: "600",
        marginBottom: "1rem",
        background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 50%, #808000 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: "1.3"
      }}>
        Comprehensive Audit Report
      </h3>

      {/* Description */}
      <p style={{
        color: "#6B8E23",
        fontSize: "1rem",
        lineHeight: "1.5",
        marginBottom: "2rem",
        maxWidth: "400px",
        margin: "0 auto 2rem"
      }}>
        Download your detailed PDF report containing complete audit findings, recommendations, and code examples for accessibility improvements.
      </p>

      {/* Download button */}
      <a
        href={`http://localhost:3001${pdfPath}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.8rem",
          color: "white",
          background: "linear-gradient(135deg, #9ACD32, #6B8E23)",
          border: "none",
          padding: "16px 32px",
          borderRadius: "16px",
          textDecoration: "none",
          fontSize: "1rem",
          fontWeight: "600",
          fontFamily: "'Inter', 'Playfair Display', serif",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 8px 25px rgba(107, 142, 35, 0.3)",
          position: "relative",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-3px) scale(1.02)";
          e.target.style.boxShadow = "0 12px 35px rgba(107, 142, 35, 0.4)";
          e.target.style.background = "linear-gradient(135deg, #8BC34A, #556B2F)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0) scale(1)";
          e.target.style.boxShadow = "0 8px 25px rgba(107, 142, 35, 0.3)";
          e.target.style.background = "linear-gradient(135deg, #9ACD32, #6B8E23)";
        }}
      >
        {/* Button icon */}
        <div style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px"
        }}>
          📥
        </div>
        
        <span>Download PDF Report</span>
        
        {/* Button shine effect */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          animation: "buttonShine 3s infinite"
        }} />
      </a>

      {/* Additional info */}
      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        background: "rgba(255, 255, 255, 0.4)",
        borderRadius: "12px",
        border: "1px solid rgba(107, 142, 35, 0.2)"
      }}>
        <p style={{
          fontSize: "0.85rem",
          color: "#6B8E23",
          margin: 0,
          lineHeight: "1.4"
        }}>
          <strong>Report includes:</strong> WCAG compliance analysis, issue prioritization, code examples, and step-by-step remediation guides
        </p>
      </div>

      <style>
        {`
          @keyframes buttonShine {
            0% { left: -100%; }
            50% { left: -50%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  );
}