import { useEffect, useState } from "react";
import axios from "axios";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Load chats from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chats")) || [];

    if (saved.length === 0) {
      const firstChat = {
        id: Date.now().toString(),
        messages: [],
      };

      setChats([firstChat]);
      setCurrentChatId(firstChat.id);
    } else {
      setChats(saved);
      setCurrentChatId(saved[0].id);
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const currentChat = chats.find((c) => c.id === currentChatId);

  // Create new chat
  const createNewChat = () => {
    const id = Date.now().toString();

    const newChat = {
      id,
      messages: [],
    };

    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(id);

    return id;
  };

  // Send message
  const sendMessage = async () => {

    if (!message.trim()) return;

    let chatId = currentChatId;

    // If no chat exists, create one first
    if (!chatId) {
      chatId = createNewChat();
    }

    const userMsg = {
      role: "user",
      content: message,
    };

    // Add user message safely
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMsg] }
          : chat,
      ),
    );

    try {
      const res = await axios.post("https://ai-chat-gc96.vercel.app/chat", {
        message,
      });

      const aiMsg = {
        role: "assistant",
        content: res.data.reply,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, aiMsg] }
            : chat,
        ),
      );
    } catch (err) {
      console.error("API error:", err);
    }

    setMessage("");
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🤖 AI Assistant</h2>

        <button className="new-chat" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="chat-history">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                chat.id === currentChatId ? "active" : ""
              }`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              {chat.messages[0]?.content?.slice(0, 20) || "New Chat"}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="messages">
          {currentChat?.messages?.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="avatar">{msg.role === "user" ? "👤" : "🤖"}</div>
              <div className="content">{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message AI..."
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}
