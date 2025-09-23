// ProgressBar.js
export default function ProgressBar({ current, total }) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(154, 205, 50, 0.08), rgba(107, 142, 35, 0.05))",
        borderRadius: "20px",
        overflow: "hidden",
        margin: "1.5rem 0",
        border: "2px solid rgba(107, 142, 35, 0.25)",
        boxShadow: "0 8px 25px rgba(107, 142, 35, 0.12)",
        position: "relative",
        backdropFilter: "blur(10px)"
      }}
    >
      {/* Progress bar container */}
      <div style={{
        padding: "6px",
        background: "rgba(255, 255, 255, 0.3)"
      }}>
        <div
          style={{
            width: `${percent}%`,
            background: "linear-gradient(135deg, #9ACD32 0%, #6B8E23 50%, #556B2F 100%)",
            height: "16px",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "14px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(107, 142, 35, 0.3)"
          }}
        >
          {/* Animated shimmer effect */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            animation: percent < 100 ? "shimmer 2.5s infinite" : "none"
          }} />
          
          {/* Highlight overlay */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)",
            borderRadius: "14px 14px 0 0"
          }} />
        </div>
      </div>
      
      {/* Status text */}
      <div
        style={{
          textAlign: "center",
          padding: "1rem 1.5rem",
          color: "#556B2F",
          fontFamily: "'Inter', 'Playfair Display', serif",
          fontSize: "0.95rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.8rem",
          background: "rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Progress percentage with gradient text */}
        <div style={{
          background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "700",
          fontSize: "1.1rem"
        }}>
          {percent}%
        </div>
        
        {/* Separator */}
        <div style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#6B8E23"
        }} />
        
        {/* Page counter */}
        <span style={{ color: "#6B8E23" }}>
          {current} of {total} pages scanned
        </span>
        
        {/* Loading spinner for active progress */}
        {percent < 100 && (
          <div style={{
            width: "18px",
            height: "18px",
            border: "2px solid rgba(107, 142, 35, 0.2)",
            borderTop: "2px solid #6B8E23",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginLeft: "0.5rem"
          }} />
        )}
        
        {/* Completion checkmark */}
        {percent === 100 && (
          <div style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)"
          }}>
            ✓
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { left: -100%; }
            50% { left: -50%; }
            100% { left: 100%; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}