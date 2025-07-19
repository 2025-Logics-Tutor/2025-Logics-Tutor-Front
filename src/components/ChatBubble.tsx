import { useEffect, useRef } from "react";
import "./ChatBubble.css";

interface Props {
  role: "user" | "assistant";
  content: string;
}

function ChatBubble({ role, content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([ref.current!]);
    }
  }, [content]);

  return (
    <div className={`chat-bubble ${role}`} ref={ref}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default ChatBubble;
