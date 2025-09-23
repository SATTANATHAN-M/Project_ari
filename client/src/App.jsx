import React, { useState } from "react";
import { Container, Grid, Paper, Typography, Box, Button } from "@mui/material";
import CrawlForm from "./components/CrawlForm";
import ProgressBar from "./components/ProgressBar";
import ResultsTable from "./components/ResultsTable";
import ScoreCard from "./components/ScoreCard";
import ReportViewer from "./components/ReportViewer";
import ChatBotDock from "./components/ChatBotDock";
import BackgroundBalls from "./components/BackgroundBalls";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";

// Sophisticated Olive & White Glass Theme with Enhanced Input Styling
const glassStyle = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,251,245,0.9) 100%)",
  borderRadius: "28px",
  boxShadow: "0 20px 60px rgba(107, 142, 35, 0.15), 0 8px 25px rgba(85, 107, 47, 0.1)",
  border: "3px solid #000000", // Black border as requested
  padding: "3rem",
  color: "#2F4F2F", // Dark olive green
  fontFamily: "'Inter', 'Playfair Display', serif",
  backdropFilter: "blur(20px)",
  position: "relative",
  overflow: "hidden",
  "& input": {
    color: "#000000 !important", // Black text for visibility
    backgroundColor: "rgba(255, 255, 255, 0.9) !important",
    border: "2px solid #000000 !important",
    borderRadius: "12px !important",
    padding: "12px 16px !important",
    fontSize: "16px !important",
    fontWeight: "500 !important",
    "&::placeholder": {
      color: "#666666 !important",
      opacity: "0.8 !important"
    },
    "&:focus": {
      outline: "none !important",
      borderColor: "#2F4F2F !important",
      boxShadow: "0 0 0 3px rgba(47, 79, 47, 0.2) !important"
    }
  },
  "& .MuiTextField-root": {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "2px solid #000000",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#000000",
        borderWidth: "2px"
      },
      "&:hover fieldset": {
        borderColor: "#2F4F2F"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2F4F2F",
        borderWidth: "2px"
      },
      "& input": {
        color: "#000000",
        fontSize: "16px",
        fontWeight: "500",
        "&::placeholder": {
          color: "#666666",
          opacity: 0.8
        }
      }
    }
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, rgba(154, 205, 50, 0.03) 0%, rgba(107, 142, 35, 0.05) 100%)",
    zIndex: -1,
  }
};

const headingStyle = {
  fontWeight: 700,
  letterSpacing: "0.05em",
  color: "#556B2F", // Dark olive green
  textShadow: "0 2px 20px rgba(107, 142, 35, 0.3)",
  fontFamily: "'Playfair Display', serif",
  background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 50%, #808000 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  position: "relative",
};

