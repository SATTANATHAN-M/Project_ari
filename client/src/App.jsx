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
  border: "3px solid #000000",
  padding: "3rem",
  color: "#2F4F2F",
  fontFamily: "'Inter', 'Playfair Display', serif",
  backdropFilter: "blur(20px)",
  position: "relative",
  overflow: "hidden",
  "& input": {
    color: "#000000 !important",
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
  color: "#556B2F",
  textShadow: "0 2px 20px rgba(107, 142, 35, 0.3)",
  fontFamily: "'Playfair Display', serif",
  background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 50%, #808000 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  position: "relative",
};

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

// Toggle Switch Component
const ToggleSwitch = ({ mode, setMode }) => {
  return (
    <Box sx={{ 
      display: "flex", 
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "16px",
      padding: "4px",
      border: "2px solid #000000",
      mb: 4,
      position: "relative",
      overflow: "hidden",
      maxWidth: "500px",
      margin: "0 auto 2rem"
    }}>
      <Button
        onClick={() => setMode('url')}
        sx={{
          flex: 1,
          py: 2,
          px: 3,
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
          color: mode === 'url' ? "white" : "#556B2F",
          background: mode === 'url' 
            ? "linear-gradient(135deg, #9ACD32, #6B8E23)" 
            : "transparent",
          border: "none",
          boxShadow: mode === 'url' ? "0 4px 15px rgba(107, 142, 35, 0.3)" : "none",
          transition: "all 0.3s ease",
          "&:hover": {
            background: mode === 'url' 
              ? "linear-gradient(135deg, #8BC34A, #556B2F)"
              : "rgba(107, 142, 35, 0.1)",
            transform: mode === 'url' ? "translateY(-1px)" : "none"
          }
        }}
      >
        🌐 Crawl Website
      </Button>
      <Button
        onClick={() => setMode('upload')}
        sx={{
          flex: 1,
          py: 2,
          px: 3,
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
          color: mode === 'upload' ? "white" : "#556B2F",
          background: mode === 'upload' 
            ? "linear-gradient(135deg, #9ACD32, #6B8E23)" 
            : "transparent",
          border: "none",
          boxShadow: mode === 'upload' ? "0 4px 15px rgba(107, 142, 35, 0.3)" : "none",
          transition: "all 0.3s ease",
          "&:hover": {
            background: mode === 'upload' 
              ? "linear-gradient(135deg, #8BC34A, #556B2F)"
              : "rgba(107, 142, 35, 0.1)",
            transform: mode === 'upload' ? "translateY(-1px)" : "none"
          }
        }}
      >
        📁 Upload React Files
      </Button>
    </Box>
  );
};

// File Upload Component
const FileUpload = ({ onFileUpload, uploading, uploadResult }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.zip')) {
        onFileUpload(file);
      } else {
        alert('Please upload a .zip file containing your React project');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.zip')) {
        onFileUpload(file);
      } else {
        alert('Please upload a .zip file containing your React project');
      }
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Drag & Drop Zone */}
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: `3px dashed ${dragActive ? '#6B8E23' : '#000000'}`,
          borderRadius: "16px",
          padding: "3rem",
          textAlign: "center",
          backgroundColor: dragActive 
            ? "rgba(154, 205, 50, 0.1)" 
            : "rgba(255, 255, 255, 0.6)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          position: "relative",
          "&:hover": {
            backgroundColor: "rgba(154, 205, 50, 0.05)",
            borderColor: "#6B8E23"
          }
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".zip"
          onChange={handleChange}
          style={{ display: "none" }}
        />
        
        <Box sx={{ mb: 2 }}>
          <div style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            color: dragActive ? "#6B8E23" : "#556B2F"
          }}>
            📁
          </div>
          
          <Typography variant="h6" sx={{ 
            color: "#556B2F", 
            mb: 1, 
            fontWeight: 600,
            fontSize: "1.2rem"
          }}>
            {dragActive ? "Drop your ZIP file here" : "Upload React Project"}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: "#6B8E23", 
            mb: 2,
            lineHeight: 1.6
          }}>
            Drag & drop a ZIP file containing your React project, or click to browse
          </Typography>
          
          <Typography variant="body2" sx={{ 
            color: "#808000", 
            fontSize: "0.9rem",
            fontStyle: "italic"
          }}>
            Supported: .zip files with React/JavaScript/TypeScript code
          </Typography>
        </Box>

        {/* Upload Button */}
        <Button
          variant="contained"
          disabled={uploading}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "12px",
            background: uploading 
              ? "linear-gradient(135deg, #ccc, #999)" 
              : "linear-gradient(135deg, #9ACD32, #6B8E23)",
            color: "white",
            boxShadow: uploading 
              ? "none" 
              : "0 4px 15px rgba(107, 142, 35, 0.3)",
            "&:hover": {
              background: uploading 
                ? "linear-gradient(135deg, #ccc, #999)"
                : "linear-gradient(135deg, #8BC34A, #556B2F)",
              transform: uploading ? "none" : "translateY(-2px)",
              boxShadow: uploading 
                ? "none" 
                : "0 6px 20px rgba(107, 142, 35, 0.4)",
            },
            transition: "all 0.3s ease"
          }}
        >
          {uploading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              Analyzing...
            </span>
          ) : (
            "Choose File"
          )}
        </Button>
      </Box>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

