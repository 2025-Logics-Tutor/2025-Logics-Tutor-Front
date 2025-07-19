// src/components/ChatBubble.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBubble.css";

interface Props {
  role: "user" | "assistant";
  content: string;
}

function ChatBubble({ role, content }: Props) {
  return (
    <div className={`chat-bubble ${role}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default ChatBubble;
