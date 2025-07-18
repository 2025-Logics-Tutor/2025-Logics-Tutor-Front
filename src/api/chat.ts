export async function chatNewSSE(message: string, onMessage: (chunk: string) => void) {
    const token = localStorage.getItem("access_token");
  
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations/chat/new`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  
    if (!response.ok || !response.body) {
      throw new Error("SSE 연결 실패");
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      chunk.split("data: ").forEach((line) => {
        if (line.trim()) onMessage(line.trim());
      });
    }
  }
  