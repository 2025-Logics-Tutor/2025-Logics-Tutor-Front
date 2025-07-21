// src/components/ChatBubble.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // 꼭 필요함
import "./ChatBubble.css";

interface Props {
  role: "user" | "assistant";
  content: string;
  isDocumented?: boolean; // ✅ 추가
}

function ChatBubble({ role, content, isDocumented }: Props) {
  return (
    <div className={`chat-bubble ${role}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => <p style={{ margin: "0.2rem 0" }} {...props} />,
          li: ({ node, ...props }) => <li style={{ marginBottom: "0.1rem" }} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>

      {/* ✅ 버블 바깥 하단 표시 */}
      {role === "assistant" && isDocumented && (
        <div className="documented-note">이 응답은 문서를 기반으로 생성되었습니다</div>
      )}
    </div>
  );
}

export default ChatBubble;