import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";
import type { ChatResponse } from "../types/ChatResponse";
import "./ChatPage.css";

function ChatPage() {
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

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
