import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ConversationProvider } from "./context/ConversationContext";
import { refreshAccessToken } from "./api/auth";

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        refreshAccessToken().catch((err) => {
          console.error("🔒 액세스 토큰 갱신 실패:", err);
          // 옵션: 실패 시 로그아웃 처리
          // localStorage.clear();
          // window.location.href = "/login";
        });
      }
    }, 13 * 60 * 1000); // 13분마다 갱신 시도

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <ConversationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<ChatPage />} />
              <Route path="/conversations/:conversationId" element={<ChatPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ConversationProvider>
  );
}

export default App;
