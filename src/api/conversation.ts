// src/api/conversation.ts
import type { ChatResponse } from "../types/ChatResponse";

export async function fetchConversationMessages(conversationId: number): Promise<ChatResponse[]> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return data.messages;
}