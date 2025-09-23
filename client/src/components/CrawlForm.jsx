
// CrawlForm.js
export default function CrawlForm({ url, setUrl, handleCrawl, loading, largeInput, compact }) {
  return (
    <div style={{ 
      display: "flex", 
      gap: compact ? "0.5rem" : "1rem", 
      marginBottom: compact ? "0.5rem" : "1rem",
      alignItems: "center"
    }}>
      <input
        type="text"
        placeholder={compact ? "URL..." : "Enter website URL to audit..."}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && handleCrawl()}
        style={{
          flex: 1,
          padding: largeInput ? "16px 20px" : compact ? "8px 12px" : "12px 16px",
          fontSize: largeInput ? "18px" : compact ? "14px" : "16px",
          border: "2px solid #000000",
          borderRadius: compact ? "8px" : "12px",
          background: "rgba(255, 255, 255, 0.9)",
          color: "#000000",
          fontFamily: "'Inter', 'Playfair Display', serif",
          fontWeight: "500",
          outline: "none",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#2F4F2F";
          e.target.style.boxShadow = "0 0 0 3px rgba(47, 79, 47, 0.2)";
          e.target.style.background = "rgba(255, 255, 255, 1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#000000";
          e.target.style.boxShadow = "none";
          e.target.style.background = "rgba(255, 255, 255, 0.9)";
        }}
      />
      <button
        onClick={handleCrawl}
        disabled={loading || !url.trim()}
        style={{
          padding: largeInput ? "16px 32px" : compact ? "8px 16px" : "12px 24px",
          fontSize: largeInput ? "18px" : compact ? "14px" : "16px",
          borderRadius: compact ? "8px" : "12px",
          border: "none",
          background: loading || !url.trim() 
            ? "linear-gradient(135deg, #ccc, #999)" 
            : "linear-gradient(135deg, #9ACD32, #6B8E23)",
          color: "white",
          cursor: loading || !url.trim() ? "not-allowed" : "pointer",
          fontFamily: "'Inter', 'Playfair Display', serif",
          fontWeight: "600",
          transition: "all 0.3s ease",
          boxShadow: loading || !url.trim() 
            ? "none" 
            : "0 4px 15px rgba(107, 142, 35, 0.3)",
          position: "relative",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          if (!loading && url.trim()) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(107, 142, 35, 0.4)";
            e.target.style.background = "linear-gradient(135deg, #8BC34A, #556B2F)";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && url.trim()) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(107, 142, 35, 0.3)";
            e.target.style.background = "linear-gradient(135deg, #9ACD32, #6B8E23)";
          }
        }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "16px",
              height: "16px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            {compact ? "..." : "Auditing..."}
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {compact ? "Audit" : "Start Audit"}
          </span>
        )}
      </button>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}