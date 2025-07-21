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
    let streamUrl = "";
    let isNewChat = false;

    if (!convId) {
      // 새 대화인 경우: SSE로 요청 보내되, conversationId는 헤더에서 받아야 함
      streamUrl = `${baseUrl}/api/conversations/chat-new?message=${msg}&level=${lvl}${q}`;
      isNewChat = true;
    } else {
      // 기존 대화
      streamUrl = `${baseUrl}/api/conversations/${convId}/chat-stream?message=${msg}&level=${lvl}${q}`;
    }

    // user 메시지는 기존 대화일 때만 프론트에서 추가 (새 대화는 서버에서 저장됨)
    if (!isNewChat) {
      addMessage({ role: "user", content: input });
    }

    setInput("");
    setQuote(null);

    const streamRes = await fetchWithAuth(streamUrl);

    if (!streamRes.ok || !streamRes.body) {
      console.error("❌ 스트리밍 실패", streamRes.status);
      return;
    }

    // 새 대화면 헤더에서 conversationId 받아 설정
    if (isNewChat) {
      const newId = streamRes.headers.get("X-Conversation-Id");
      if (!newId) {
        console.error("❌ 새 대화 생성: 헤더에 ID 없음");
        return;
      }

      convId = Number(newId);
      setConversationId(convId);
      localStorage.setItem("conversation_id", newId);

      // 메시지 초기화 (빈배열로 시작)
      setMessages([{ role: "user", content: input, message_id: -1, created_at: new Date() }]);
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
        // 약간 딜레이 주고 사이드바 갱신
        setTimeout(() => fetchConversations(), 300);
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
