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
}

function ChatBubble({ role, content }: Props) {
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
    </div>
  );
}

export default ChatBubble;