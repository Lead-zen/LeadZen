import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, Search } from "lucide-react";
import { sendChatMessage } from "../../services/chatapi";
import "./ChatPage.css"; // Your existing CSS

// Suggestions and slogans
const leadGenerationSuggestions = [
  "Hotels with conference rooms",
  "Dental clinics offering cosmetic dentistry",
  "Restaurants serving vegan options",
  "Gyms with personal trainers",
  "Tech startups working on AI solutions",
  "Universities with computer science programs",
];

const leadSlogans = [
  "Good afternoon! Ready to discover your next great lead?",
  "Welcome! Let's find the perfect prospects for your business.",
  "Hello! Time to turn conversations into conversions.",
  "Good day! Ready to generate some quality leads?",
  "Hi there! Let's explore opportunities together."
];

const ChatPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [currentSlogan, setCurrentSlogan] = useState(() => {
    return leadSlogans[Math.floor(Math.random() * leadSlogans.length)];
  });

  const handleContinueChat = () => {
    navigate("/auth");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await sendChatMessage(userMessage.text);

      const aiMessage = {
        id: Date.now() + 1,
        text:
          aiResponse.response ||
          aiResponse.bot ||
          aiResponse.message ||
          "No response from server",
        leads: aiResponse.leads || null,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "⚠️ Error. Please try again.", sender: "ai" },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
    setShowSuggestions(true);

    const currentIndex = leadSlogans.indexOf(currentSlogan);
    const nextIndex = (currentIndex + 1) % leadSlogans.length;
    setCurrentSlogan(leadSlogans[nextIndex]);

    window.scrollTo({ top: 0, behavior: "smooth" });
    inputRef.current?.focus();
  };

  return (
    <div className="chat-page">
      {messages.length === 0 ? (
        <div className="perplexity-layout">
          <div className="page-title">
            <p className="slogan-text">{currentSlogan}</p>
          </div>

          <div className="search-container">
            <form onSubmit={handleSendMessage} className="search-form">
              <div className="search-bar">
                <div className="search-input-container">
                  <div className="search-icon">
                    <Search />
                  </div>
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="search-input"
                    ref={inputRef}
                    autoFocus
                  />
                </div>
                <div className="search-actions">
                  <button
                    type="submit"
                    className="search-submit-btn"
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {showSuggestions && (
            <div className="suggestions-container">
              <div className="suggestions-header">
                <h3>Suggested Questions</h3>
                <button
                  className="close-suggestions"
                  onClick={() => setShowSuggestions(false)}
                >
                  ×
                </button>
              </div>
              <div className="suggestions-list">
                {leadGenerationSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleSuggestionSelect(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h2>Chat</h2>
            <button className="new-chat-button" onClick={handleNewChat}>
              <Plus /> New Chat
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>

                  {msg.leads && (
                    <div className="lead-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Business Name</th>
                            <th>Industry</th>
                            <th>Address</th>
                            <th>Website</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.leads.map((lead, idx) => (
                            <tr key={idx}>
                              <td>{lead.business_name}</td>
                              <td>{lead.industry}</td>
                              <td>{lead.address}</td>
                              <td>
                                {lead.website !== "N/A" ? (
                                  <a href={lead.website} target="_blank" rel="noreferrer">
                                    {lead.website}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>{lead.contact_number}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="continue-chat-container">
                        <button className="continue-chat-button" onClick={handleContinueChat}>
                          Continue Chat <ArrowRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <div className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="chat-input"
                  ref={inputRef}
                  autoFocus
                />
                <button type="submit" className="send-button" disabled={!inputValue.trim() || isLoading}>
                  <ArrowRight />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
