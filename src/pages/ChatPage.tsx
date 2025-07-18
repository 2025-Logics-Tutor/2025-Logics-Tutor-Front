import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";
import type { ChatResponse } from "../types/ChatResponse";
import "./ChatPage.css";

interface ChatContextType {
  conversationId: number | null;
  setConversationId: (id: number | null) => void;
  messages: ChatResponse[];
  setMessages: React.Dispatch<React.SetStateAction<ChatResponse[]>>;
}

function ChatPage() {
  const {
    conversationId,
    setConversationId,
    messages,
    setMessages,
  } = useOutletContext<ChatContextType>();

  useEffect(() => {
    if (conversationId !== null) {
      const token = localStorage.getItem("access_token");
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages);
        })
        .catch((err) => {
          console.error("이전 메시지 로딩 실패:", err);
        });
    }
  }, [conversationId]);

  return (
    <div className="chat-page">
      <main className="chat-main">
        <ChatWindow messages={messages} />
        <InputBar
          conversationId={conversationId}
          setConversationId={setConversationId}
          messages={messages}
          setMessages={setMessages}
        />
      </main>
    </div>
  );
}

export default ChatPage;
