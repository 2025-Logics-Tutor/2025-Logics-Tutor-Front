// src/components/ChatWindow.tsx
import { useRef, useEffect } from "react";
import type { ChatResponse } from "../types/ChatResponse";
import ChatBubble from "./ChatBubble";
import "./ChatWindow.css";

interface Props {
  messages: ChatResponse[];
  onQuoteSelected?: (quote: string) => void;
}

function ChatWindow({ messages, onQuoteSelected }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null); // ✅ 맨 아래 위치 ref

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText && selectedText.length > 1) {
      onQuoteSelected?.(selectedText);
    }
  };

  // ✅ messages가 바뀔 때마다 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window" onMouseUp={handleMouseUp} ref={containerRef}>
      <div className="message-list">
        {messages.length === 0 ? (
          <div className="initial-message">오늘은 무엇을 공부할까요?</div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.message_id || Math.random()}
              role={msg.role}
              content={msg.content}
            />
          ))
        )}
        {/* ✅ 항상 아래에 위치할 div */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatWindow;
