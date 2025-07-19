// 로그인 API
export async function loginApi(email: string, password: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      throw new Error("로그인 실패");
    }
  
    return res.json(); // { access_token, refresh_token }
  }
  
  // 회원가입 API (닉네임, 레벨 제거됨)
  export async function signupApi(email: string, password: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      throw new Error("회원가입 실패");
    }
  
    return res.json(); // { message: "회원가입 성공" }
  }
  
  // 액세스 토큰 갱신 API
  export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
  
    if (!refreshToken) {
      throw new Error("리프레시 토큰 없음");
    }
  
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("액세스 토큰 갱신 실패");
    }
  
    const data = await res.json(); // { access_token: "..." }
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  }
  