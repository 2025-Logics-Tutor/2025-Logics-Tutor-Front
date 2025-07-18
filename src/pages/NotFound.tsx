// src/pages/NotFound.tsx
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">페이지를 찾을 수 없습니다.</p>
      <button className="notfound-button" onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default NotFound;
