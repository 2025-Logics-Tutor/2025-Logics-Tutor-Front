import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";
import "./AuthPage.css";
import Logo from "../components/Logo";


function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginApi(email, password);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate("/chat");
    } catch {
      alert("로그인 실패");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
      <Logo />
        <h2 className="auth-title">로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button onClick={handleLogin} className="auth-button">로그인</button>
        <p className="auth-bottom-text">
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
