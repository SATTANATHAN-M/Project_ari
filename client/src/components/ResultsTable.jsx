// ResultsTable.js
export default function ResultsTable({ result }) {
  return (
    <div
      style={{
        color: "#2F4F2F",
        fontFamily: "'Inter', 'Playfair Display', serif",
      }}
    >
      <h2 style={{
        color: "#556B2F",
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "1.5rem",
        textAlign: "center",
        background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 50%, #808000 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        Pages Scanned: {result.pages.length}
      </h2>

      {result.pages.map((page, i) => (
        <div
          key={i}
          style={{
            border: "2px solid rgba(107, 142, 35, 0.3)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,251,245,0.8) 100%)",
            boxShadow: "0 8px 25px rgba(107, 142, 35, 0.1)",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 35px rgba(107, 142, 35, 0.15)";
            e.target.style.borderColor = "rgba(107, 142, 35, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 25px rgba(107, 142, 35, 0.1)";
            e.target.style.borderColor = "rgba(107, 142, 35, 0.3)";
          }}
        >
          {/* Decorative accent */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #9ACD32, #6B8E23, #556B2F)",
            borderRadius: "16px 16px 0 0"
          }} />

          <h3 style={{
            color: "#556B2F",
            fontSize: "1.2rem",
            fontWeight: "600",
            marginBottom: "0.8rem",
            lineHeight: "1.4"
          }}>
            {page.title || "(No title)"} —{" "}
            <a
              href={page.url}
              target="_blank"
              rel="noreferrer"
              style={{ 
                color: "#6B8E23", 
                textDecoration: "none",
                borderBottom: "2px solid rgba(107, 142, 35, 0.3)",
                transition: "all 0.2s ease",
                fontSize: "0.9em"
              }}
              onMouseEnter={(e) => {
                e.target.style.borderBottomColor = "#6B8E23";
                e.target.style.color = "#556B2F";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottomColor = "rgba(107, 142, 35, 0.3)";
                e.target.style.color = "#6B8E23";
              }}
            >
              {page.url}
            </a>
          </h3>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <div style={{
              background: page.counts?.violations > 0 
                ? "linear-gradient(135deg, rgba(255, 99, 99, 0.1), rgba(255, 160, 122, 0.1))"
                : "linear-gradient(135deg, rgba(154, 205, 50, 0.1), rgba(107, 142, 35, 0.1))",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: `1px solid ${page.counts?.violations > 0 ? "rgba(255, 99, 99, 0.3)" : "rgba(154, 205, 50, 0.3)"}`,
              fontSize: "0.9rem",
              fontWeight: "500",
              color: page.counts?.violations > 0 ? "#cc5555" : "#556B2F"
            }}>
              🔍 Violations: {page.counts?.violations || 0}
            </div>
          </div>

          {page.error && (
            <div style={{ 
              color: "#cc5555",
              background: "rgba(255, 99, 99, 0.1)",
              padding: "0.8rem",
              borderRadius: "12px",
              border: "1px solid rgba(255, 99, 99, 0.3)",
              marginBottom: "1rem",
              fontSize: "0.9rem"
            }}>
              ⚠️ Error: {page.error}
            </div>
          )}

          {page.violations?.length > 0 && (
            <details style={{ marginTop: "1rem" }}>
              <summary style={{
                cursor: "pointer",
                fontWeight: "600",
                color: "#556B2F",
                padding: "0.8rem",
                background: "rgba(107, 142, 35, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(107, 142, 35, 0.2)",
                marginBottom: "1rem",
                transition: "all 0.2s ease",
                outline: "none"
              }}>
                📋 View runtime violations ({page.violations.length})
              </summary>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0
              }}>
                {page.violations.map((v, idx) => (
                  <li key={idx} style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    padding: "1rem",
                    marginBottom: "0.8rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(107, 142, 35, 0.2)",
                    boxShadow: "0 2px 8px rgba(107, 142, 35, 0.05)"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem"
                    }}>
                      <strong style={{
                        color: "#556B2F",
                        fontSize: "1rem"
                      }}>
                        {v.id}
                      </strong>
                      <span style={{
                        background: v.impact === "critical" ? "#ff6b6b" : 
                                   v.impact === "serious" ? "#ffa726" :
                                   v.impact === "moderate" ? "#ffeb3b" : "#81c784",
                        color: v.impact === "critical" || v.impact === "serious" ? "white" : "#333",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: "500"
                      }}>
                        {v.impact}
                      </span>
                      <a
                        href={v.helpUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ 
                          color: "#6B8E23",
                          textDecoration: "none",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          border: "1px solid rgba(107, 142, 35, 0.3)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "8px",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(107, 142, 35, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                        }}
                      >
                        📖 Help
                      </a>
                    </div>
                    
                    <p style={{
                      color: "#6B8E23",
                      margin: "0.5rem 0",
                      fontSize: "0.9rem",
                      lineHeight: "1.4"
                    }}>
                      {v.description}
                    </p>

                    {v.nodes?.length > 0 && (
                      <ul style={{
                        marginTop: "0.8rem",
                        listStyle: "none",
                        padding: 0
                      }}>
                        {v.nodes.map((n, nIdx) => (
                          <li key={nIdx} style={{
                            background: "rgba(107, 142, 35, 0.05)",
                            padding: "0.6rem",
                            margin: "0.4rem 0",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            color: "#556B2F",
                            border: "1px solid rgba(107, 142, 35, 0.1)"
                          }}>
                            <div><strong>Target:</strong> {n.target?.join(", ")}</div>
                            <div><strong>Location:</strong> Line {n.location?.line ?? "N/A"}, Column {n.location?.column ?? "N/A"}</div>
                            <div><strong>Issue:</strong> {n.failureSummary}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}