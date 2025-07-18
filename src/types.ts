export interface ChatResponse {
    message_id: number;
    role: "user" | "assistant";
    content: string;
    created_at: string;
  }  