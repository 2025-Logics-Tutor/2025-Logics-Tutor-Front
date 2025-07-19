import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../api/auth";
import "./AuthPage.css";
import Logo from "../components/Logo";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signupApi(email, password);
      alert("회원가입 성공!");
      navigate("/login");
    } catch {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <Logo />
        <h2 className="auth-title">회원가입</h2>
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
        <button onClick={handleSignup} className="auth-button">
          회원가입
        </button>
        <p className="auth-bottom-text">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
