import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useConversationContext } from "../context/ConversationContext";
import "./Sidebar.css";

interface Props {
  setConversationId: (id: number | null) => void;
  clearMessages: () => void;
}

function Sidebar({ setConversationId, clearMessages }: Props) {
  const navigate = useNavigate();
  const { conversations, fetchConversations } = useConversationContext();

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleNewChat = () => {
    setConversationId(null);   // 새 대화니까 id 초기화
    clearMessages();           // 기존 메시지 비우기
  };

  return (
    <div className="sidebar">
      <h1 className="logo">AskLogic</h1>

      {/* ✅ 새 채팅 버튼 */}
      <button className="new-chat-button" onClick={handleNewChat}>
        + 새 채팅
      </button>

      <div className="conversation-list">
        {conversations.map((conv) => (
          <div
            key={conv.conversation_id}
            className="conversation-item"
            onClick={() => setConversationId(conv.conversation_id)}
          >
            {conv.title}
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }
}

export default Sidebar;
