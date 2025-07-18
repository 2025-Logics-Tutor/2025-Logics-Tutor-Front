import { useState } from "react";
import { chatNewSSE } from "../api/chat";

export function useChatStream() {
  const [chatLog, setChatLog] = useState<string[]>([]);

  const startNewChat = async (message: string) => {
    setChatLog((prev) => [...prev, `🧑: ${message}`, "🤖: ..."]);
    let assistantMsg = "";

    await chatNewSSE(message, (chunk) => {
      assistantMsg += chunk;
      setChatLog((prev) => [...prev.slice(0, -1), `🤖: ${assistantMsg}`]);
    });
  };

  return { chatLog, startNewChat };
}