// Elegant background with olive tones
const backgroundStyle = {
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 20% 50%, rgba(154, 205, 50, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(107, 142, 35, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(85, 107, 47, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #F8FFF0 0%, #F5F8F0 25%, #FAFFF5 50%, #F0F8E8 75%, #F8FFF8 100%)
  `,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  position: "relative",
  overflow: "hidden",
};

export default function App() {
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAudit = () => {
    if (!url) return;

    setLoading(true);
    setProgress({ current: 0, total: 1 });
    setResult(null);
    setShowResults(false);

    const source = new EventSource(
      `http://localhost:3001/api/audit?url=${encodeURIComponent(url)}`
    );

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.finished) {
        setResult(data);
        setProgress({ current: data.pages.length, total: data.pages.length });
        setLoading(false);
        setShowResults(true); // Navigate to results view
        source.close();
      } else if (data.error) {
        setResult({ error: data.error });
        setLoading(false);
        source.close();
      } else {
        setProgress({ current: data.current, total: data.total });
      }
    };

    source.onerror = () => {
      source.close();
      setLoading(false);
    };
  };

  const handleBackToHome = () => {
    setShowResults(false);
    setResult(null);
    setUrl("");
  };

  return (
    <div id="bg-main" style={backgroundStyle}>
      {/* Enhanced floating elements background */}
      <BackgroundBalls />
      
      {/* Decorative olive leaves pattern overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23556B2F' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zM10 30a20 20 0 1 1 40 0 20 20 0 0 1-40 0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3,
        zIndex: 1,
      }} />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, width: "100%" }}>
        {!showResults ? (
          // Home Page - Centered layout before audit
          <Paper elevation={0} sx={{
            ...glassStyle,
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto"
          }}>
            {/* Decorative accent line */}
            <div style={{
              width: "120px",
              height: "4px",
              background: "linear-gradient(90deg, #9ACD32, #6B8E23, #556B2F)",
              margin: "0 auto 2rem",
              borderRadius: "2px",
            }} />
            
            <Typography
              variant="h2"
              align="center"
              sx={{
                ...headingStyle,
                mb: 1,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
              }}
            >
              
            </Typography>
            
            <Typography
              variant="h4"
              align="center"
              sx={{
                ...headingStyle,
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 400,
                opacity: 0.8,
                mb: 4,
                letterSpacing: "0.1em"
              }}
            >
              Professional Audit Dashboard
            </Typography>

            {/* Elegant subtitle */}
            <Typography
              variant="body1"
              align="center"
              sx={{
                color: "#6B8E23",
                fontSize: "1.1rem",
                fontWeight: 400,
                mb: 5,
                maxWidth: "600px",
                margin: "0 auto 3rem",
                lineHeight: 1.6,
              }}
            >
              Comprehensive WCAG compliance analysis with AI-powered insights and intelligent recommendations
            </Typography>

            <Box sx={{ mb: 4 }}>
              <CrawlForm
                url={url}
                setUrl={setUrl}
                handleCrawl={handleAudit}
                loading={loading}
                largeInput
              />
              {loading && (
                <ProgressBar current={progress.current} total={progress.total} />
              )}
              {result?.error && (
                <Typography 
                  sx={{ 
                    mt: 2,
                    color: "#8B4513",
                    backgroundColor: "rgba(255, 160, 122, 0.1)",
                    padding: "1rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 160, 122, 0.3)"
                  }}
                >
                  {result.error}
                </Typography>
              )}
            </Box>

            {/* Compact feature highlights */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  textAlign: "center",
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "rgba(154, 205, 50, 0.1)",
                  border: "1px solid rgba(154, 205, 50, 0.2)"
                }}>
                  <Typography variant="h6" sx={{ color: "#556B2F", mb: 0.5, fontWeight: 600, fontSize: "1.1rem" }}>
                    AI-Powered
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B8E23", fontSize: "0.9rem" }}>
                    DialoGPT based Analysis
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  textAlign: "center",
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "rgba(107, 142, 35, 0.1)",
                  border: "1px solid rgba(107, 142, 35, 0.2)"
                }}>
                  <Typography variant="h6" sx={{ color: "#556B2F", mb: 0.5, fontWeight: 600, fontSize: "1.1rem" }}>
                    WCAG Compliant
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B8E23", fontSize: "0.9rem" }}>
                    AA/AAA standards
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  textAlign: "center",
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "rgba(85, 107, 47, 0.1)",
                  border: "1px solid rgba(85, 107, 47, 0.2)"
                }}>
                  <Typography variant="h6" sx={{ color: "#556B2F", mb: 0.5, fontWeight: 600, fontSize: "1.1rem" }}>
                    Smart Fixes
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B8E23", fontSize: "0.9rem" }}>
                    Code examples included
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          // Results Page - Split layout with score on left, audit on right
          <div style={{ width: "100%", minHeight: "100vh", padding: "2rem 0" }}>
            {/* Header with back button */}
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              mb: 4,
              maxWidth: "1400px",
              margin: "0 auto 2rem"
            }}>
              <Button
                onClick={handleBackToHome}
                sx={{
                  background: "linear-gradient(135deg, #9ACD32, #6B8E23)",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 4px 15px rgba(107, 142, 35, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #8BC34A, #556B2F)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(107, 142, 35, 0.4)",
                  },
                  transition: "all 0.3s ease"
                }}
              >
                ← Back to Home
              </Button>
              
              <Typography
                variant="h3"
                sx={{
                  ...headingStyle,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  textAlign: "center",
                  flex: 1,
                  mx: 2
                }}
              >
                Audit Results
              </Typography>
              
              <div style={{ width: "120px" }} /> {/* Spacer for alignment */}
            </Box>

            <Grid container spacing={4} sx={{ maxWidth: "1400px", margin: "0 auto" }}>
              {/* Left side - Score Card (smaller width) */}
              <Grid item xs={12} lg={4}>
                <Paper elevation={0} sx={{
                  ...glassStyle,
                  padding: "2rem",
                  height: "fit-content",
                  position: "sticky",
                  top: "2rem"
                }}>
                  <div style={{
                    width: "60px",
                    height: "3px",
                    background: "linear-gradient(90deg, #9ACD32, #6B8E23)",
                    margin: "0 auto 1.5rem",
                    borderRadius: "2px",
                  }} />
                  
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{
                      ...headingStyle,
                      mb: 3,
                      fontSize: "1.5rem"
                    }}
                  >
                    Accessibility Score
                  </Typography>

                  <ScoreCard pages={result.pages} />
                  
                  {/* Quick audit button */}
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <CrawlForm
                      url={url}
                      setUrl={setUrl}
                      handleCrawl={handleAudit}
                      loading={loading}
                      compact
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Right side - Audit Results (larger width) */}
              <Grid item xs={12} lg={8}>
                <Paper elevation={0} sx={{
                  ...glassStyle,
                  padding: "2rem"
                }}>
                  <div style={{
                    width: "80px",
                    height: "3px",
                    background: "linear-gradient(90deg, #9ACD32, #6B8E23)",
                    margin: "0 auto 1.5rem",
                    borderRadius: "2px",
                  }} />
                  
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{
                      ...headingStyle,
                      mb: 3,
                      fontSize: "1.5rem"
                    }}
                  >
                    Detailed Audit Report
                  </Typography>
                  
                  {/* Report viewer */}
                  {result.pdfPath && (
                    <Box sx={{ mb: 4 }}>
                      <ReportViewer pdfPath={result.pdfPath} />
                    </Box>
                  )}
                  
                  {/* Results table */}
                  <ResultsTable result={result} />
                </Paper>
              </Grid>
            </Grid>
          </div>
        )}
      </Container>

      {/* Enhanced ChatBot Dock with olive theme */}
      <ChatBotDock />
    </div>
  );
}