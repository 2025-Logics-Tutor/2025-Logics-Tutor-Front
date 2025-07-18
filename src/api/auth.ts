// src/api/auth.ts

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
  
// src/api/auth.ts

// src/api/auth.ts

export async function signupApi(
    email: string,
    password: string,
    nickname: string,
    level: "ELEMENTARY" | "UNIV" | "GRAD"
  ) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname, level }),
    });
  
    if (!res.ok) {
      throw new Error("회원가입 실패");
    }
  
    return res.json(); // { message: "회원가입 성공" }
  }
  