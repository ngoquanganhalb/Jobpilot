// /lib/auth-gateway.ts
"use client";

import { clearAuth, setUser } from "@redux/slices/authSlice";
import {
  authorizedAxiosInstance,
  publicAxiosInstance,
} from "./axios-custom.helpers";
import { store } from "@redux/store";
import { tokenManager } from "./tokenManager";
import { ProfileUser } from "@/dtos/auth/profile-user.dto";
import axios from "axios";
import { ENV } from "@/config/env";

// THAY ĐỔI 1: Thêm queue để tránh multiple refresh
let isRefreshing = false;
let queue: Array<{
  resolve: (v?: unknown) => void;
  reject: (r?: unknown) => void;
}> = [];

function wakeQueue(err: any, token?: string) {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  queue = [];
}

export const AuthGateway = {
  async getSession() {
    try {
      const me = await authorizedAxiosInstance.get<ProfileUser>(
        "/users/profile",
        {
          headers: { "X-Skip-Loading": "1" },
        }
      );
      store.dispatch(
        setUser({ user: me.data.user, permissions: me.data?.permissions ?? [] })
      );
      return me.data;
    } catch (err: any) {
      throw err;
    }
  },
  // THAY ĐỔI 2: Fix refresh để gửi đúng cookie
  async refresh(): Promise<void> {
    if (isRefreshing) {
      await new Promise((resolve, reject) => queue.push({ resolve, reject }));
      return;
    }
    isRefreshing = true;
    const plainAxios = axios.create({
      baseURL: ENV.API_BASE_URL,
      withCredentials: true,
    });
    try {
      // QUAN TRỌNG: withCredentials: true để gửi cookie refresh_token
      // const res = await authorizedAxiosInstance.post(
      //   "/auth/refresh-session",
      //   {}, // body rỗng
      //   {
      //     headers: { "X-Skip-Loading": "1" },
      //     withCredentials: true, // GỬI COOKIE
      //   }
      // );
      // const res = await authService.refreshSession();
      const res = await plainAxios.post(
        "/auth/refresh-session",
        {},
        {
          headers: { "X-Skip-Loading": "1" },
          withCredentials: true,
        }
      );
      const newAccessToken: string | undefined = res.data.data.accessToken;
      if (newAccessToken) {
        tokenManager.setAccessToken(newAccessToken);
      }
      wakeQueue(null, newAccessToken);
    } catch (e) {
      wakeQueue(e);
      throw e;
    } finally {
      isRefreshing = false;
    }
  },

  async performGlobalLogout(opts?: { redirectTo?: string }) {
    try {
      console.log("logout");
      // THAY ĐỔI 3: Gửi withCredentials để BE xóa cookie
      await publicAxiosInstance.post(
        "/auth/logout",
        {},
        {
          headers: { "X-Skip-Loading": "1" },
          withCredentials: true, // Quan trọng
        }
      );
    } catch {}

    tokenManager.clear();
    store.dispatch(clearAuth());

    if (opts?.redirectTo && typeof window !== "undefined") {
      window.location.href = opts.redirectTo;
    }
  },
};
