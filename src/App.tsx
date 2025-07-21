import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ConversationProvider } from "./context/ConversationContext";
import { ChatSessionProvider } from "./context/ChatSessionContext";
import { refreshAccessToken } from "./api/auth";
import ChatBubbleTestPage from "./pages/ChatBubbleTestPage";

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        refreshAccessToken().catch((err) => {
          console.error("🔒 액세스 토큰 갱신 실패:", err);
          localStorage.clear();
          window.location.href = "/login";
        });
      }
    }, 13 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ConversationProvider>
      <ChatSessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<ChatPage />} />
                <Route path="/conversations/:conversationId" element={<ChatPage />} />
                <Route path="/test-bubble" element={<ChatBubbleTestPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatSessionProvider>
    </ConversationProvider>
  );
}

export default App;
