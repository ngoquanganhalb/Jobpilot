// "use client";

// import { ENV } from "@/config/env";
// import { tokenManager } from "@/core/tokenManager";

// export type User = {
//   id: string;
//   email: string;
//   name: string;
//   avatar_url?: string;
//   role?: string;
// };

// export type LoginResponse = {
//   accessToken: string;
//   user: User;
// };
// async function authFetch(
//   path: string,
//   init?: RequestInit,
//   ignoreBaseUrl?: boolean
// ) {
//   let url;
//   // Gọi trực tiếp backend qua domain public
//   if (!ignoreBaseUrl) {
//     url = `${ENV.API_BASE_URL}/auth` + path;
//   } else url = path;

//   return fetch(url, {
//     ...init,
//     credentials: "include", // GỬI cookie refresh_token
//     headers: {
//       "Content-Type": "application/json",
//       ...(init?.headers ?? {}),
//     },
//   });
// }

// // export async function apiLoginWithEmail(email: string, password: string): Promise<User> {
// //   const res = await authFetch(AUTH_ROUTES.LOGIN, {
// //     method: "POST",
// //     body: JSON.stringify({ email, password }),
// //   });

// //   if (!res.ok) {
// //     throw new Error("Invalid email or password");
// //   }

// //   const data: LoginResponse = await res.json();
// //   tokenManager.setAccessToken(data.accessToken);
// //   return data.user;
// // }

// // export async function apiLoginWithGoogle(idToken: string): Promise<User> {
// //   const res = await authFetch(AUTH_ROUTES.LOGIN_GOOGLE, {
// //     method: "POST",
// //     body: JSON.stringify({ idToken }),
// //   });

// //   if (!res.ok) {
// //     throw new Error("Google login failed");
// //   }

// //   const data: LoginResponse = await res.json();
// //   tokenManager.setAccessToken(data.accessToken);
// //   return data.user;
// // }

// // refresh bằng cookie httpOnly
// export async function apiRefreshAccessToken(): Promise<string | null> {
//   const res = await authFetch("/refresh-session", {
//     method: "POST",
//     credentials: "include",
//   });

//   if (!res.ok) {
//     tokenManager.clear();
//     return null;
//   }

//   const data = await res.json(); // { accessToken: string }
//   tokenManager.setAccessToken(data.accessToken);
//   return data.accessToken;
// }

// // gọi /auth/me để lấy profile
// export async function apiGetProfile(): Promise<User | null> {
//   const accessToken = tokenManager.getAccessToken();
//   if (!accessToken) return null;

//   const res = await authFetch(`${ENV.API_BASE_URL}/users/profile`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   if (!res.ok) {
//     return null;
//   }

//   return (await res.json()) as User;
// }

// export async function apiLogout(): Promise<void> {
//   await authFetch("/logout", {
//     method: "POST",
//   });
//   tokenManager.clear();
// }
// src/services/auth/authService.ts
import { ENV } from "@/config/env";
import { authorizedAxiosInstance } from "@/core/axios-custom.helpers";
import { tokenManager } from "@/core/tokenManager";
export class AuthService {
  public static async refreshSession(): Promise<string | null> {
    const res = await fetch(`${ENV.API_BASE_URL}/auth/refresh-session`, {
      method: "POST",
      credentials: "include", // gửi cookie HttpOnly
    });

    if (!res.ok) {
      tokenManager.clear();
      return null;
    }

    const data = await res.json(); // { accessToken }
    tokenManager.setAccessToken(data.accessToken);
    return data.accessToken;
  }

  public static async apiLogout(): Promise<void> {
    await fetch(`${ENV.API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    tokenManager.clear();
  }

  public static apiGetProfile(): Promise<any> {
    return authorizedAxiosInstance.get(`${ENV.API_BASE_URL}/users/profile`);
  }
}
