import { createContext, useContext, useState } from "react";

export interface Conversation {
  conversation_id: number;
  title: string;
}

interface ConversationContextType {
  conversations: Conversation[];
  fetchConversations: () => Promise<void>;
  addConversation: (conv: Conversation) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = await res.json();
      setConversations(data);
    } catch (e) {
      console.error("❌ 대화 목록 불러오기 실패", e);
    }
  };

  const addConversation = (conv: Conversation) => {
    setConversations((prev) => [conv, ...prev]);
  };

  return (
    <ConversationContext.Provider value={{ conversations, fetchConversations, addConversation }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) throw new Error("ConversationContext 내부에서 사용해야 합니다.");
  return context;
};