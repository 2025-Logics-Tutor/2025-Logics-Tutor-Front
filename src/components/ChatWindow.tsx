import { useRef, useEffect } from "react";
import { useChatSession } from "../context/ChatSessionContext";
import ChatBubble from "./ChatBubble";
import "./ChatWindow.css";

interface Props {
  onQuoteSelected?: (quote: string) => void;
}

function ChatWindow({ onQuoteSelected }: Props) {
  const { messages } = useChatSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText && selectedText.length > 1) {
      onQuoteSelected?.(selectedText);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log("🔥 messages 상태:", messages);
  return (
    <div className="chat-window" onMouseUp={handleMouseUp} ref={containerRef}>
      <div className="message-list">
        {messages.length === 0 ? (
          <div className="initial-message">오늘은 무엇을 공부할까요?</div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.message_id}
              role={msg.role}
              content={msg.content}
              isDocumented={msg.isDocumented}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatWindow;
