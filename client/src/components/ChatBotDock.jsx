// client/src/components/ChatBotDock.jsx
import React, { useState, useRef, useEffect } from "react";

export default function ChatBotDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Hello! I'm your accessibility audit assistant. How can I help you improve your website's accessibility today?",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Backend integration for AI model interaction
  const sendMessageToBot = async (userMessage) => {
    try {
      setError(null);
      setIsTyping(true);
      
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: 'accessibility_audit', // Provide context for specialized responses
          history: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.response || "I'm sorry, I couldn't process your request right now.",
          timestamp: new Date(),
          confidence: data.confidence,
          suggestions: data.suggestions || []
        },
      ]);

    } catch (error) {
      console.error('Chat API Error:', error);
      setIsTyping(false);
      setError("Connection failed. Please try again.");
      setIsConnected(false);
      
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "I'm having trouble connecting right now. Please check your connection and try again. In the meantime, you can refer to WCAG guidelines for accessibility best practices.",
          timestamp: new Date(),
          isError: true
        },
      ]);
      
      // Retry connection after 5 seconds
      setTimeout(() => {
        setIsConnected(true);
        setError(null);
      }, 5000);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev, 
      { 
        from: "user", 
        text: userMessage, 
        timestamp: new Date() 
      }
    ]);
    setInput("");

    // Send to backend AI model
    await sendMessageToBot(userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons for common accessibility queries
  const quickActions = [
    { text: "Check color contrast", query: "How can I check if my website has proper color contrast?" },
    { text: "Alt text best practices", query: "What are the best practices for writing alt text?" },
    { text: "Keyboard navigation", query: "How do I make my website keyboard accessible?" },
    { text: "Screen reader compatibility", query: "How can I ensure my site works with screen readers?" }
  ];

  const handleQuickAction = (query) => {
    setInput(query);
    sendMessage();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 100,
        fontFamily: "'Inter', 'Playfair Display', serif",
      }}
    >
      {open ? (
        <div
          style={{
            width: 400,
            height: 550,
            borderRadius: "24px",
            border: "2px solid rgba(107, 142, 35, 0.3)",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, rgba(248,251,245,0.98) 0%, rgba(240,248,232,0.95) 100%)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px rgba(107, 142, 35, 0.2), 0 0 0 1px rgba(255,255,255,0.1)",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Header with olive theme */}
          <div
            style={{
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, rgba(154, 205, 50, 0.15), rgba(107, 142, 35, 0.1))",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(107, 142, 35, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #9ACD32, #6B8E23)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  boxShadow: "0 6px 15px rgba(107, 142, 35, 0.3)",
                  border: "2px solid rgba(255,255,255,0.2)"
                }}
              >
                🌿
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#556B2F",
                    background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Accessibility Assistant
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: isConnected ? "#6B8E23" : "#cc5555",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <div style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: isConnected ? "#4CAF50" : "#f44336"
                  }} />
                  {isConnected ? "Online • AI Powered" : "Reconnecting..."}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(107, 142, 35, 0.1)",
                border: "1px solid rgba(107, 142, 35, 0.2)",
                color: "#556B2F",
                fontSize: "16px",
                cursor: "pointer",
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(107, 142, 35, 0.2)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(107, 142, 35, 0.1)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ✕
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              background: "rgba(244, 67, 54, 0.1)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
              color: "#cc5555",
              padding: "8px 16px",
              fontSize: "12px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div style={{
              padding: "16px 24px",
              background: "rgba(154, 205, 50, 0.05)",
              borderBottom: "1px solid rgba(107, 142, 35, 0.1)"
            }}>
              <div style={{
                fontSize: "12px",
                color: "#6B8E23",
                marginBottom: "8px",
                fontWeight: "500"
              }}>
                Quick Actions:
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px"
              }}>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action.query)}
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(107, 142, 35, 0.2)",
                      borderRadius: "8px",
                      padding: "6px 8px",
                      fontSize: "10px",
                      color: "#556B2F",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(154, 205, 50, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.7)";
                    }}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  margin: "16px 0",
                  animation: "slideIn 0.3s ease-out",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "14px 18px",
                    borderRadius: m.from === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                    background: m.from === "user" 
                      ? "linear-gradient(135deg, #9ACD32, #6B8E23)" 
                      : m.isError
                        ? "rgba(255, 99, 99, 0.1)"
                        : "rgba(255,255,255,0.9)",
                    color: m.from === "user" ? "white" : "#2F4F2F",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    boxShadow: m.from === "user"
                      ? "0 6px 15px rgba(107, 142, 35, 0.3)"
                      : "0 4px 12px rgba(0,0,0,0.08)",
                    backdropFilter: "blur(10px)",
                    fontWeight: "400",
                    border: m.isError ? "1px solid rgba(255, 99, 99, 0.3)" : "1px solid rgba(107, 142, 35, 0.1)",
                  }}
                >
                  {m.text}
                  
                  {/* Show confidence score for bot responses */}
                  {m.from === "bot" && m.confidence && (
                    <div style={{
                      fontSize: "10px",
                      color: "#6B8E23",
                      marginTop: "6px",
                      opacity: 0.7
                    }}>
                      Confidence: {Math.round(m.confidence * 100)}%
                    </div>
                  )}
                  
                  {/* Show suggestions if available */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      {m.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(suggestion)}
                          style={{
                            display: "block",
                            background: "rgba(154, 205, 50, 0.1)",
                            border: "1px solid rgba(154, 205, 50, 0.3)",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            margin: "2px 0",
                            fontSize: "11px",
                            color: "#556B2F",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left"
                          }}
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div style={{
                    fontSize: "10px",
                    color: m.from === "user" ? "rgba(255,255,255,0.7)" : "#6B8E23",
                    marginTop: "4px",
                    textAlign: "right"
                  }}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  margin: "16px 0",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: "20px 20px 20px 6px",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(107, 142, 35, 0.1)"
                  }}
                >
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#6B8E23",
                          animation: `typing 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <span style={{
                    fontSize: "12px",
                    color: "#6B8E23",
                    fontStyle: "italic"
                  }}>
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced input area */}
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, rgba(154, 205, 50, 0.08), rgba(107, 142, 35, 0.05))",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(107, 142, 35, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                background: "rgba(255,255,255,0.9)",
                borderRadius: "20px",
                padding: "6px 6px 6px 18px",
                boxShadow: "0 4px 20px rgba(107, 142, 35, 0.1)",
                border: "1px solid rgba(107, 142, 35, 0.2)",
              }}
            >
              <textarea
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  background: "transparent",
                  color: "#2F4F2F",
                  resize: "none",
                  maxHeight: "80px",
                  minHeight: "20px",
                  fontFamily: "inherit"
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about accessibility guidelines, WCAG compliance, or specific issues..."
                rows={1}
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping || !isConnected}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: input.trim() && isConnected && !isTyping
                    ? "linear-gradient(135deg, #9ACD32, #6B8E23)" 
                    : "rgba(204, 204, 204, 0.5)",
                  border: "none",
                  cursor: input.trim() && isConnected && !isTyping ? "pointer" : "not-allowed",
                  color: "white",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: input.trim() && isConnected && !isTyping
                    ? "0 4px 12px rgba(107, 142, 35, 0.3)" 
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && isConnected && !isTyping) {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 6px 18px rgba(107, 142, 35, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  if (input.trim() && isConnected && !isTyping) {
                    e.target.style.boxShadow = "0 4px 12px rgba(107, 142, 35, 0.3)";
                  }
                }}
              >
                {isTyping ? (
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                ) : (
                  "🚀"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Enhanced floating button with olive theme */
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #9ACD32 0%, #6B8E23 100%)",
            border: "2px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            fontSize: "28px",
            color: "white",
            boxShadow: "0 12px 30px rgba(107, 142, 35, 0.4), 0 0 0 1px rgba(255,255,255,0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1) translateY(-3px)";
            e.target.style.boxShadow = "0 16px 40px rgba(107, 142, 35, 0.5), 0 0 0 1px rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1) translateY(0)";
            e.target.style.boxShadow = "0 12px 30px rgba(107, 142, 35, 0.4), 0 0 0 1px rgba(255,255,255,0.1)";
          }}
        >
          🌿
          {/* Pulse animation ring */}
          <div
            style={{
              position: "absolute",
              top: "-3px",
              left: "-3px",
              right: "-3px",
              bottom: "-3px",
              borderRadius: "50%",
              border: "3px solid rgba(154, 205, 50, 0.4)",
              animation: "pulse 2.5s infinite",
            }}
          />
        </button>
      )}
      
      {/* CSS animations */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-8px);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.15);
              opacity: 0.6;
            }
            100% {
              transform: scale(1.25);
              opacity: 0;
            }
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

// Backend API Integration Guide
/*
POST /api/chat endpoint expected request/response format:

REQUEST:
{
  "message": "How can I improve color contrast on my website?",
  "context": "accessibility_audit",
  "history": [
    {
      "from": "user",
      "text": "Previous message",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
}

RESPONSE:
{
  "response": "To improve color contrast, you should ensure a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text according to WCAG AA guidelines...",
  "confidence": 0.95,
  "suggestions": [
    "Check current contrast ratios",
    "Use online contrast checkers",
    "Consider dark mode alternatives"
  ],
  "context": "color_contrast",
  "resources": [
    {
      "title": "WCAG Color Contrast Guidelines",
      "url": "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html"
    }
  ]
}
*/