// Upload Results Display Component
const UploadResultsDisplay = ({ uploadResult }) => {
  if (!uploadResult) return null;

  // Transform upload results to match the format expected by ResultsTable
  const transformedResult = {
    pages: uploadResult.results?.map((file, index) => ({
      url: file.file,
      title: `File: ${file.file.split('/').pop()}`,
      violations: file.messages.map(msg => ({
        id: `rule-${msg.ruleId || 'unknown'}`,
        impact: msg.severity === 2 ? 'serious' : msg.severity === 1 ? 'moderate' : 'minor',
        description: msg.message,
        help: `${msg.ruleId}: ${msg.message}`,
        helpUrl: msg.ruleId ? `https://eslint.org/docs/rules/${msg.ruleId}` : '#',
        nodes: [{
          html: `Line ${msg.line}, Column ${msg.column}`,
          target: [`line-${msg.line}-col-${msg.column}`],
          failureSummary: msg.message
        }]
      })),
      passes: [], // ESLint doesn't report passes, only violations
      inapplicable: []
    })) || [],
    totalViolations: uploadResult.results?.reduce((total, file) => total + file.messages.length, 0) || 0,
    analysisType: 'upload'
  };

  return transformedResult;
};

export default function App() {
  const [mode, setMode] = useState('url'); // 'url' or 'upload'
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleAudit = () => {
    if (!url) return;

    setLoading(true);
    setProgress({ current: 0, total: 1 });
    setResult(null);
    setShowResults(false);
    setUploadResult(null); // Clear upload results when starting URL audit

    const source = new EventSource(
      `http://localhost:3001/api/audit?url=${encodeURIComponent(url)}`
    );

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.finished) {
        setResult(data);
        setProgress({ current: data.pages.length, total: data.pages.length });
        setLoading(false);
        setShowResults(true);
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

  const handleFileUpload = async (file) => {
    setUploading(true);
    setUploadResult(null);
    setResult(null); // Clear URL results when starting file upload

    const formData = new FormData();
    formData.append('zipfile', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload-zip', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      console.log('Upload result:', result);  
      setUploadResult(result);
      
      // If we have results, transform them and show in main results view
      if (result && (result.results?.length > 0 || !result.error)) {
        const transformedResult = {
          pages: result.results?.map((file, index) => ({
            url: file.file,
            title: `File: ${file.file.split('/').pop()}`,
            violations: file.messages?.map(msg => ({
              id: `rule-${msg.ruleId || 'unknown'}`,
              impact: msg.severity === 2 ? 'serious' : msg.severity === 1 ? 'moderate' : 'minor',
              description: msg.message,
              help: `${msg.ruleId}: ${msg.message}`,
              helpUrl: msg.ruleId ? `https://eslint.org/docs/rules/${msg.ruleId}` : '#',
              nodes: [{
                html: `Line ${msg.line}, Column ${msg.column}`,
                target: [`line-${msg.line}-col-${msg.column}`],
                failureSummary: msg.message
              }]
            })) || [],
            passes: [],
            inapplicable: []
          })) || [],
          totalViolations: result.results?.reduce((total, file) => total + (file.messages?.length || 0), 0) || 0,
          analysisType: 'upload',
          uploadedFileName: file.name
        };
        
        setResult(transformedResult);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({ 
        error: 'Upload failed. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBackToHome = () => {
    setShowResults(false);
    setResult(null);
    setUrl("");
    setUploadResult(null);
    setMode('url');
  };

  // Get the display result - prioritize the main result, fall back to upload result
  const displayResult = result || UploadResultsDisplay({ uploadResult });

  return (
    <div id="bg-main" style={backgroundStyle}>
      <BackgroundBalls />
      
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
          <Paper elevation={0} sx={{
            ...glassStyle,
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto"
          }}>
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
              Accessibility Audit Suite
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
              Professional Analysis Dashboard
            </Typography>

            <Typography
              variant="body1"
              align="center"
              sx={{
                color: "#6B8E23",
                fontSize: "1.1rem",
                fontWeight: 400,
                mb: 4,
                maxWidth: "600px",
                margin: "0 auto 2rem",
                lineHeight: 1.6,
              }}
            >
              Choose between crawling live websites or analyzing your React project files for WCAG compliance
            </Typography>

            {/* Toggle Switch */}
            <ToggleSwitch mode={mode} setMode={setMode} />

            {/* Conditional Content Based on Mode */}
            {mode === 'url' ? (
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
            ) : (
              <FileUpload
                onFileUpload={handleFileUpload}
                uploading={uploading}
                uploadResult={uploadResult}
              />
            )}

            {/* Feature highlights - Updated for dual mode */}
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
                    {mode === 'url' ? 'Live Website' : 'Code Analysis'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B8E23", fontSize: "0.9rem" }}>
                    {mode === 'url' ? 'Real-time crawling' : 'Static code review'}
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
                  backgroundColor: "rgba(107, 142, 35, 0.1)",
                  border: "1px solid rgba(107, 142, 35, 0.2)"
                }}>
                  <Typography variant="h6" sx={{ color: "#556B2F", mb: 0.5, fontWeight: 600, fontSize: "1.1rem" }}>
                    Static Website
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B8E23", fontSize: "0.9rem" }}>
                    Website Code 
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
                    {mode === 'url' ? 'AI recommendations' : 'ESLint powered'}
                  </Typography>
                </Box>
                
              </Grid>
            </Grid>
          </Paper>
        ) : (
          // Results Page - Now shows both URL and Upload results
          <div style={{ width: "100%", minHeight: "100vh", padding: "2rem 0" }}>
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
                {displayResult?.analysisType === 'upload' ? 'Code Analysis Results' : 'Audit Results'}
              </Typography>
              
              <div style={{ width: "120px" }} />
            </Box>

            {/* Display uploaded file name if it's an upload result */}
            {displayResult?.analysisType === 'upload' && displayResult?.uploadedFileName && (
              <Box sx={{ 
                textAlign: "center", 
                mb: 3,
                maxWidth: "1400px",
                margin: "0 auto 1rem"
              }}>
                <Typography variant="body1" sx={{ 
                  color: "#6B8E23",
                  backgroundColor: "rgba(154, 205, 50, 0.1)",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(154, 205, 50, 0.3)",
                  display: "inline-block"
                }}>
                  📁 Analyzed: {displayResult.uploadedFileName}
                </Typography>
              </Box>
            )}

            <Grid container spacing={4} sx={{ maxWidth: "1400px", margin: "0 auto" }}>
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
                    {displayResult?.analysisType === 'upload' ? 'Code Quality Score' : 'Accessibility Score'}
                  </Typography>

                  <ScoreCard pages={displayResult?.pages || []} />
                  
                  {displayResult?.analysisType !== 'upload' && (
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                      <CrawlForm
                        url={url}
                        setUrl={setUrl}
                        handleCrawl={handleAudit}
                        loading={loading}
                        compact
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>

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
                    {displayResult?.analysisType === 'upload' ? 'Code Analysis Report' : 'Detailed Audit Report'}
                  </Typography>
                  
                  {/* Show PDF viewer only for URL audits */}
                  {displayResult?.pdfPath && displayResult?.analysisType !== 'upload' && (
                    <Box sx={{ mb: 4 }}>
                      <ReportViewer pdfPath={displayResult.pdfPath} />
                    </Box>
                  )}
                  
                  {/* Show detailed JSON results */}
                  {displayResult && (
                    <Box sx={{ mb: 4 }}>
                      {/* Summary Statistics */}
                      <Box sx={{ 
                        mb: 3,
                        p: 2,
                        backgroundColor: "rgba(154, 205, 50, 0.1)",
                        borderRadius: "12px",
                        border: "1px solid rgba(154, 205, 50, 0.3)"
                      }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="h6" sx={{ color: "#556B2F", textAlign: "center" }}>
                              {displayResult.pages?.length || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6B8E23", textAlign: "center" }}>
                              {displayResult.analysisType === 'upload' ? 'Files Analyzed' : 'Pages Crawled'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="h6" sx={{ color: "#8B4513", textAlign: "center" }}>
                              {displayResult.totalViolations || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6B8E23", textAlign: "center" }}>
                              Total Issues
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="h6" sx={{ 
                              color: displayResult.totalViolations === 0 ? "#228B22" : "#FF6B35",
                              textAlign: "center" 
                            }}>
                              {displayResult.totalViolations === 0 ? "✓ Clean" : "⚠ Issues Found"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6B8E23", textAlign: "center" }}>
                              Status
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  )}
                  
                  {/* Raw JSON Display for debugging (can be removed in production) */}
                  {uploadResult && displayResult?.analysisType === 'upload' && (
                    <Box sx={{ 
                      mb: 4,
                      p: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      maxHeight: "300px",
                      overflow: "auto"
                    }}>
                      <Typography variant="h6" sx={{ 
                        color: "#556B2F", 
                        mb: 2,
                        fontSize: "1rem"
                      }}>
                        Raw Analysis Data:
                      </Typography>
                      <pre style={{
                        fontSize: "0.8rem",
                        color: "#2F4F2F",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        margin: 0,
                        fontFamily: "monospace"
                      }}>
                        {JSON.stringify(uploadResult, null, 2)}
                      </pre>
                    </Box>
                  )}
                  
                  <ResultsTable result={displayResult} />
                </Paper>
              </Grid>
            </Grid>
          </div>
        )}
      </Container>

      <ChatBotDock />
    </div>
  );
}