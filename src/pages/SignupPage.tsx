import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../api/auth";
import "./AuthPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState<"ELEMENTARY" | "UNIV" | "GRAD">("UNIV");

  const handleSignup = async () => {
    try {
      await signupApi(email, password, nickname, level);
      alert("회원가입 성공!");
      navigate("/login");
    } catch {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
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
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="auth-input"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as "ELEMENTARY" | "UNIV" | "GRAD")}
          className="auth-input"
        >
          <option value="ELEMENTARY">초등학생</option>
          <option value="UNIV">대학생</option>
          <option value="GRAD">대학원생</option>
        </select>

        <button onClick={handleSignup} className="auth-button">회원가입</button>
        <p className="auth-bottom-text">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
