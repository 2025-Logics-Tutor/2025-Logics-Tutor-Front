import { useState } from "react";
import "./InputBar.css";

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

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let isFirstChunk = true;
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
            if (!line.startsWith("data:")) continue;
          
            // ✅ 원본 그대로 출력 (이스케이프 없이)
            console.log("📥 수신한 chunk 원본:", line);
          
            const raw = line.slice(6); // "data: " (6글자) 제거
            if (!raw) continue;
          
            // ✅ conversationId JSON 여부 체크
            try {
              const parsed = JSON.parse(raw);
              if (parsed.conversationId) {
                setConversationId(parsed.conversationId);
                continue;
              }
            } catch {
              // JSON 아님 → 텍스트로 처리
            }
          
            fullContent += raw;
          
            if (isFirstChunk) {
              setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
              isFirstChunk = false;
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
        📨
      </button>
    </div>
  );
}

export default InputBar;