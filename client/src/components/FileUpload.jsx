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

      {/* Upload Results */}
      {uploadResult && (
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: "rgba(154, 205, 50, 0.1)",
          borderRadius: "12px",
          border: "1px solid rgba(154, 205, 50, 0.3)"
        }}>
          <Typography variant="h6" sx={{ 
            color: "#556B2F", 
            mb: 2, 
            fontWeight: 600 
          }}>
            Lint Results
          </Typography>
          
          {uploadResult.error ? (
            <Typography sx={{ color: "#8B4513" }}>
              Error: {uploadResult.error}
            </Typography>
          ) : uploadResult.results?.length > 0 ? (
            <Box>
              <Typography sx={{ color: "#6B8E23", mb: 1 }}>
                Found {uploadResult.results.length} files with issues:
              </Typography>
              {uploadResult.results.slice(0, 3).map((file, idx) => (
                <Box key={idx} sx={{ 
                  mb: 1, 
                  pl: 2, 
                  borderLeft: "3px solid #9ACD32",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  p: 1,
                  borderRadius: "8px"
                }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    color: "#556B2F" 
                  }}>
                    {file.file}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: "#6B8E23",
                    fontSize: "0.85rem"
                  }}>
                    {file.messages.length} issue(s) found
                  </Typography>
                </Box>
              ))}
              {uploadResult.results.length > 3 && (
                <Typography variant="body2" sx={{ 
                  color: "#808000", 
                  fontStyle: "italic",
                  mt: 1
                }}>
                  ...and {uploadResult.results.length - 3} more files
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
              <Typography sx={{ color: "#6B8E23", fontWeight: 600 }}>
                Great! No accessibility issues found in your React code.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};