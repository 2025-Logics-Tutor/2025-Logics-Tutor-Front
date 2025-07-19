import { useState } from "react";
import "./InputBar.css";
import { useConversationContext } from "../context/ConversationContext";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/fetchWithAuth";
import { useChatSession } from "../context/ChatSessionContext";

interface Props {
  conversationId: number | null;
  setConversationId: React.Dispatch<React.SetStateAction<number | null>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  quote: string | null;
  setQuote: React.Dispatch<React.SetStateAction<string | null>>;
}

function InputBar({
  conversationId,
  setConversationId,
  input,
  setInput,
  quote,
  setQuote,
}: Props) {
  const [level, setLevel] = useState<"ELEMENTARY" | "UNIV" | "GRAD">("UNIV");
  const { fetchConversations } = useConversationContext();
  const navigate = useNavigate();
  const { addMessage, updateLastAssistantMessage, setMessages } = useChatSession();

  const logicSymbols = ["¬", "∧", "∨", "→", "↔", "∀", "∃", "⊥"];

  const handleSend = async () => {
    if (!input.trim()) return;

    addMessage({ role: "user", content: input });
    setInput("");
    setQuote(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const msg = encodeURIComponent(input);
    const lvl = encodeURIComponent(level);
    const q = quote ? `&quote=${encodeURIComponent(quote)}` : "";

    let convId = conversationId;

    if (!convId) {
      const createRes = await fetchWithAuth(
        `${baseUrl}/api/conversations/chat-new?message=${msg}&level=${lvl}${q}`
      );

      if (!createRes.ok) {
        console.error("❌ 새 대화 생성 실패");
        return;
      }

      const newId = createRes.headers.get("X-Conversation-Id");
      if (!newId) {
        console.error("❌ X-Conversation-Id 헤더 없음");
        return;
      }

      convId = Number(newId);
      setConversationId(convId);
      localStorage.setItem("conversation_id", newId);

      const historyRes = await fetchWithAuth(`${baseUrl}/api/conversations/${newId}`);
      if (historyRes.ok) {
        const data = await historyRes.json();
        setMessages(data.messages);
      }
    }

    const streamRes = await fetchWithAuth(
      `${baseUrl}/api/conversations/${convId}/chat-stream?message=${msg}&level=${lvl}${q}`
    );

    if (!streamRes.ok || !streamRes.body) {
      console.error("❌ 스트리밍 실패", streamRes.status);
      return;
    }

    const reader = streamRes.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullContent = "";
    let isFirstChunk = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullContent += chunk;

      updateLastAssistantMessage(fullContent);

      if (isFirstChunk) {
        fetchConversations();
        isFirstChunk = false;
      }
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
