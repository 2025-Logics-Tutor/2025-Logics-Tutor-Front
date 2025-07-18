// src/components/ChatWindow.tsx
import type { ChatResponse } from "../types/ChatResponse";
import "./ChatWindow.css";

interface Props {
  messages: ChatResponse[];
}

function ChatWindow({ messages }: Props) {
  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.length === 0 ? (
          <div className="initial-message">오늘은 무엇을 공부할까요?</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.message_id || Math.random()} className={`message-bubble ${msg.role}`}>
              {msg.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
