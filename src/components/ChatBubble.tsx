// src/components/ChatBubble.tsx
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import "./ChatBubble.css";

interface Props {
  role: "user" | "assistant";
  content: string;
  isDocumented?: boolean;
}

function ChatBubble({ role, content, isDocumented }: Props) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise([bubbleRef.current]);
    }
  }, [content]);

  // ✅ 백엔드에서 이스케이프된 \\ 를 \ 로 복원
  const decodedContent = content.replace(/\\\\/g, "\\");

  const isPureMath = decodedContent.trim().startsWith("\\[") || decodedContent.trim().startsWith("$$");

  return (
    <div className={`chat-bubble ${role}`} ref={bubbleRef}>
      {isPureMath ? (
        <div dangerouslySetInnerHTML={{ __html: decodedContent }} />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeMathjax]}
          components={{
            p: ({ node, ...props }) => <p style={{ margin: "0.2rem 0" }} {...props} />,
            li: ({ node, ...props }) => <li style={{ marginBottom: "0.1rem" }} {...props} />,
          }}
        >
          {decodedContent}
        </ReactMarkdown>
      )}

      {role === "assistant" && isDocumented && (
        <div className="documented-note">이 응답은 문서를 기반으로 생성되었습니다</div>
      )}
    </div>
  );
}

export default ChatBubble;
