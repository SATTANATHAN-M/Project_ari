// ScoreCard.js
import { computeOverallScore } from "../util/computeOverallScore";

export default function ScoreCard({ pages }) {
  if (!pages || pages.length === 0) return null;

  const score = computeOverallScore(pages);
  const color = score >= 80 ? "#4CAF50" : score >= 50 ? "#FF9800" : "#F44336";
  const bgColor = score >= 80 ? "rgba(76, 175, 80, 0.1)" : score >= 50 ? "rgba(255, 152, 0, 0.1)" : "rgba(244, 67, 54, 0.1)";
  const borderColor = score >= 80 ? "rgba(76, 175, 80, 0.3)" : score >= 50 ? "rgba(255, 152, 0, 0.3)" : "rgba(244, 67, 54, 0.3)";

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "3rem 2.5rem", // Increased padding
        borderRadius: "24px", // Larger border radius
        border: "2px solid rgba(107, 142, 35, 0.3)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,251,245,0.9) 100%)",
        textAlign: "center",
        color: "#2F4F2F",
        fontFamily: "'Inter', 'Playfair Display', serif",
        boxShadow: "0 16px 40px rgba(107, 142, 35, 0.12)", // Enhanced shadow
        position: "relative",
        overflow: "hidden",
        minHeight: "500px", // Set minimum height for expansion
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* Decorative background pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(45deg, rgba(154, 205, 50, 0.02) 0%, rgba(107, 142, 35, 0.03) 100%)",
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
        borderRadius: "24px 24px 0 0"
      }} />

      {/* Header Section */}
      <div>
        <h2 style={{ 
          marginBottom: "2rem", // Increased margin
          color: "#556B2F",
          fontSize: "1.5rem", // Larger font size
          fontWeight: "600",
          background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 50%, #808000 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Overall Accessibility Score
        </h2>
      </div>

      {/* Main Score Section - Expanded */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Circular progress indicator - Larger */}
        <div style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2.5rem", // Increased margin
          alignSelf: "center"
        }}>
          <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}> {/* Larger SVG */}
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="75" // Larger radius
              fill="none"
              stroke="rgba(107, 142, 35, 0.1)"
              strokeWidth="12" // Thicker stroke
            />
            {/* Progress circle */}
            <circle
              cx="90"
              cy="90"
              r="75"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 75}`} // Updated for new radius
              strokeDashoffset={`${2 * Math.PI * 75 * (1 - score / 100)}`}
              strokeLinecap="round"
              style={{ 
                transition: "stroke-dashoffset 1.2s ease-in-out",
                filter: "drop-shadow(0 0 6px rgba(107, 142, 35, 0.4))"
              }}
            />
          </svg>
          <div style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div
              style={{
                fontSize: "3rem", // Larger score text
                fontWeight: "bold",
                color,
                lineHeight: 1
              }}
            >
              {score}%
            </div>
            <div style={{
              fontSize: "1rem", // Larger label text
              color: "#6B8E23",
              fontWeight: "600",
              marginTop: "0.3rem",
              letterSpacing: "0.1em"
            }}>
              SCORE
            </div>
          </div>
        </div>

        {/* Status message - Enhanced */}
        <div style={{
          background: bgColor,
          border: `2px solid ${borderColor}`, // Thicker border
          borderRadius: "20px", // Larger border radius
          padding: "1.8rem 2rem", // Increased padding
          fontSize: "1.1rem", // Larger font
          fontWeight: "500",
          color: "#556B2F",
          lineHeight: "1.5",
          marginBottom: "2rem" // Added margin
        }}>
          {score >= 80 ? (
            <div>
              <span style={{ fontSize: "1.5rem", marginRight: "0.8rem" }}>🎉</span>
              <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Excellent Achievement!</div>
              <div style={{ fontSize: "0.95rem", opacity: 0.8 }}>
                Your site meets high accessibility standards and provides an inclusive experience for all users.
              </div>
            </div>
          ) : score >= 50 ? (
            <div>
              <span style={{ fontSize: "1.5rem", marginRight: "0.8rem" }}>⚠️</span>
              <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Good Progress Made</div>
              <div style={{ fontSize: "0.95rem", opacity: 0.8 }}>
                Your site shows solid accessibility foundations, but some improvements are needed for full compliance.
              </div>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: "1.5rem", marginRight: "0.8rem" }}>🚨</span>
              <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Critical Issues Detected</div>
              <div style={{ fontSize: "0.95rem", opacity: 0.8 }}>
                Significant accessibility barriers exist that prevent users from accessing your content effectively.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Section - Enhanced Grid */}
      <div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem", // Increased gap
          marginTop: "1rem"
        }}>
          <div style={{
            background: "rgba(154, 205, 50, 0.1)",
            padding: "1.5rem 1rem", // Increased padding
            borderRadius: "16px", // Larger border radius
            border: "2px solid rgba(154, 205, 50, 0.3)", // Thicker border
            boxShadow: "0 4px 15px rgba(154, 205, 50, 0.1)", // Added shadow
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(154, 205, 50, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(154, 205, 50, 0.1)";
          }}>
            <div style={{ 
              fontSize: "2rem", // Larger stat number
              fontWeight: "bold", 
              color: "#556B2F",
              marginBottom: "0.5rem"
            }}>
              {pages.length}
            </div>
            <div style={{ 
              fontSize: "0.9rem", // Slightly larger label
              color: "#6B8E23",
              fontWeight: "500"
            }}>
              Pages Tested
            </div>
          </div>
          
          <div style={{
            background: "rgba(107, 142, 35, 0.1)",
            padding: "1.5rem 1rem", // Increased padding
            borderRadius: "16px", // Larger border radius
            border: "2px solid rgba(107, 142, 35, 0.3)", // Thicker border
            boxShadow: "0 4px 15px rgba(107, 142, 35, 0.1)", // Added shadow
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(107, 142, 35, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(107, 142, 35, 0.1)";
          }}>
            <div style={{ 
              fontSize: "2rem", // Larger stat number
              fontWeight: "bold", 
              color: "#556B2F",
              marginBottom: "0.5rem"
            }}>
              {pages.reduce((sum, page) => sum + (page.counts?.violations || 0), 0)}
            </div>
            <div style={{ 
              fontSize: "0.9rem", // Slightly larger label
              color: "#6B8E23",
              fontWeight: "500"
            }}>
              Total Issues
            </div>
          </div>
        </div>

        {/* Additional insight section */}
        <div style={{
          marginTop: "2rem",
          padding: "1.2rem",
          background: "rgba(255, 255, 255, 0.4)",
          borderRadius: "16px",
          border: "1px solid rgba(107, 142, 35, 0.2)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            fontSize: "0.9rem",
            color: "#6B8E23",
            lineHeight: "1.4",
            textAlign: "left"
          }}>
            <strong style={{ color: "#556B2F" }}>Quick Insights:</strong><br/>
            • Average issues per page: {pages.length > 0 ? Math.round(pages.reduce((sum, page) => sum + (page.counts?.violations || 0), 0) / pages.length * 10) / 10 : 0}<br/>
            • Most common issues require {score >= 80 ? "minor" : score >= 50 ? "moderate" : "significant"} attention<br/>
            • Estimated fix time: {score >= 80 ? "1-2 hours" : score >= 50 ? "4-8 hours" : "1-2 days"}
          </div>
        </div>
      </div>
    </div>
  );
}