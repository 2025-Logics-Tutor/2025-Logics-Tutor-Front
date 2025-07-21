// src/types/ChatResponse.ts
export interface ChatResponse {
    message_id: number;
    role: string;
    content: string;
    created_at: string;
    isDocumented?: boolean;
  }  