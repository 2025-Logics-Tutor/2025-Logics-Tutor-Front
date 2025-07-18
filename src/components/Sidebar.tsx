import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useConversationContext } from "../context/ConversationContext";
import "./Sidebar.css";
import { Trash2, Plus, LogOut } from "lucide-react";

interface Props {
  setConversationId: (id: number | null) => void;
}

function Sidebar({ setConversationId }: Props) {
  const navigate = useNavigate();
  const { conversations, fetchConversations } = useConversationContext();

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleNewChat = () => {
    setConversationId(null);
    navigate("/");
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchConversations();
      setConversationId(null);
    } else {
      alert("삭제 실패");
    }
  };

  return (
    <div className="sidebar">
      <h1 className="logo">AskLogic</h1>

      {/* ✅ 새 채팅 버튼 */}
      <button className="new-chat-button" onClick={handleNewChat}>
        <Plus size={16} style={{ marginRight: "6px" }} />
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
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={13} style={{ marginRight: "8px" }} />
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
