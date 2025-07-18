import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";
import { useState } from "react";
import type { ChatResponse } from "../types/ChatResponse";

function Layout() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatResponse[]>([]);

  return (
    <div className="layout">
      <Sidebar
        setConversationId={setConversationId}
        clearMessages={() => setMessages([])}
      />
      <div className="chat-area">
        <Outlet
          context={{
            conversationId,
            setConversationId,
            messages,
            setMessages,
          }}
        />
      </div>
    </div>
  );
}

export default Layout;
