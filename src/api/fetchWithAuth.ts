// src/api/fetchWithAuth.ts
export async function fetchWithAuth(
    input: RequestInfo,
    init: RequestInit = {}
  ): Promise<Response> {
    const accessToken = localStorage.getItem("access_token");
  
    const authInit: RequestInit = {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    const res = await fetch(input, authInit);
  
    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("리프레시 토큰 없음");
  
      const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
  
      if (!refreshRes.ok) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("토큰 재발급 실패");
      }
  
      const data = await refreshRes.json();
      localStorage.setItem("access_token", data.access_token);
  
      const retryInit: RequestInit = {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${data.access_token}`,
        },
      };
  
      return fetch(input, retryInit);
    }
  
    return res;
  }
  