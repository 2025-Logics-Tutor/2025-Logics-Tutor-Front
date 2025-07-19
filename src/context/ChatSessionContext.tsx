// ✅ src/context/ChatSessionContext.tsx
import { createContext, useContext, useState } from "react";
import type { ChatResponse } from "../types/ChatResponse";

interface ChatSessionContextType {
  conversationId: number | null;
  setConversationId: (id: number | null) => void;
  messages: ChatResponse[];
  setMessages: React.Dispatch<React.SetStateAction<ChatResponse[]>>;
  addMessage: (msg: { role: "user" | "assistant"; content: string }) => void;
  updateLastAssistantMessage: (content: string) => void;
}

const ChatSessionContext = createContext<ChatSessionContextType | null>(null);

export const ChatSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatResponse[]>([]);

  const createTempMessage = (role: "user" | "assistant", content: string): ChatResponse => ({
    message_id: Math.floor(Math.random() * 1000000),
    role,
    content,
    created_at: new Date().toISOString(),
  });

  const addMessage = (msg: { role: "user" | "assistant"; content: string }) => {
    setMessages((prev) => [...prev, createTempMessage(msg.role, msg.content)]);
  };

  const updateLastAssistantMessage = (content: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];

      if (!last || last.role === "user") {
        updated.push(createTempMessage("assistant", content));
      } else {
        updated[updated.length - 1] = {
          ...last,
          content,
        };
      }

      return updated;
    });
  };

  return (
    <ChatSessionContext.Provider
      value={{
        conversationId,
        setConversationId,
        messages,
        setMessages,
        addMessage,
        updateLastAssistantMessage,
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};

export const useChatSession = () => {
  const context = useContext(ChatSessionContext);
  if (!context) throw new Error("ChatSessionContext는 Provider 안에서만 사용하세요.");
  return context;
};
