import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useConversationContext } from "../context/ConversationContext";
import { useChatSession } from "../context/ChatSessionContext";
import "./Sidebar.css";
import { Trash2, Plus, LogOut } from "lucide-react";
import { fetchWithAuth } from "../api/fetchWithAuth";

function Sidebar() {
  const navigate = useNavigate();
  const { conversations, fetchConversations } = useConversationContext();
  const { setConversationId, setMessages } = useChatSession();

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleNewChat = () => {
    localStorage.removeItem("conversation_id");
    setConversationId(null);
    setMessages([]);
    navigate("/");
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchConversations();
        setConversationId(null);
        setMessages([]);
      } else {
        alert("삭제 실패");
      }
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("conversation_id");
    navigate("/login");
  }

  return (
    <div className="sidebar">
      <h1 className="logo">AskLogic</h1>

      <button className="new-chat-button" onClick={handleNewChat}>
        <Plus size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
        새 채팅
      </button>

      <div className="conversation-list">
        {conversations.map((conv) => (
          <div key={conv.conversation_id} className="conversation-item-wrapper">
            <div
              className="conversation-item"
              onClick={() => setConversationId(conv.conversation_id)}
            >
              {conv.title}
            </div>
            <button className="delete-button" onClick={() => handleDelete(conv.conversation_id)}>
              <Trash2 size={16} style={{ verticalAlign: "middle" }} />
            </button>
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={13} style={{ marginRight: "8px", verticalAlign: "middle" }} />
        로그아웃
      </button>
    </div>
  );
}

export default Sidebar;
