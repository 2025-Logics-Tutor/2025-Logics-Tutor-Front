import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/fetchWithAuth";
import "./Sidebar.css";

interface Conversation {
  conversation_id: number;
  title: string;
}

function Sidebar() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/conversations`)
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch((err) => console.error("❌ 대화 목록 불러오기 실패", err));
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h1 className="logo">AskLogic</h1>

      <div className="conversation-list">
        {conversations.map((conv) => (
          <div key={conv.conversation_id} className="conversation-item">
            {conv.title}
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default Sidebar;
