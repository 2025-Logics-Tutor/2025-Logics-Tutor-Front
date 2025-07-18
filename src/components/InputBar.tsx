import { useState } from "react";
import "./InputBar.css";
import { useConversationContext } from "../context/ConversationContext";
import { Send, ArrowUpRight } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  conversationId: number | null;
  setConversationId: React.Dispatch<React.SetStateAction<number | null>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

function InputBar({ conversationId, setConversationId, messages, setMessages }: Props) {
  const [input, setInput] = useState("");
  const { fetchConversations } = useConversationContext();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = conversationId
      ? `${baseUrl}/api/conversations/${conversationId}/chat-stream?message=${encodeURIComponent(input)}`
      : `${baseUrl}/api/conversations/chat-new?message=${encodeURIComponent(input)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok || !response.body) {
        console.error("❌ 서버 응답 실패");
        return;
      }

      if (!conversationId) {
        const newId = response.headers.get("X-Conversation-Id");
        if (newId) {
          setConversationId(Number(newId));
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullContent = "";
      let isFirstChunk = true;
      let assistantFirstMessageSent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        if (isFirstChunk) {
          setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
          isFirstChunk = false;

          if (!assistantFirstMessageSent) {
            assistantFirstMessageSent = true;
            // ✅ assistant 응답 시작 시점에 fetchConversations() 호출
            fetchConversations();
          }
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: fullContent,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("❌ 스트리밍 실패", err);
    }
  };

  return (
    <div className="input-bar">
      <textarea
        className="input-box"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="send-button" onClick={handleSend}>
        <Send size={18} style={{verticalAlign: "middle" }} />
      </button>
    </div>
  );
}

export default InputBar;
