import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";
import "./ChatPage.css";
import { fetchWithAuth } from "../api/fetchWithAuth";
import { useChatSession } from "../context/ChatSessionContext";

function ChatPage() {
  const {
    conversationId,
    setConversationId,
    messages,
    setMessages,
  } = useChatSession();

  const [input, setInput] = useState("");
  const [quote, setQuote] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("conversation_id");
    if (saved && !conversationId) {
      setConversationId(Number(saved));
    }
  }, [conversationId, setConversationId]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/conversations/${conversationId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setMessages(data.messages))
      .catch((err) => {
        console.error("이전 메시지 로딩 실패:", err);
        localStorage.clear();
        navigate("/login");
      });
  }, [conversationId, setMessages, navigate]);

  return (
    <div className="chat-page">
      <main className="chat-main">
        <ChatWindow onQuoteSelected={(q) => setQuote(q)} />
        <InputBar
          conversationId={conversationId}
          setConversationId={setConversationId}
          input={input}
          setInput={setInput}
          quote={quote}
          setQuote={setQuote}
        />
      </main>
    </div>
  );
}

export default ChatPage;