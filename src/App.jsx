import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:5000/chat", { message });

    setReply(res.data.reply);
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="header">
          <div className="logo">🤖</div>
          <div>
            <h2>OpenRouter Agent</h2>
            <p>AI Powered Database Assistant</p>
          </div>
        </div>

        <textarea
          placeholder="Ask about products, orders, status..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />

        <button className="send-btn" onClick={sendMessage}>
          🚀 Send Message
        </button>

        {reply && (
          <div className="response-box">
            <h3>Response</h3>
            <pre>{reply}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
