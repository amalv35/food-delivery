import { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./ChatBot.css";
import { MdClose, MdSend } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";

const ChatBot = () => {
  const { url, token, addToCart, food_list } = useContext(StoreContext);
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey! 👋 I'm your food assistant. Tell me what you're craving or say 'surprise me'!",
      suggestions: []
    }
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");

    // add user message
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${url}/api/bot/chat`,
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessages(prev => [...prev, {
          role: "bot",
          text: res.data.data.message,
          suggestions: res.data.data.suggestions || []
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Sorry, I'm having trouble right now. Try again!",
        suggestions: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleAddToCart = (itemId) => {
    addToCart(itemId);
  };

  const getFoodImage = (itemId) => {
    const food = food_list.find(f => f._id === itemId);
    return food ? `${url}/images/${food.image}` : null;
  };

  const getFoodPrice = (itemId) => {
    const food = food_list.find(f => f._id === itemId);
    return food?.price || null;
  };

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen
          ? <MdClose size={26} />
          : <IoChatbubbleEllipses size={26} />
        }
      </button>

      {/* ── Chat Sidebar ── */}
      <div className={`chatbot-sidebar ${isOpen ? "chatbot-sidebar-open" : ""}`}>

        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">🍽️</div>
            <div>
              <p className="chatbot-name">FoodBot</p>
              <p className="chatbot-status">● Online</p>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            <MdClose size={22} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg-wrap ${msg.role}`}>

              {/* Message bubble */}
              <div className={`chatbot-bubble ${msg.role}`}>
                {msg.text}
              </div>

              {/* Suggestion Cards */}
              {msg.suggestions?.length > 0 && (
                <div className="chatbot-suggestions">
                  {msg.suggestions.map((s, j) => {
                    const imgSrc = getFoodImage(s.id);
                    const price  = getFoodPrice(s.id);
                    return (
                      <div key={j} className="chatbot-suggestion-card">
                        {imgSrc && (
                          <img src={imgSrc} alt={s.name} />
                        )}
                        <div className="chatbot-suggestion-info">
                          <p className="chatbot-suggestion-name">{s.name}</p>
                          <p className="chatbot-suggestion-reason">{s.reason}</p>
                          {price && (
                            <p className="chatbot-suggestion-price">${price}</p>
                          )}
                        </div>
                        <button
                          className="chatbot-add-btn"
                          onClick={() => handleAddToCart(s.id)}
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div className="chatbot-msg-wrap bot">
              <div className="chatbot-bubble bot chatbot-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {token ? (
          <div className="chatbot-input-row">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="chatbot-send-btn"
            >
              <MdSend size={20} />
            </button>
          </div>
        ) : (
          <div className="chatbot-login-msg">
            Please log in to use the food assistant 🔒
          </div>
        )}

      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="chatbot-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default ChatBot;