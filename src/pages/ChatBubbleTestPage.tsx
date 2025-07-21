// src/pages/ChatBubbleTestPage.tsx
import ChatBubble from "../components/ChatBubble";

const test = String.raw`
\[
\begin{array}{|c|c|c|}
\hline
P & Q & P \vee Q \\
\hline
\text{참} & \text{참} & \text{참} \\
\text{참} & \text{거짓} & \text{참} \\
\text{거짓} & \text{참} & \text{참} \\
\text{거짓} & \text{거짓} & \text{거짓} \\
\hline
\end{array}
\]
`;


function ChatBubbleTestPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔬 ChatBubble 수식 렌더링 테스트</h2>
      <ChatBubble role="assistant" content={test} isDocumented />
    </div>
  );
}

export default ChatBubbleTestPage;
