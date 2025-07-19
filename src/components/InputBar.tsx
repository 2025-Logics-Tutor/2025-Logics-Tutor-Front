import { useState } from "react";
import "./InputBar.css";
import { useConversationContext } from "../context/ConversationContext";
import { Send } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  conversationId: number | null;
  setConversationId: React.Dispatch<React.SetStateAction<number | null>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  quote: string | null;
  setQuote: React.Dispatch<React.SetStateAction<string | null>>;
}

function InputBar({
  conversationId,
  setConversationId,
  messages,
  setMessages,
  input,
  setInput,
  quote,
  setQuote,
}: Props) {
  const [level, setLevel] = useState<"ELEMENTARY" | "UNIV" | "GRAD">("UNIV");
  const { fetchConversations } = useConversationContext();

  const logicSymbols = ["¬", "∧", "∨", "→", "↔", "∀", "∃", "⊥"];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setQuote(null);

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const encodedMsg = encodeURIComponent(input);
    const encodedLevel = encodeURIComponent(level);
    const encodedQuote = quote ? `&quote=${encodeURIComponent(quote)}` : "";

    const url = conversationId
      ? `${baseUrl}/api/conversations/${conversationId}/chat-stream?message=${encodedMsg}&level=${encodedLevel}${encodedQuote}`
      : `${baseUrl}/api/conversations/chat-new?message=${encodedMsg}&level=${encodedLevel}${encodedQuote}`;

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
      {quote && (
        <div className="quote-preview">
          <span>“{quote}”에 대해 질문 중...</span>
          <button className="quote-clear-btn" onClick={() => setQuote(null)}>❌</button>
        </div>
      )}

      {/* ✅ 논리 기호 버튼 */}
      <div className="symbol-buttons">
        {logicSymbols.map((symbol) => (
          <button
            key={symbol}
            className="symbol-btn"
            onClick={() => setInput(input + symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div className="input-row">
        <div className="level-select-box">
          <label htmlFor="level-select">설명 난이도</label>
          <select
            id="level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
            className="level-dropdown"
          >
            <option value="ELEMENTARY">초등학생</option>
            <option value="UNIV">대학생</option>
            <option value="GRAD">대학원생</option>
          </select>
        </div>

        <textarea
          className="input-box"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="send-button" onClick={handleSend}>
          <Send size={18} style={{ verticalAlign: "middle" }} />
        </button>
      </div>
    </div>
  );
}

export default InputBar;
